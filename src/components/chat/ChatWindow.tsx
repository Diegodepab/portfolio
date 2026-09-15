import { imageAssets } from '../../data/imageAssets';
import './ChatWindow.css';
import React, { useEffect, useRef } from 'react';
import { FiRotateCcw, FiX } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { useChat } from '../../hooks/useChat';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { SuggestedQuestions } from './SuggestedQuestions';

interface ChatWindowProps {
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const { lang } = useLanguage();
  const { messages, state, sendMessage, clearConversation, stopPending } = useChat();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    stopPending();
    onClose();
  };

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({ top: container.scrollHeight, behavior: 'instant' });
    }
  }, [messages]);

  // Focus trap: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, stopPending]);

  // Focus the window on mount
  useEffect(() => {
    windowRef.current?.focus({ preventScroll: true });
  }, []);

  const inputDisabled = state === 'sending' || state === 'streaming';
  const hasMessages = messages.length > 0;

  return (
    <div
      className="chat-window"
      ref={windowRef}
      role="dialog"
      aria-modal="false"
      aria-label={lang === 'en' ? 'Chat with dIAgo' : 'Chat con dIAgo'}
      tabIndex={-1}
    >
      {/* Header */}
      <div className="chat-header">
        <img
          src={imageAssets['/images/avatar-pixel.webp'].src}
              srcSet={imageAssets['/images/avatar-pixel.webp'].srcSet} sizes="40px"
          alt="dIAgo"
          className="chat-header-avatar"
          width={40}
          height={40}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="chat-header-info">
          <h4>dIAgo</h4>
          <span>
            {state === 'streaming'
              ? (lang === 'en' ? 'Typing...' : 'Escribiendo...')
              : (lang === 'en' ? 'Diego\'s AI assistant' : 'Asistente IA de Diego')}
          </span>
        </div>
        <div className="chat-header-actions">
          {hasMessages && (
            <button
              onClick={clearConversation}
              aria-label={lang === 'en' ? 'Clear conversation' : 'Limpiar conversación'}
              title={lang === 'en' ? 'Clear' : 'Limpiar'}
            >
              <FiRotateCcw size={16} />
            </button>
          )}
          <button
            onClick={handleClose}
            aria-label={lang === 'en' ? 'Close chat' : 'Cerrar chat'}
            title={lang === 'en' ? 'Close' : 'Cerrar'}
          >
            <FiX size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        className="chat-messages" 
        aria-live="polite" 
        aria-relevant="additions"
        ref={messagesContainerRef}
      >
        {!hasMessages && (
          <div className="chat-welcome">
            <strong>{lang === 'en' ? 'Hello' : 'Hola'}</strong>
            {lang === 'en'
              ? 'I am Diego\'s portfolio assistant. You can ask me about his projects, experience, technologies, or education.'
              : 'Soy el asistente del portfolio de Diego. Puedes preguntarme sobre sus proyectos, experiencia, tecnologías o formación.'}
          </div>
        )}
        {messages.map((msg, idx) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={
              state === 'streaming' &&
              msg.role === 'assistant' &&
              idx === messages.length - 1
            }
          />
        ))}
      </div>

      {/* Suggestions */}
      {!hasMessages && (
        <SuggestedQuestions lang={lang} onSelect={sendMessage} />
      )}

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        disabled={inputDisabled}
        state={state}
        lang={lang}
      />
    </div>
  );
};
