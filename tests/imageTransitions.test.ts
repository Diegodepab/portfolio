import { describe, expect, it } from 'vitest';
import {
  CSS_TRANSITION_EFFECTS,
  createEffectQueue,
  isPixelTransition,
  shuffleEffects,
  type ImageTransitionEffect,
} from '../src/components/ui/image-transitions/effects';

describe('image transition effects', () => {
  it('shuffles without losing weighted entries', () => {
    const source: ImageTransitionEffect[] = ['sweep', 'sweep', 'fade', 'pixels-mechanic'];
    const shuffled = shuffleEffects(source, () => 0.25);

    expect(shuffled).toHaveLength(source.length);
    expect([...shuffled].sort()).toEqual([...source].sort());
  });

  it('does not begin a fresh queue with the previous effect when alternatives exist', () => {
    const queue = createEffectQueue(['sweep', 'fade', 'sweep'], 'sweep', () => 0.99);

    expect(queue[0]).toBe('fade');
  });

  it('falls back to the lightweight CSS pool when no effects are supplied', () => {
    const queue = createEffectQueue([], null, () => 0.5);

    expect(queue.sort()).toEqual([...CSS_TRANSITION_EFFECTS].sort());
  });

  it('identifies only WebGL-backed effects as pixel transitions', () => {
    expect(isPixelTransition('pixels-mechanic')).toBe(true);
    expect(isPixelTransition('pixels-organic')).toBe(true);
    expect(isPixelTransition('sweep')).toBe(false);
    expect(isPixelTransition('fade')).toBe(false);
  });
});

