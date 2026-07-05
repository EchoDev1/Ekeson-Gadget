import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const revalidate = 60; // Cache at Next.js level for 60 seconds

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const response = NextResponse.json(data);
    // Cache at browser/CDN layer for 60 seconds, with stale-while-revalidate for 10 minutes
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=600');
    return response;
  } catch (error) {
    console.error('Products GET API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
