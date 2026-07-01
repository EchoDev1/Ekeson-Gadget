import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function POST(request) {
  try {
    const { action, payload } = await request.json();
    
    // Hardcode the URL to prevent Vercel ENV parsing errors (Invalid URL path)
    const supabaseUrl = 'https://azviiiqrfqbbbjigzrwm.supabase.co';
    
    // We MUST use the service role key to bypass RLS for admin operations
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseKey) {
      return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY in Vercel Environment Variables. You must add it to add/edit products.' }, { status: 500 });
    }
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing Database Configuration' }, { status: 500 });
    }
    
    // We use the service role key to completely bypass all RLS rules for the admin dashboard
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    if (action === 'delete') {
      const { error } = await supabaseAdmin.from('products').delete().eq('id', payload.id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'insert') {
      const { error } = await supabaseAdmin.from('products').insert([payload]);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'update') {
      const { id, ...updateData } = payload;
      const { error } = await supabaseAdmin.from('products').update(updateData).eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
