import Groq from 'groq-sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { retrieveRelevantChunks } from './knowledge';

type Language = 'en' | 'es';
type ChatRole = 'user' | 'assistant';

export interface IncomingMessage {
  role: ChatRole;
  content: string;
}

export interface ChatBody {
  mensaje?: unknown;
  messages?: unknown;
  lang?: unknown;
}

const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 500;
const MAX_TOTAL_LENGTH = 5_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

// Best-effort protection for warm instances. Production-wide rate limits
// should also be configured in Vercel Firewall because instances do not share memory.
const rateLimits = new Map<string, { count: number; windowStart: number }>();

export const config = { maxDuration: 30 };

function getLanguage(value: unknown): Language {
  return value === 'en' ? 'en' : 'es';
}

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const current = rateLimits.get(ip);

  if (!current || now - current.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimits.set(ip, { count: 1, windowStart: now });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

export function parseMessages(body: ChatBody): IncomingMessage[] | null {
  const source = Array.isArray(body.messages)
    ? body.messages
    : typeof body.mensaje === 'string'
      ? [{ role: 'user', content: body.mensaje }]
      : null;

  if (!source || source.length === 0 || source.length > MAX_MESSAGES) return null;

  const messages: IncomingMessage[] = [];
  let totalLength = 0;

  for (const candidate of source) {
    if (!candidate || typeof candidate !== 'object') return null;

    const role = Reflect.get(candidate, 'role');
    const content = Reflect.get(candidate, 'content');
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;

    const normalizedContent = content.trim();
    if (!normalizedContent || normalizedContent.length > MAX_MESSAGE_LENGTH) return null;

    totalLength += normalizedContent.length;
    if (totalLength > MAX_TOTAL_LENGTH) return null;
    messages.push({ role, content: normalizedContent });
  }

  return messages.at(-1)?.role === 'user' ? messages : null;
}

function buildSystemPrompt(context: string, lang: Language): string {
  const unavailable = lang === 'es'
    ? 'Lo siento, no tengo esa información. ¡Contacta a Diego en LinkedIn para averiguarlo!'
    : "I don't have that information. Contact Diego on LinkedIn to find out!";

  return `You are dIAgo, Diego De Pablo's AI portfolio assistant.
Your goal is to SELL Diego's skills and experience to recruiters.

Rules:
- Answer ONLY about Diego's profile, projects, experience, education, or skills.
- Use ONLY the provided CONTEXT. Do not invent facts.
- If the answer is NOT in the CONTEXT, reply EXACTLY: "${unavailable}"
- Keep responses short, highly professional, but friendly. Highlight achievements (like 10/10 Honours).
- Match the user's language (${lang}).

CONTEXT:
${context}`;
}

function getGroqClient(): Groq | null {
  // API_CHAT is a temporary local compatibility alias. New Vercel environments
  // should use GROQ_API_KEY.
  const apiKey = process.env.GROQ_API_KEY || process.env.API_CHAT;
  if (!apiKey) return null;
  return new Groq({ apiKey, timeout: 20_000, maxRetries: 1 });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const body = (req.body ?? {}) as ChatBody;
  const lang = getLanguage(body.lang);

  if (isRateLimited(getClientIp(req))) {
    return res.status(429).json({
      error: lang === 'es'
        ? 'Demasiadas peticiones. Espera un minuto e inténtalo de nuevo.'
        : 'Too many requests. Wait a minute and try again.',
    });
  }

  const messages = parseMessages(body);
  if (!messages) {
    return res.status(400).json({
      error: lang === 'es' ? 'Formato de mensaje no válido.' : 'Invalid message format.',
    });
  }

  const groq = getGroqClient();
  if (!groq) {
    return res.status(503).json({
      error: lang === 'es'
        ? 'El asistente no está configurado temporalmente.'
        : 'The assistant is temporarily unavailable.',
    });
  }

  const lastMessage = messages.at(-1)!;
  const chunks = retrieveRelevantChunks(lastMessage.content, 4);
  const context = chunks.map((chunk) => chunk.content).join('\n\n---\n\n');
  const references = Array.from(
    new Map(chunks.flatMap((chunk) => chunk.references).map((reference) => [reference.id, reference])).values(),
  );
  const completionMessages = [
    { role: 'system' as const, content: buildSystemPrompt(context, lang) },
    ...messages.slice(-10),
  ];

  try {
    // Preserve the simple { mensaje } contract while the React client uses the
    // richer streaming conversation contract.
    if (typeof body.mensaje === 'string' && !Array.isArray(body.messages)) {
      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: completionMessages,
        temperature: 0.5,
        max_completion_tokens: 600,
      });
      const content = completion.choices[0]?.message?.content || 'Sin respuesta';
      return res.status(200).json({ respuesta: content, content, references });
    }

    const stream = await groq.chat.completions.create({
      model: MODEL,
      messages: completionMessages,
      temperature: 0.5,
      max_completion_tokens: 600,
      stream: true,
    });

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) res.write(`data: ${JSON.stringify({ token })}\n\n`);
    }

    if (references.length > 0) {
      res.write(`data: ${JSON.stringify({ references })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
    return res.end();
  } catch (error) {
    console.error('Groq chat request failed', error instanceof Error ? error.message : 'Unknown error');
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: lang === 'es' ? 'Error interno' : 'Internal error' })}\n\n`);
      return res.end();
    }
    return res.status(500).json({ error: lang === 'es' ? 'Error interno' : 'Internal error' });
  }
}
