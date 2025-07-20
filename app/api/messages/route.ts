import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import store, { Message, TypingStatus } from '@/lib/store';

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get('room');
  const user = req.nextUrl.searchParams.get('user');
  
  if (!room) return NextResponse.json([], { status: 400 });
  
  const messages = store.all(room);
  const typingUsers = user ? store.getTypingUsers(room, user) : [];
  
  return NextResponse.json({
    messages,
    typingUsers
  });
}

export async function POST(req: NextRequest) {
  const { room, user, text, isTyping } = await req.json();
  
  // Handle typing status update
  if (isTyping === true && room && user) {
    store.setTyping(room, user);
    return NextResponse.json({ ok: true });
  }
  
  // Handle message sending
  if (!room || !user || !text) return NextResponse.json({}, { status: 400 });

  const msg: Message = { id: uuid(), room, user, text, timestamp: Date.now() };
  store.add(msg);
  return NextResponse.json({ ok: true });
}
