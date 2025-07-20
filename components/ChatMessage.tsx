import { FC, useContext } from 'react';
import { Card } from 'react-bootstrap';

interface Props {
  text: string;
  user: string;
  remaining: number; // seconds until deletion
}

const ChatMessage: FC<Props> = ({ text, user, remaining }) => {
  // Get the current user from the URL query params
  const currentUser = typeof window !== 'undefined' ? 
    new URLSearchParams(window.location.search).get('name') : '';
  
  // Check if this message is from the current user
  const isCurrentUser = currentUser === user;
  
  return (
    <div className={`d-flex mb-3 ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'}`}>
      <Card 
        className="shadow-sm" 
        style={{
          maxWidth: '80%',
          backgroundColor: isCurrentUser ? 'var(--primary-color)' : 'var(--dark-card-bg)',
          borderRadius: '12px',
          border: 'none'
        }}
      >
        <Card.Body className="p-3">
          <div className="d-flex justify-content-between align-items-center">
            <Card.Subtitle 
              style={{ 
                color: isCurrentUser ? 'rgba(255, 255, 255, 0.9)' : 'var(--text-secondary)'
              }}
            >
              <strong>{user}</strong>
            </Card.Subtitle>
            <small 
              style={{ 
                color: isCurrentUser ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-secondary)',
                fontSize: '0.75rem'
              }}
            >
              {remaining}s
            </small>
          </div>
          <Card.Text 
            className="mt-2 mb-0" 
            style={{ 
              color: isCurrentUser ? 'white' : 'var(--text-light)',
              wordBreak: 'break-word'
            }}
          >
            {text}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChatMessage;
