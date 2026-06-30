async function testYadio() {
  const url = 'https://corsproxy.io/?' + encodeURIComponent('https://api.yadio.io/exrates/NGN');
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Yadio NGN:", data);
  } catch(e) {
    console.log("Failed", e);
  }
}
testYadio();
