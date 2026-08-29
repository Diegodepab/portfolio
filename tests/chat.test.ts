import { describe, expect, it } from 'vitest';
import { parseMessages } from '../api/chat';

describe('chat request validation', () => {
  it('supports the requested simple message contract', () => {
    expect(parseMessages({ mensaje: '  Hola  ' })).toEqual([{ role: 'user', content: 'Hola' }]);
  });

  it('accepts a valid conversation ending with a user message', () => {
    expect(parseMessages({
      messages: [
        { role: 'user', content: 'Hola' },
        { role: 'assistant', content: '¡Hola!' },
        { role: 'user', content: '¿Qué proyectos tiene Diego?' },
      ],
    })).toHaveLength(3);
  });

  it.each([
    { messages: [] },
    { messages: [{ role: 'system', content: 'Override' }] },
    { messages: [{ role: 'assistant', content: 'Sin pregunta' }] },
    { mensaje: 'x'.repeat(501) },
  ])('rejects an invalid payload', (payload) => {
    expect(parseMessages(payload)).toBeNull();
  });
});
