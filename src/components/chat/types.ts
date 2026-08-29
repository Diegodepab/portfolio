import type { LanguageCode } from '../../types/portfolio';

/** A reference to a portfolio entity returned alongside a chat response */
export interface ChatReference {
  type: 'project' | 'experience' | 'education' | 'contact' | 'section';
  id: string;
  label: { en: string; es: string };
  route: string;
}

/** A single message in the conversation */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  references?: ChatReference[];
  timestamp: number;
}

/** Finite states for the chat engine */
export type ChatState = 'idle' | 'sending' | 'streaming' | 'error';

/** Shape sent to the backend */
export interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  lang: LanguageCode;
}

/** Shape returned from the backend (non-streaming fallback) */
export interface ChatResponsePayload {
  content: string;
  references?: ChatReference[];
  error?: string;
}
