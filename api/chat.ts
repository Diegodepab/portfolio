import Groq from 'groq-sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { retrieveRelevantChunks } from './knowledge.js';
import { RateLimiter } from './rateLimit.js';

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
const rateLimits = new RateLimiter(RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX);

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
  return rateLimits.limited(ip);
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

  return messages[messages.length - 1]?.role === 'user' ? messages : null;
}

function buildSystemPrompt(context: string, lang: Language): string {
  const unavailable = lang === 'es'
    ? 'No dispongo de esa información específica sobre Diego. Puedes contactar directamente con él a través de LinkedIn o en diegodepablo.programa@gmail.com para resolver cualquier duda.'
    : "I don't have that specific information about Diego. Feel free to contact him directly via LinkedIn or at diegodepablo.programa@gmail.com.";

  return `You are dIAgo, the professional and articulate AI portfolio assistant for Diego De Pablo (Software Engineer).
Your mission is to represent Diego's profile accurately and convincingly to tech leads, engineering directors, and tech recruiters.

### RULES & CONVERSATIONAL POLICIES:
1. **Tone & Style**:
   - Strictly professional, concise, intelligent, and mature.
   - **DO NOT USE EMOJIS**. Avoid smiley faces, icons, or casual emojis to maintain a serious, high-credibility engineering tone.
   - Match the user's language (${lang === 'es' ? 'Spanish' : 'English'}).

2. **Handling Greetings, Chitchat & Pings**:
   - **Initial greeting** (e.g. "hola", "buenas", "hi"): Welcome the visitor cordially in 1-2 short sentences, identify yourself as dIAgo, and suggest 2-3 specific topics to explore (e.g. his work on Data Spaces & LLMs at Khaos Research, his Kubernetes GitOps platform, or his academic honours).
   - **Repeated greetings** (e.g. consecutive "hola", "hola", "buenas", "ho"):
     - **NEVER repeat the same reply or greeting formula.**
     - Acknowledge the repeated input with natural, polite composure (e.g. "Hola de nuevo. Si estás explorando las capacidades del asistente, estoy listo para responder cualquier consulta técnica sobre la trayectoria de Diego. ¿Deseas conocer su experiencia en backend, sus proyectos de investigación o su stack tecnológico?").
     - Alternate the suggestions in each turn (e.g. mention mSurgery structural migration, S-BERT ontology alignment in AlignX, or his 10/10 Honours TFG).
   - For short fragments or typos ("ho", "ey", "ok", "test", "probando"): Treat them gracefully as informal conversational pings and offer a quick prompt of what to explore.

3. **Handling Nonsense, Gibberish & Stress-Testing**:
   - If the user sends nonsense, keyboard smashes (e.g. "asdfghjk", "qwerty", "zzzz", "12345", "...."), random fragments, or completely off-topic words:
     - Do NOT hallucinate, invent meanings, or act confused.
     - State calmly and professionally that the input was not recognized or appears to be a test input.
     - Immediately steer the conversation back to Diego by suggesting 2-3 concrete questions or topics.
   - **If the user sends MULTIPLE nonsensical or random inputs in a row**:
     - Inspect the conversation history.
     - Respond with varied, firm, and courteous professionalism:
       - First instance: Explain that the message could not be processed and offer clear options to explore Diego's work.
       - Repeated instances: Note soberly that you are programmed specifically to provide information about Diego De Pablo's engineering profile, and invite a specific technical question or provide Diego's direct contact (email and LinkedIn) if they wish to get in touch.
     - Never repeat the same deflection message.

4. **Accuracy & Boundaries**:
   - Base answers strictly on the provided CONTEXT. Never invent facts, companies, dates, or credentials.
   - If asked about topics outside Diego's professional career or portfolio, reply soberly with: "${unavailable}".
   - Keep answers clear, structured, and easy to scan (use short bullet points when detailing stack or features). Highlight key achievements (Top 5 of promotion, Matrícula de Honor, Khaos Research, mSurgery, SEDIA data space deliverables).

CONTEXT:
${context}`;
}

function getGroqClient(): Groq | null {
  // API_CHAT is a temporary local compatibility alias. New Vercel environments
  // should use GROQ_API_KEY.
  const apiKey = process.env.GROQ_API_KEY || process.env.API_CHAT;
  if (!apiKey) return null;
  return new Groq({ apiKey, timeout: 20_000, maxRetries: 0 });
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
    res.setHeader('Retry-After', String(RATE_LIMIT_WINDOW_MS / 1000));
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

  const lastMessage = messages[messages.length - 1];
  const chunks = retrieveRelevantChunks(lastMessage.content, 4);
  const context = chunks.map((chunk) => chunk.content).join('\n\n---\n\n');
  const references = Array.from(
    new Map(chunks.flatMap((chunk) => chunk.references).map((reference) => [reference.id, reference])).values(),
  );
  const completionMessages = [
    { role: 'system' as const, content: buildSystemPrompt(context, lang) },
    ...messages.slice(-10),
  ];

  const controller = new AbortController();
  const disconnect = () => controller.abort();
  const deadline = setTimeout(disconnect, 25_000);
  res.once('close', disconnect);
  try {
    // Preserve the simple { mensaje } contract while the React client uses the
    // richer streaming conversation contract.
    if (typeof body.mensaje === 'string' && !Array.isArray(body.messages)) {
      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: completionMessages,
        temperature: 0.7,
        max_completion_tokens: 600,
      }, { signal: controller.signal });
      const content = completion.choices[0]?.message?.content || 'Sin respuesta';
      return res.status(200).json({ respuesta: content, content, references });
    }

    const stream = await groq.chat.completions.create({
      model: MODEL,
      messages: completionMessages,
      temperature: 0.7,
      max_completion_tokens: 600,
      stream: true,
    }, { signal: controller.signal });

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
    if (res.destroyed || res.writableEnded) return;
    console.error('Groq chat request failed', error instanceof Error ? error.message : 'Unknown error');
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: lang === 'es' ? 'Error interno' : 'Internal error' })}\n\n`);
      return res.end();
    }
    return res.status(500).json({ error: lang === 'es' ? 'Error interno' : 'Internal error' });
  } finally {
    clearTimeout(deadline);
    res.off('close', disconnect);
  }
}
