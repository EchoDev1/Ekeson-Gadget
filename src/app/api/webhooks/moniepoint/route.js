import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request) {
  try {
    const bodyText = await request.text();
    const payload = JSON.parse(bodyText);
    
    // 1. Verify Monnify/Moniepoint Signature
    // The secret key should be in your Vercel Environment Variables as MONIEPOINT_WEBHOOK_SECRET
    const secret = process.env.MONIEPOINT_WEBHOOK_SECRET;
    const signature = request.headers.get('monnify-signature');

    if (secret && signature) {
      const hash = crypto.createHmac('sha512', secret).update(bodyText).digest('hex');
      if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // 2. Handle the Event
    // Monnify sends eventType "SUCCESSFUL_TRANSACTION"
    if (payload.eventType === 'SUCCESSFUL_TRANSACTION' || payload.paymentStatus === 'PAID') {
      const orderId = payload.eventData.paymentReference || payload.paymentReference; 
      
      if (!orderId) {
        return NextResponse.json({ error: 'No reference found' }, { status: 400 });
      }

      // Update order to paid
      const { error } = await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', orderId);
      
      if (error) {
        console.error("Webhook update error:", error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
      }
      
      return NextResponse.json({ success: true, message: 'Order marked as paid' });
    }

    // Handle failed transactions
    if (payload.eventType === 'FAILED_TRANSACTION' || payload.paymentStatus === 'FAILED') {
      const orderId = payload.eventData.paymentReference || payload.paymentReference; 
      
      const { error } = await supabase.from('orders').update({ payment_status: 'failed' }).eq('id', orderId);
      
      if (error) {
        console.error("Webhook update error:", error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
      }
      
      return NextResponse.json({ success: true, message: 'Order marked as failed' });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Moniepoint Webhook Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
