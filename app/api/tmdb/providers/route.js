import { NextResponse } from 'next/server';
import { getWatchProviders } from '@/lib/tmdb';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // movie | tv
    const id = searchParams.get('id');
    if (!type || !id) return NextResponse.json({ message: 'Missing type or id' }, { status: 400 });
    const data = await getWatchProviders(type, id);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 502 });
  }
}