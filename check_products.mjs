import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndClear() {
  console.log("Fetching products...");
  const { data, error } = await supabase.from('products').select('*');
  console.log("Found products:", data?.length);
  
  if (data && data.length > 0) {
    // Try to delete one by one
    for (const p of data) {
      const { error: delErr } = await supabase.from('products').delete().eq('id', p.id);
      if (delErr) {
        console.error("Failed to delete", p.id, delErr);
      } else {
        console.log("Deleted", p.id, p.name);
      }
    }
  } else if (error) {
    console.error("Error fetching:", error);
  }
}

checkAndClear();
