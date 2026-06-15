import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function makeAdmin() {
  const emailToMakeAdmin = process.argv[2];
  
  if (!emailToMakeAdmin) {
    console.log("Usage: node make_admin.mjs <user_email>");
    process.exit(1);
  }

  console.log(`Attempting to make ${emailToMakeAdmin} an admin...`);

  // First get the user id from profiles or auth
  const { data: profiles, error: findError } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('email', emailToMakeAdmin);

  if (findError) {
    console.error("Error finding user:", findError);
    return;
  }

  if (!profiles || profiles.length === 0) {
    console.error(`User with email ${emailToMakeAdmin} not found in profiles table.`);
    return;
  }

  const userId = profiles[0].id;

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', userId);

  if (updateError) {
    console.error("Failed to update role:", updateError);
    if (updateError.code === '42501') {
      console.error("Permission Denied: You need the SUPABASE_SERVICE_ROLE_KEY to bypass RLS.");
    }
  } else {
    console.log(`Success! ${emailToMakeAdmin} is now an admin.`);
  }
}

makeAdmin();
