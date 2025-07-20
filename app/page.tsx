'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  function handleJoin() {
    if (!name || !room) return;
    router.push(`/chat/${room}?name=${encodeURIComponent(name)}`);
  }

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={5} className="mx-auto" style={{ maxWidth: '550px' }}>
          <div className="p-4 rounded shadow w-100" style={{ backgroundColor: 'var(--dark-card-bg)' }}>
            {/* Chat Icon */}
            <div className="text-center mb-3">
              <div className="d-inline-flex justify-content-center align-items-center rounded-circle" 
                   style={{ width: '80px', height: '80px', backgroundColor: 'var(--primary-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" className="bi bi-chat" viewBox="0 0 16 16">
                  <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                </svg>
              </div>
            </div>
            
            <h1 className="text-center mb-2" style={{ color: 'var(--primary-color)', fontSize: '28px' }}>Join a Chat Room</h1>
            <p className="text-center mb-4" style={{ color: 'var(--text-secondary)' }}>Connect with others in real-time conversations</p>
            
            <Form>
              <Form.Group className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--primary-color)" className="bi bi-person" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                  </svg>
                  <span className="ms-2">Your Name</span>
                </div>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ 
                    backgroundColor: 'var(--dark-input-bg)', 
                    border: 'none', 
                    color: 'var(--text-light)',
                    padding: '12px'
                  }}
                />
              </Form.Group>
              
              <Form.Group className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--primary-color)" className="bi bi-chat-left" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                  </svg>
                  <span className="ms-2">Room Name</span>
                </div>
                <Form.Control
                  type="text"
                  placeholder="Enter room name"
                  value={room}
                  onChange={e => setRoom(e.target.value)}
                  style={{ 
                    backgroundColor: 'var(--dark-input-bg)', 
                    border: 'none', 
                    color: 'var(--text-light)',
                    padding: '12px'
                  }}
                />
              </Form.Group>
              
              <div className="d-grid">
                <Button
                  variant="success"
                  size="lg"
                  disabled={!name || !room}
                  onClick={handleJoin}
                  style={{ 
                    backgroundColor: 'var(--primary-color)', 
                    border: 'none',
                    padding: '12px',
                    fontWeight: '600'
                  }}
                >
                  Join Room
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
