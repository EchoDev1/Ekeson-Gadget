import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=ngn', {
      next: { revalidate: 300 }
    });
    const data = await res.json();
    if (data?.tether?.ngn) {
      return NextResponse.json({ rate: data.tether.ngn, source: 'CoinGecko' });
    }
  } catch (error) {
    console.error('Error fetching USDT rate:', error);
  }

  // Fallback to a baseline P2P rate if the API fails
  return NextResponse.json({ rate: 1392, source: 'P2P Baseline Fallback' });
}
