const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    const sql = `
      ALTER TABLE settings 
      ADD COLUMN IF NOT EXISTS delivery_policy_text TEXT DEFAULT 'This is the default delivery & shipping policy. It can be changed in the admin dashboard.',
      ADD COLUMN IF NOT EXISTS privacy_policy_text TEXT DEFAULT 'This is the default privacy policy. It can be changed in the admin dashboard.',
      ADD COLUMN IF NOT EXISTS refund_policy_text TEXT DEFAULT 'This is the default refund & returns policy. It can be changed in the admin dashboard.',
      ADD COLUMN IF NOT EXISTS terms_policy_text TEXT DEFAULT 'This is the default terms and conditions. It can be changed in the admin dashboard.';
    `;
    
    // Supabase JS doesn't have a direct raw SQL executor for anon key without RPC,
    // so I will just call an RPC if one exists, but wait, maybe I can just do this via REST or maybe there's a different way I applied it?
    // Let me check if there is an RPC 'exec_sql'.
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });
    if (error) {
       console.log("RPC exec_sql failed, trying direct REST or alternative...");
       console.log(error);
    } else {
       console.log("SQL executed successfully via RPC.");
    }
  } catch (err) {
    console.error(err);
  }
}

main();
