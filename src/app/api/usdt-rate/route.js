import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // We use a reliable P2P aggregation endpoint or fallback to current black market rates.
    // CoinGecko often returns the official CBN rate which is inaccurate for real crypto transactions in Nigeria.
    const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=USDTNGN', {
      next: { revalidate: 300 }
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data && data.price) {
        return NextResponse.json({ rate: parseFloat(data.price), source: 'Binance' });
      }
    }
  } catch (error) {
    console.error('Error fetching USDT rate:', error);
  }

  // Fallback to a current accurate black market / P2P rate if the API fails
  return NextResponse.json({ rate: 1389, source: 'P2P Baseline Fallback' });
}
