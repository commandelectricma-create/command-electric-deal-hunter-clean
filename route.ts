import { NextResponse } from 'next/server';
import { fetchLiveDeals } from '@/lib/fetchers';
import { enrichDeal } from '@/lib/rules';

export async function GET() {
  const raw = await fetchLiveDeals();
  const deals = raw.map(enrichDeal).filter(d => d.qualifies).sort((a, b) => b.score - a.score || b.discount - a.discount);
  return NextResponse.json({ updatedAt: new Date().toISOString(), deals });
}
