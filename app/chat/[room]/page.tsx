'use client';

import { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import { useEffect, useState } from 'react';

interface Msg {
  id: string;
  user: string;
  text: string;
  timestamp: number;
}

interface ApiResponse {
  messages: Msg[];
  typingUsers: string[];
}

interface PageProps {
  params: Promise<{ room: string }>;
}

export default function ChatRoom({ params }: PageProps) {
  const { room } = use(params);
  const search = useSearchParams();
  const user = search.get('name') ?? 'anon';
  const router = useRouter();

  const [messages, setMessages] = useState<Msg[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    async function fetchLoop() {
      try {
        const res = await fetch(`/api/messages?room=${room}&user=${user}`);
        if (active && res.ok) {
          const data: ApiResponse = await res.json();
          setMessages(data.messages);
          setTypingUsers(data.typingUsers);
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
  }, [room, user]);

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
    <Container fluid className="min-vh-100 d-flex flex-column p-0" style={{ backgroundColor: 'var(--dark-bg)' }}>
      {/* Header */}
      <div className="p-3" style={{ backgroundColor: 'var(--dark-card-bg)', borderBottom: '1px solid #2a2a2a' }}>
        <div className="d-flex justify-content-between align-items-center container">
          <div className="d-flex align-items-center">
            <div className="d-flex justify-content-center align-items-center rounded-circle me-2" 
                 style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-color)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-chat" viewBox="0 0 16 16">
                <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
              </svg>
            </div>
            <div>
              <h1 className="h5 mb-0" style={{ color: 'var(--text-light)' }}>Room: {room}</h1>
              <small style={{ color: 'var(--text-secondary)' }}>Connected as {user}</small>
            </div>
          </div>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => router.push('/')}
            className="d-flex align-items-center"
            style={{ borderColor: '#2a2a2a' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right me-1" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
              <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
            Leave
          </Button>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-grow-1 overflow-auto p-3" style={{ maxHeight: 'calc(100vh - 140px)' }}>
        <div className="container">
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
              {messages.length === 0 ? (
                <div className="text-center my-5" style={{ color: 'var(--text-secondary)' }}>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <>
                  {messages.map(m => (
                    <ChatMessage
                      key={m.id}
                      text={m.text}
                      user={m.user}
                      remaining={Math.max(0, 60 - Math.floor((Date.now() - m.timestamp) / 1000))}
                    />
                  ))}
                  
                  {typingUsers.length > 0 && (
                    <div className="typing-indicator mb-3" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <div className="d-flex align-items-center">
                        <div className="typing-animation me-2">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                        <span>
                          {typingUsers.length === 1
                            ? `${typingUsers[0]} is typing...`
                            : `${typingUsers.join(', ')} are typing...`}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Col>
          </Row>
        </div>
      </div>
      
      {/* Message Input */}
      <div className="p-3 mt-auto" style={{ backgroundColor: 'var(--dark-card-bg)', borderTop: '1px solid #2a2a2a' }}>
        <div className="container">
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
              <MessageInput onSend={send} room={room} user={user} />
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  );
}
