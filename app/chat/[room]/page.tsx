'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';

interface Msg {
  id: string;
  user: string;
  text: string;
  timestamp: number;
}

export default function ChatRoom({ params }: { params: { room: string } }) {
  const room = params.room;
  const search = useSearchParams();
  const user = search.get('name') ?? 'anon';
  const router = useRouter();

  const [messages, setMessages] = useState<Msg[]>([]);

  // Poll every second
  useEffect(() => {
    let active = true;
    async function fetchLoop() {
      const res = await fetch(`/api/messages?room=${room}`);
      if (active) setMessages(await res.json());
      setTimeout(fetchLoop, 1000);
    }
    fetchLoop();
    return () => {
      active = false;
    };
  }, [room]);

  async function send(text: string) {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room, user, text }),
    });
  }

  return (
    <main className="mx-auto max-w-xl space-y-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Room: {room}</h1>
        <button
          className="text-sm text-sky-700 underline"
          onClick={() => router.push('/')}
        >
          Leave
        </button>
      </header>

      <div className="flex flex-col gap-2">
        {messages.map(m => (
          <ChatMessage
            key={m.id}
            text={m.text}
            user={m.user}
            remaining={60 - Math.floor((Date.now() - m.timestamp) / 1000)}
          />
        ))}
      </div>

      <MessageInput onSend={send} />
    </main>
  );
}
    