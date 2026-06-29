import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();

    // 1. Update the order status
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 2. If status is shipped, send email notification
    if (status === 'shipped' && order.contact_email && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Ekeson Gadgets <orders@ekesongadgets.com>',
          to: [order.contact_email],
          subject: `Your Order ${order.id.split('-')[0]} has been Shipped!`,
          html: `
            <div style="font-family: sans-serif; max-w-lg mx-auto; background: #FFFDF5; padding: 40px; border-radius: 20px;">
              <h1 style="color: #1B1B5E; text-transform: uppercase;">Great news!</h1>
              <p style="color: #4a4a68; font-size: 16px;">
                Your order <strong>#${order.id.split('-')[0]}</strong> has been packed and handed over to our delivery partners.
              </p>
              <p style="color: #4a4a68; font-size: 16px;">
                It is currently on its way to your shipping address: <br/>
                <em>${order.shipping_address}</em>
              </p>
              <div style="margin-top: 30px; padding: 20px; background: #1B1B5E; color: white; border-radius: 10px; text-align: center;">
                <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Ekeson Gadgets Premium Logistics</p>
              </div>
            </div>
          `
        });
      } catch (emailError) {
        console.warn('Failed to send Resend email:', emailError);
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
