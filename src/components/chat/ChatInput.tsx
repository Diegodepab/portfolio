import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { ChatState } from './types';
import { MetalFx } from '../ui/metal-fx';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  state: ChatState;
  lang: 'en' | 'es';
}

const MAX_CHARS = 250;

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled, state, lang }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState('');

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 100)}px`;
  }, []);

  useEffect(() => {
    // Focus input when idle
    if (state === 'idle' && textareaRef.current) {
      textareaRef.current.focus({ preventScroll: true });
    }
  }, [state]);

  const handleSend = () => {
    const el = textareaRef.current;
    if (!el) return;
    // Remove control characters (except common whitespace) and trim
    // eslint-disable-next-line no-control-regex
    const text = value.replace(/[\u0000-\u0009\u000b-\u001f\u007f-\u009f]/g, '').trim();
    if (!text || text.length > MAX_CHARS) return;
    onSend(text);
    setValue('');
    window.requestAnimationFrame(adjustHeight);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const charCount = value.length;
  const showCharCount = charCount > MAX_CHARS * 0.7;

  return (
    <div className="chat-input-area">
      <div className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          value={value}
          placeholder={lang === 'en' ? 'Ask about Diego...' : 'Pregunta sobre Diego...'}
          rows={1}
          maxLength={MAX_CHARS}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onChange={(event) => {
            setValue(event.target.value);
            adjustHeight();
          }}
          aria-label={lang === 'en' ? 'Type your message' : 'Escribe tu mensaje'}
        />
        {showCharCount && (
          <span className={`chat-char-count ${charCount > MAX_CHARS * 0.9 ? 'chat-char-count--warn' : ''}`}>
            {charCount}/{MAX_CHARS}
          </span>
        )}
      </div>
      <MetalFx theme="dark" variant="button" preset="silver" strength={0.8} normalizeHostStyles={false} className="poke-metal-tint">
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={disabled}
          aria-label={lang === 'en' ? 'Send message' : 'Enviar mensaje'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </MetalFx>
    </div>
  );
};
