async function getBinanceSpot() {
  try {
    const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=USDTNGN');
    const data = await res.json();
    console.log("Binance Spot NGN:", data);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
getBinanceSpot();
