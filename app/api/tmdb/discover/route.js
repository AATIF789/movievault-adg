import { NextResponse } from 'next/server';
import { discoverTMDb } from '@/lib/tmdb';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'movie'; // movie | tv
    const params = Object.fromEntries(searchParams.entries());
    delete params.type;
    // Ensure defaults
    if (!params.page) params.page = '1';
    if (!params.sort_by) params.sort_by = 'popularity.desc';
    const data = await discoverTMDb(type, params);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 502 });
  }
}