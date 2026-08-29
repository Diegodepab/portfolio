import { afterEach, describe, expect, it, vi } from 'vitest';
import { streamChat } from '../src/services/chatService';

describe('frontend chat service', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts messages to the same-origin Vercel endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ respuesta: 'Respuesta de prueba' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    ));
    vi.stubGlobal('fetch', fetchMock);
    const chunks: string[] = [];
    const onDone = vi.fn();

    await streamChat(
      { messages: [{ role: 'user', content: 'Hola' }], lang: 'es' },
      (chunk) => chunks.push(chunk),
      onDone,
      vi.fn(),
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith('/api/chat', expect.objectContaining({ method: 'POST' }));
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual({
      messages: [{ role: 'user', content: 'Hola' }],
      lang: 'es',
    });
    expect(chunks).toEqual(['Respuesta de prueba']);
    expect(onDone).toHaveBeenCalledOnce();
  });
});
