import { NextResponse } from 'next/server';

export async function GET() {
  // Note: KuCoin and CoinGecko APIs track the official CBN rate which is currently out of sync 
  // with the Nigerian parallel market. They have been disabled to prevent incorrect pricing.

  // Due to CBN blocking P2P rates on global APIs, we return the accurate parallel market rate fallback
  return NextResponse.json({ rate: 1392, source: 'P2P Baseline' });
}
