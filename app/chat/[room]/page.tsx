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

interface PageProps {
  params: {
    room: string;
  };
}

export default function ChatRoom({ params }: PageProps) {
  const room = params.room;
  const search = useSearchParams();
  const user = search.get('name') ?? 'anon';
  const router = useRouter();

  const [messages, setMessages] = useState<Msg[]>([]);

  // Poll every second
  useEffect(() => {
    let active = true;
    async function fetchLoop() {
      try {
        const res = await fetch(`/api/messages?room=${room}`);
        if (active && res.ok) {
          setMessages(await res.json());
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
      if (active) {
        setTimeout(fetchLoop, 1000);
      }
    }
    fetchLoop();
    return () => {
      active = false;
    };
  }, [room]);

  async function send(text: string) {
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room, user, text }),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
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
            remaining={Math.max(0, 60 - Math.floor((Date.now() - m.timestamp) / 1000))}
          />
        ))}
      </div>

      <MessageInput onSend={send} />
    </main>
  );
}
