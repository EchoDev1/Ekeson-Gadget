import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== 'Bearer Udi') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const settingsData = await request.json();
    
    // We use the SERVICE_ROLE_KEY to completely bypass database Row Level Security (RLS) blocks
    // Hardcode the known correct URL to prevent Vercel env var typo issues
    const supabaseUrl = 'https://azviiiqrfqbbbjigzrwm.supabase.co';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Missing SUPABASE_SERVICE_ROLE_KEY in .env.local file. Please add it to save settings.' 
      }, { status: 500 });
    }

    // Create a powerful backend client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });
    // Sanitize numeric fields (like usdt_rate) to prevent invalid numeric input syntax errors in PostgreSQL
    const sanitizedSettings = { ...settingsData };
    if (sanitizedSettings.usdt_rate === "" || sanitizedSettings.usdt_rate === undefined) {
      sanitizedSettings.usdt_rate = null;
    } else if (typeof sanitizedSettings.usdt_rate === 'string') {
      const parsed = parseFloat(sanitizedSettings.usdt_rate);
      sanitizedSettings.usdt_rate = isNaN(parsed) ? null : parsed;
    }

    // Update settings (id = 1)
    let { data, error } = await supabaseAdmin
      .from("settings")
      .update({
        ...sanitizedSettings,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    let warning = null;
    let retryResult = null;
    if (error && error.code === '42703') {
      console.warn("category_writeups column not found. Retrying update without category_writeups...");
      const { category_writeups, ...settingsWithoutWriteups } = sanitizedSettings;
      retryResult = await supabaseAdmin
        .from("settings")
        .update({
          ...settingsWithoutWriteups,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      if (retryResult.error) {
        return NextResponse.json({ error: retryResult.error.message }, { status: 500 });
      }      
      warning = "category_writeups column does not exist in your database settings table. Run the SQL migration in your Supabase SQL Editor to enable category editing.";
      error = null;
    }

    if (error) {
      console.error("Supabase Admin Update Error:", error);
      return NextResponse.json({ error: error.message || "Database update failed" }, { status: 500 });
    }

    // Clear the Next.js cache so all frontend pages update instantly
    const { revalidatePath } = require('next/cache');
    revalidatePath('/', 'layout');
    return NextResponse.json({ 
      success: true, 
      message: warning ? `Settings saved successfully. (Warning: ${warning})` : 'Settings saved successfully' 
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || 'Internal server error', stack: error.stack }, { status: 500 });
  }
}
