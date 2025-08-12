import { NextResponse } from 'next/server';
import { searchTMDb } from '@/lib/tmdb';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'multi';
    const query = searchParams.get('query') || '';
    const page = searchParams.get('page') || '1';
    if (!query) return NextResponse.json({ results: [], total_results: 0, page: 1, total_pages: 1 });
    const data = await searchTMDb(type, query, page);
    if (type === 'multi') data.results = (data.results || []).filter(r => r.media_type !== 'person');
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 502 });
  }
}