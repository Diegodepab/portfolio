import { describe, expect, it } from 'vitest';
import { retrieveRelevantChunks } from '../api/knowledge';

describe('portfolio knowledge retrieval', () => {
  it('finds accented Spanish concepts', () => {
    const chunks = retrieveRelevantChunks('¿Qué experiencia tiene Diego con ontologías?');

    expect(chunks.some((chunk) => chunk.content.includes('AlignX Ontology Mapper'))).toBe(true);
  });

  it('returns the profile as a safe fallback', () => {
    const chunks = retrieveRelevantChunks('xyzzy plugh');

    expect(chunks).toHaveLength(1);
    expect(chunks[0]?.category).toBe('profile');
  });

  it('does not return more chunks than requested', () => {
    expect(retrieveRelevantChunks('Diego Python Docker React experiencia proyectos', 2)).toHaveLength(2);
  });
});
