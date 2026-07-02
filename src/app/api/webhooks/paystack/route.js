import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request) {
  try {
    // 1. Verify Paystack Signature (Highly Recommended for Security)
    // The secret key should ideally be in env variables: process.env.PAYSTACK_SECRET_KEY
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const bodyText = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (secret && signature) {
      const hash = crypto.createHmac('sha512', secret).update(bodyText).digest('hex');
      if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(bodyText);

    // 2. Handle the Event
    if (payload.event === 'charge.success') {
      const orderId = payload.data.reference; // We passed the order.id as reference
      
      // Update order to paid
      const { error } = await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', orderId);
      
      if (error) {
        console.error("Webhook update error:", error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
      }
      
      return NextResponse.json({ success: true, message: 'Order marked as paid' });
    }

    if (payload.event === 'charge.failed' || payload.event === 'charge.reversed') {
      const orderId = payload.data.reference; 
      
      // Update order to failed
      const { error } = await supabase.from('orders').update({ payment_status: 'failed' }).eq('id', orderId);
      
      if (error) {
        console.error("Webhook update error:", error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
      }
      
      return NextResponse.json({ success: true, message: 'Order marked as failed' });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paystack Webhook Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
