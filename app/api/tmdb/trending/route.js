import { NextResponse } from 'next/server';
import { getTrending } from '@/lib/tmdb';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all';
    const window = searchParams.get('window') || 'day';
    const page = searchParams.get('page') || '1';
    const data = await getTrending(type, window, page);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 502 });
  }
}