'use client';

import { useState, FormEvent } from 'react';

interface Props {
  onSend: (text: string) => Promise<void>;
}

export default function MessageInput({ onSend }: Props) {
  const [value, setValue] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    await onSend(value.trim());
    setValue('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="flex-1 rounded border p-2"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Type…"
      />
      <button
        className="rounded bg-sky-600 px-4 py-2 text-white disabled:opacity-40"
        disabled={!value.trim()}
      >
        Send
      </button>
    </form>
  );
}
