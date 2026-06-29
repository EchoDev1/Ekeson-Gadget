fetch('http://localhost:3000/api/admin/settings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer Udi'
  },
  body: JSON.stringify({
    hero_title: "Test",
    delivery_policy_text: "test",
    privacy_policy_text: "test",
    refund_policy_text: "test",
    terms_policy_text: "test"
  })
}).then(res => res.json()).then(console.log).catch(console.error);
