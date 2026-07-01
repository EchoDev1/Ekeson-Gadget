import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

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

    // 1. Insert Order
    // Note: contact_email is omitted because it doesn't exist in the database schema.
    const { data: order, error: orderError } = await supabase.from('orders').insert([{
      user_id: userId || null,
      total_amount: totalNgn,
      status: 'processing',
      payment_status: 'pending',
      shipping_address: formData.address,
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

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to process order' }, { status: 500 });
  }
}
