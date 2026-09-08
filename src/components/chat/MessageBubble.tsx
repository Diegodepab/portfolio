import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../../context/LanguageContext';
import type { ChatMessage } from './types';
import { ThinkingOrb } from '../ui/thinking-orbs/ThinkingOrb';
interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming: boolean;
}

const StreamingDots = () => (
  <span className="chat-streaming-dots" aria-label="Typing...">
    <span /><span /><span />
  </span>
);

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isStreaming }) => {
  const { lang } = useLanguage();

  if (message.role === 'user') {
    return (
      <div className="chat-bubble chat-bubble--user" role="log">
        {message.content}
      </div>
    );
  }

  // Assistant message
  const isEmpty = !message.content && isStreaming;

  return (
    <div className="chat-bubble chat-bubble--assistant" role="log">
      <img
        src="/images/avatar-pixel.webp"
        alt="dIAgo"
        className="chat-bubble-avatar"
        width={32}
        height={32}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <div className="chat-bubble-content">
        {isEmpty ? (
          <div style={{ padding: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ThinkingOrb state="solving" size={20} />
          </div>
        ) : (
          <>
            <ReactMarkdown
              components={{
                a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && <StreamingDots />}
          </>
        )}
        {message.references && message.references.length > 0 && (
          <div className="chat-references">
            {message.references.map(ref => (
              <Link
                key={ref.id}
                to={ref.route}
                className="chat-reference-link"
              >
                {ref.label[lang]} →
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
