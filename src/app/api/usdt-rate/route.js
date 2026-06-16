import { NextResponse } from 'next/server';

export async function GET() {
  // We try Binance P2P first, then fallback to OKX P2P, then fallback to Bybit P2P
  
  try {
    // 1. Binance P2P
    const binanceRes = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: JSON.stringify({
        "page": 1,
        "rows": 1,
        "payTypes": [],
        "asset": "USDT",
        "tradeType": "BUY",
        "fiat": "NGN",
        "publisherType": null
      }),
      next: { revalidate: 300 } // Cache for 5 minutes to prevent rate limits
    });

    if (binanceRes.ok) {
      const binanceData = await binanceRes.json();
      if (binanceData?.data?.[0]?.adv?.price) {
        return NextResponse.json({ rate: parseFloat(binanceData.data[0].adv.price), source: 'Binance P2P' });
      }
    }
  } catch (error) {
    console.warn("Binance P2P fetch failed");
  }

  try {
    // 2. OKX P2P Fallback
    const okxRes = await fetch('https://www.okx.com/v3/c2c/tradingOrders/books?quoteCurrency=ngn&baseCurrency=usdt&side=sell&paymentMethod=all', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      next: { revalidate: 300 }
    });
    
    if (okxRes.ok) {
      const okxData = await okxRes.json();
      if (okxData?.data?.sell?.[0]?.price) {
        return NextResponse.json({ rate: parseFloat(okxData.data.sell[0].price), source: 'OKX P2P' });
      }
    }
  } catch (error) {
    console.warn("OKX P2P fetch failed");
  }

  try {
    // 3. Bybit P2P Fallback
    const bybitRes = await fetch('https://api2.bybit.com/fiat/otc/item/online', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: JSON.stringify({
        userId: "", tokenId: "USDT", currencyId: "NGN", payment: [], side: "1", size: "10", page: "1", amount: "", authMaker: false, canTrade: false
      }),
      next: { revalidate: 300 }
    });

    if (bybitRes.ok) {
      const bybitData = await bybitRes.json();
      if (bybitData?.result?.items?.[0]?.price) {
        return NextResponse.json({ rate: parseFloat(bybitData.result.items[0].price), source: 'Bybit P2P' });
      }
    }
  } catch (error) {
    console.warn("Bybit P2P fetch failed");
  }

  // If all P2P APIs fail (e.g. Cloudflare blocked), we return a 500 so the frontend can fallback to the Admin manual rate
  return NextResponse.json(
    { rate: null, error: 'Failed to fetch live P2P rate from all aggregators' }, 
    { status: 500 }
  );
}
