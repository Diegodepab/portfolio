import { describe, expect, it } from 'vitest';
import { isWebGLSupported, ensureSharedRenderer } from '../src/components/ui/metal-fx/engine/renderer/core';
import { createInstance } from '../src/components/ui/metal-fx/engine/renderer/loop';

describe('metal-fx graceful degradation', () => {
  it('does not throw when WebGL is unsupported or running in Node/happy-dom', () => {
    expect(() => isWebGLSupported()).not.toThrow();
  });

  it('safely returns null without throwing when WebGL is unavailable', () => {
    expect(() => ensureSharedRenderer()).not.toThrow();
  });

  it('createInstance does not throw when WebGL is unavailable', () => {
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      expect(() =>
        createInstance({
          hostCanvas: canvas,
          cssWidth: 100,
          cssHeight: 40,
          cornerRadius: 20,
          kind: 'pill',
        })
      ).not.toThrow();
    }
  });
});
