import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== 'Bearer Udi') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const settingsData = await request.json();
    
    // We use the SERVICE_ROLE_KEY to completely bypass database Row Level Security (RLS) blocks
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Missing SUPABASE_SERVICE_ROLE_KEY in .env.local file. Please add it to save settings.' 
      }, { status: 500 });
    }

    // Create a powerful backend client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Update settings (id = 1)
    const { data, error } = await supabaseAdmin
      .from("settings")
      .update({
        ...settingsData,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    if (error) {
      console.error("Supabase Admin Update Error:", error);
      return NextResponse.json({ error: error.message || "Database update failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
