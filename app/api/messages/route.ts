import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import store, { Message } from '@/lib/store';

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get('room');
  if (!room) return NextResponse.json([], { status: 400 });
  return NextResponse.json(store.all(room));
}

export async function POST(req: NextRequest) {
  const { room, user, text } = await req.json();
  if (!room || !user || !text) return NextResponse.json({}, { status: 400 });

  const msg: Message = { id: uuid(), room, user, text, timestamp: Date.now() };
  store.add(msg);
  return NextResponse.json({ ok: true });
}
