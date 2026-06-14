import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use SERVICE_ROLE_KEY if available to bypass RLS, otherwise fallback to ANON_KEY
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase_url')) {
  console.error("Please configure your real Supabase credentials in .env or .env.local to run this script.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearProducts() {
  console.log("Removing dummy products from Supabase...");
  // Using an open-ended inequality to delete all rows. 
  // If you are using the anon key, ensure your RLS allows deletions, or use a service role key.
  const { data, error } = await supabase.from('products').delete().neq('id', 0);
  
  if (error) {
    console.error("Error clearing products:", error);
    if (error.code === '42501') {
       console.error("Permission denied (RLS). Please add SUPABASE_SERVICE_ROLE_KEY to your .env file to bypass RLS for this script.");
    }
  } else {
    console.log("Successfully cleared dummy products from the database!");
  }
}

clearProducts();
