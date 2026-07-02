const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: cols, error: err } = await supabase.rpc('exec_sql', { 
    sql_string: "SELECT column_name FROM information_schema.columns WHERE table_name = 'orders';"
  });
  console.log("Cols:", cols, "Err:", err);

  const { data: pol, error: polErr } = await supabase.rpc('exec_sql', { 
    sql_string: "SELECT policyname, cmd FROM pg_policies WHERE tablename = 'order_items';"
  });
  console.log("Policies:", pol, "Err:", polErr);
}
check();
