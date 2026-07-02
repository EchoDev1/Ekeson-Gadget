const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testInsert() {
  const { data, error } = await supabase.from('orders').insert([{
    total_amount: 100,
    status: 'processing',
    payment_status: 'pending',
    shipping_address: 'Test',
    contact_phone: '123',
    contact_email: 'test@test.com'
  }]);
  
  console.log("Insert with email error:", error?.message || "Success");

  const { data: d2, error: e2 } = await supabase.from('orders').insert([{
    total_amount: 100,
    status: 'processing',
    payment_status: 'pending',
    shipping_address: 'Test',
    contact_phone: '123'
  }]).select().single();
  
  console.log("Insert without email error:", e2?.message || "Success");
  
  if (d2) {
      console.log("Inserted order ID:", d2.id);
      // Try to insert order items
      const { data: d3, error: e3 } = await supabase.from('order_items').insert([{
          order_id: d2.id,
          product_id: null,
          quantity: 1,
          unit_price: 100
      }]);
      console.log("Insert order_item with service role error:", e3?.message || "Success");
      
      // Try with anon key
      const anonSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      const { data: d4, error: e4 } = await anonSupabase.from('order_items').insert([{
          order_id: d2.id,
          product_id: null,
          quantity: 1,
          unit_price: 100
      }]);
      console.log("Insert order_item with anon role error:", e4?.message || "Success");
  }
}
testInsert();
