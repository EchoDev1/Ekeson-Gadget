const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testUpdate() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("URL:", supabaseUrl);
  
  try {
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const settingsData = {
      id: 1,
      hero_title: "Test",
      delivery_policy_text: "a".repeat(2 * 1024 * 1024) // 2MB string
    };

    const { data, error } = await supabaseAdmin
      .from("settings")
      .update({
        ...settingsData,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    console.log("Error:", error);
    console.log("Data:", data);
  } catch (err) {
    console.error("Exception caught:", err);
  }
}

testUpdate();
