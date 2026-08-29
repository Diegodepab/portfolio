import type { ChatRequest, ChatReference } from '../components/chat/types';

const CHAT_ENDPOINT = '/api/chat';
const MAX_MESSAGE_LENGTH = 500;
const MIN_INTERVAL_MS = 2000;

let lastSentAt = 0;

/**
 * Sends a chat request and streams the response.
 *
 * @param request  — The messages and language to send
 * @param onChunk  — Called for each text chunk as it arrives
 * @param onDone   — Called when the stream finishes, with optional references
 * @param onError  — Called on any error with a user-friendly message
 * @param signal   — AbortSignal to cancel the request
 */
export async function streamChat(
  request: ChatRequest,
  onChunk: (text: string) => void,
  onDone: (references?: ChatReference[]) => void,
  onError: (message: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  // Client-side rate limiting
  const now = Date.now();
  if (now - lastSentAt < MIN_INTERVAL_MS) {
    onError(request.lang === 'en'
      ? 'Please wait a moment before sending another message.'
      : 'Espera un momento antes de enviar otro mensaje.');
    return;
  }
  lastSentAt = now;

  // Input validation
  const lastMessage = request.messages[request.messages.length - 1];
  if (!lastMessage || lastMessage.content.trim().length === 0) {
    return;
  }
  if (lastMessage.content.length > MAX_MESSAGE_LENGTH) {
    onError(request.lang === 'en'
      ? `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).`
      : `El mensaje es demasiado largo (máx. ${MAX_MESSAGE_LENGTH} caracteres).`);
    return;
  }

  try {
    const response = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal,
    });

    if (!response.ok) {
      // Try to parse an error message from the body
      const errorBody = await response.text().catch(() => '');
      let userMessage: string;
      try {
        const parsed = JSON.parse(errorBody);
        if (parsed.error && typeof parsed.error === 'string' && !parsed.error.includes('API') && !parsed.error.includes('key')) {
          userMessage = parsed.error;
        } else {
          throw new Error();
        }
      } catch {
        userMessage = request.lang === 'en'
          ? 'I couldn\'t process your question. Please try again.'
          : 'No he podido procesar tu pregunta. Inténtalo de nuevo.';
      }
      onError(userMessage);
      return;
    }

    const contentType = response.headers.get('content-type') || '';

    // SSE / streaming response
    if (contentType.includes('text/event-stream') && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let references: ChatReference[] | undefined;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              continue;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.token) {
                onChunk(parsed.token);
              }
              if (parsed.references) {
                references = parsed.references;
              }
              if (parsed.error && typeof parsed.error === 'string') {
                onError(parsed.error);
                return;
              }
            } catch {
              // Not JSON, treat as raw token
              if (data.trim()) {
                onChunk(data);
              }
            }
          }
        }
      }

      onDone(references);
      return;
    }

    // JSON fallback (non-streaming)
    const json = await response.json();
    const content = json.content ?? json.respuesta;
    if (typeof content === 'string' && content) {
      onChunk(content);
    }
    onDone(json.references);
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return; // User cancelled, not an error
    }
    onError(request.lang === 'en'
      ? 'I couldn\'t process your question. Please try again.'
      : 'No he podido procesar tu pregunta. Inténtalo de nuevo.');
  }
}
