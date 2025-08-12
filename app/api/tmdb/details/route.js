import { NextResponse } from 'next/server';
import { getDetails } from '@/lib/tmdb';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    if (!type || !id) return NextResponse.json({ message: 'Missing type or id' }, { status: 400 });
    const data = await getDetails(type, id);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 502 });
  }
}