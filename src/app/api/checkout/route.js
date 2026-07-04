import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a Supabase client with the service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, totalNgn, formData, cart } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Validate products exist in database to prevent foreign key constraint errors
    const productIds = cart.map(item => item.id);
    const { data: validProducts, error: pError } = await supabase.from('products').select('id').in('id', productIds);
    
    if (pError) {
      return NextResponse.json({ error: 'Failed to validate products' }, { status: 500 });
    }

    const validProductIds = validProducts.map(p => p.id);
    const invalidItems = cart.filter(item => !validProductIds.includes(item.id));
    
    if (invalidItems.length > 0) {
      return NextResponse.json({ 
        error: 'Some items in your cart are no longer available. Please clear your cart and try again.' 
      }, { status: 400 });
    }

    // 1. Insert Order
    // Note: contact_email is omitted because it doesn't exist in the database schema.
    const { data: order, error: orderError } = await supabase.from('orders').insert([{
      user_id: userId || null,
      total_amount: totalNgn,
      status: 'processing',
      payment_status: 'pending',
      shipping_address: `${formData.address} | Method: ${formData.paymentMethod}`,
      contact_phone: formData.phone,
    }]).select().single();

    if (orderError) throw orderError;

    // 2. Insert Order Items
    const orderItems = cart.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    // 3. Send Email Notification to Admin
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Ekeson Gadgets <orders@ekesongroup.com>',
          to: ['office@ekesongroup.com'],
          subject: `New Purchase Received - Order #${order.id.substring(0, 8)}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #1B1B5E;">New Order Received!</h2>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Total Amount:</strong> ₦${totalNgn.toLocaleString()}</p>
              <p><strong>Payment Method / Shipping:</strong> ${order.shipping_address}</p>
              <p><strong>Customer Phone:</strong> ${order.contact_phone}</p>
              <h3>Order Items:</h3>
              <ul>
                ${cart.map(item => `<li>${item.quantity}x ${item.name} - ₦${item.price.toLocaleString()}</li>`).join('')}
              </ul>
              <p style="margin-top: 20px;"><a href="https://ekesongroup.com/admin/orders" style="background: #00AEEF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin Panel</a></p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error("Failed to send admin email notification:", emailErr);
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to process order' }, { status: 500 });
  }
}
