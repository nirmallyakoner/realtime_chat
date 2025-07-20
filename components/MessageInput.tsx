'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

interface Props {
  onSend: (text: string) => Promise<void>;
  onTyping?: () => Promise<void>;
  room: string;
  user: string;
}

export default function MessageInput({ onSend, room, user }: Props) {
  const [value, setValue] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingTime = useRef<number>(0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    await onSend(value.trim());
    setValue('');
  }
  
  // Send typing status to the server
  const sendTypingStatus = async () => {
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room, user, isTyping: true }),
      });
    } catch (error) {
      console.error('Failed to send typing status:', error);
    }
  };
  
  // Handle typing event
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    
    // Only send typing status if it's been more than 2 seconds since last typing event
    const now = Date.now();
    if (now - lastTypingTime.current > 2000) {
      lastTypingTime.current = now;
      sendTypingStatus();
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set a new timeout to send typing status after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus();
    }, 2000);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          type="text"
          value={value}
          onChange={handleTyping}
          placeholder="Type a message..."
          style={{
            backgroundColor: 'var(--dark-input-bg)',
            border: 'none',
            color: 'var(--text-light)',
            padding: '12px 15px',
            borderRadius: '50px 0 0 50px'
          }}
        />
        <Button
          variant="success"
          type="submit"
          disabled={!value.trim()}
          style={{
            backgroundColor: 'var(--primary-color)',
            border: 'none',
            borderRadius: '0 50px 50px 0',
            padding: '0 20px'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
          </svg>
        </Button>
      </InputGroup>
    </Form>
  );
}
