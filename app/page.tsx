'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  function handleJoin() {
    if (!name || !room) return;
    router.push(`/chat/${room}?name=${encodeURIComponent(name)}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Join a Chat Room</h1>
      <input
        className="w-64 rounded border p-2"
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        className="w-64 rounded border p-2"
        placeholder="Room name"
        value={room}
        onChange={e => setRoom(e.target.value)}
      />
      <button
        className="rounded bg-sky-600 px-4 py-2 text-white disabled:opacity-40"
        disabled={!name || !room}
        onClick={handleJoin}
      >
        Join
      </button>
    </main>
  );
}
