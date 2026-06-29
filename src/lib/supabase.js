import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = 'https://' + supabaseUrl;
}
if (!supabaseUrl) {
  supabaseUrl = 'https://placeholder.supabase.co';
}

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key_here'
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  : 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
