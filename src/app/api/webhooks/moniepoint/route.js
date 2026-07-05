import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendPaymentConfirmationEmail } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request) {
  try {
    const bodyText = await request.text();
    let payload;
    try {
      payload = JSON.parse(bodyText);
    } catch (e) {
      console.error("Invalid JSON body received:", bodyText);
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    
    // 1. Verify Moniepoint/Monnify Signature
    const secret = process.env.MONIEPOINT_WEBHOOK_SECRET || 
                   process.env.MONNIFY_SECRET_KEY || 
                   process.env.MONNIFY_CLIENT_SECRET;
                   
    const signature = request.headers.get('moniepoint-signature') ||
                      request.headers.get('monnify-signature') ||
                      request.headers.get('x-moniepoint-signature') ||
                      request.headers.get('signature');

    if (secret && signature) {
      const hash = crypto.createHmac('sha512', secret).update(bodyText).digest('hex');
      if (hash !== signature) {
        console.warn("Webhook Signature Verification Failed.");
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } else {
      console.log("Skipping signature verification: secret or signature header missing.");
    }

    // 2. Identify transaction status (paid or failed)
    const isPaid = payload.eventType === 'SUCCESSFUL_TRANSACTION' || 
                   payload.paymentStatus === 'PAID' || 
                   payload.status === 'SUCCESS' ||
                   payload.status === 'PAID';
                   
    const isFailed = payload.eventType === 'FAILED_TRANSACTION' || 
                     payload.paymentStatus === 'FAILED' || 
                     payload.status === 'FAILED';

    if (isPaid || isFailed) {
      // 3. Extract Order ID or 8-char hex prefix from all possible payload fields
      let orderRef = null;
      const fieldsToInspect = [
        payload.eventData?.paymentReference,
        payload.paymentReference,
        payload.eventData?.paymentDescription,
        payload.paymentDescription,
        payload.eventData?.narration,
        payload.narration,
        payload.eventData?.remarks,
        payload.remarks,
        payload.eventData?.transactionReference,
        payload.transactionReference
      ];
      
      for (const val of fieldsToInspect) {
        if (!val || typeof val !== 'string') continue;
        
        // Match full UUID first
        const uuidMatch = val.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
        if (uuidMatch) {
          orderRef = uuidMatch[0];
          break;
        }
        
        // Match 8-character hex prefix
        const hex8Match = val.match(/\b[0-9a-f]{8}\b/i);
        if (hex8Match) {
          orderRef = hex8Match[0];
        }
      }

      if (!orderRef) {
        console.warn("Could not find any order reference or 8-character prefix in the webhook payload:", payload);
        return NextResponse.json({ error: 'No order reference found' }, { status: 400 });
      }

      let finalOrderId = null;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      if (uuidRegex.test(orderRef)) {
        const { data: exactOrder } = await supabase.from('orders').select('id').eq('id', orderRef).single();
        if (exactOrder) {
          finalOrderId = exactOrder.id;
        }
      }
      
      if (!finalOrderId && orderRef.length === 8) {
        // Find order starting with 8-character prefix
        const { data: matchingOrders } = await supabase.from('orders').select('id').filter('id', 'like', `${orderRef.toLowerCase()}%`);
        if (matchingOrders && matchingOrders.length > 0) {
          finalOrderId = matchingOrders[0].id;
        }
      }

      if (!finalOrderId) {
        console.warn(`No matching order found in database for reference: ${orderRef}`);
        return NextResponse.json({ error: `No matching order found for ${orderRef}` }, { status: 404 });
      }

      // 4. Update the order status in Supabase
      const targetStatus = isPaid ? 'paid' : 'failed';

      // Fetch order details first for email
      const { data: order } = await supabase.from('orders').select('user_id, total_amount').eq('id', finalOrderId).single();

      const { error } = await supabase.from('orders').update({ payment_status: targetStatus }).eq('id', finalOrderId);
      
      if (error) {
        console.error("Webhook database update error:", error);
        return NextResponse.json({ error: 'Failed to update order in database' }, { status: 500 });
      }
      
      console.log(`Successfully updated order ${finalOrderId} payment_status to ${targetStatus}`);

      // Send confirmation email
      if (isPaid && order && order.user_id) {
        const { data: profile } = await supabase.from('profiles').select('email').eq('id', order.user_id).single();
        if (profile && profile.email) {
          await sendPaymentConfirmationEmail({
            toEmail: profile.email,
            orderId: finalOrderId,
            amount: order.total_amount,
            paymentMethod: 'Moniepoint/Monnify Online'
          });
        }
      }

      return NextResponse.json({ success: true, message: `Order updated to ${targetStatus} and email processing triggered` });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Moniepoint Webhook Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
