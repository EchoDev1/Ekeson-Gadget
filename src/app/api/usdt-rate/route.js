import { NextResponse } from 'next/server';

export async function GET() {
  // We use KuCoin as the primary highly-updated rate, and CoinGecko as the fallback.
  
  try {
    // 1. KuCoin Exchange Rate API (Highly accurate and rarely blocked)
    const kucoinRes = await fetch('https://api.kucoin.com/api/v1/prices?base=NGN&currencies=USDT', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (kucoinRes.ok) {
      const kucoinData = await kucoinRes.json();
      if (kucoinData?.data?.USDT) {
        return NextResponse.json({ rate: parseFloat(kucoinData.data.USDT), source: 'KuCoin' });
      }
    }
  } catch (error) {
    console.warn("KuCoin fetch failed");
  }

  try {
    // 2. CoinGecko API Fallback
    const cgRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=ngn', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 60 }
    });

    if (cgRes.ok) {
      const cgData = await cgRes.json();
      if (cgData?.tether?.ngn) {
        return NextResponse.json({ rate: parseFloat(cgData.tether.ngn), source: 'CoinGecko' });
      }
    }
  } catch (error) {
    console.warn("CoinGecko fetch failed");
  }

  // If all APIs fail, we return a 500 so the frontend can fallback to the Admin manual rate (1500)
  return NextResponse.json(
    { rate: null, error: 'Failed to fetch live rate from all aggregators' }, 
    { status: 500 }
  );
}
