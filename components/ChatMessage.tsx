import { FC } from 'react';

interface Props {
  text: string;
  user: string;
  remaining: number; // seconds until deletion
}

const ChatMessage: FC<Props> = ({ text, user, remaining }) => (
  <div className="rounded bg-sky-100 p-3 shadow-sm">
    <p className="text-sm text-slate-600">
      <span className="font-semibold">{user}</span>{' '}
      <span className="text-xs text-slate-400">({remaining}s)</span>
    </p>
    <p className="mt-1 break-words">{text}</p>
  </div>
);

export default ChatMessage;
