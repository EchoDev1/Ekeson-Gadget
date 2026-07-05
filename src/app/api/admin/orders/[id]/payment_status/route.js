import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendPaymentConfirmationEmail } from '@/lib/email';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function POST(request, { params }) {
  try {
    const paramsAwaited = await params;
    const { id } = paramsAwaited;
    const { status } = await request.json();

    const { data: order, error } = await supabase
      .from('orders')
      .update({ payment_status: status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send confirmation email if status is being changed to 'paid'
    if (status === 'paid' && order.user_id) {
      const { data: profile } = await supabase.from('profiles').select('email').eq('id', order.user_id).single();
      if (profile && profile.email) {
        await sendPaymentConfirmationEmail({
          toEmail: profile.email,
          orderId: order.id,
          amount: order.total_amount,
          paymentMethod: 'Manual Admin Confirmation'
        });
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
