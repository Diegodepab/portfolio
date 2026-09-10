import { afterEach, describe, expect, it, vi } from 'vitest';
import { preloadResponsiveImage } from '../src/utils/responsiveImages';

class FakeImage {
  static last: FakeImage;
  src = '';
  sizes = '';
  srcset = '';
  currentSrc = '/selected-320.webp';
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor() { FakeImage.last = this; }
  decode = vi.fn().mockResolvedValue(undefined);
  removeAttribute(name: string) { if (name === 'src') this.src = ''; if (name === 'srcset') this.srcset = ''; }
}
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });
describe('responsive transition decoding', () => {
  it('returns the browser-selected candidate instead of loading the original separately', async () => {
    vi.stubGlobal('Image', FakeImage);
    const promise = preloadResponsiveImage({ src: '/original.webp', srcSet: '/selected-320.webp 320w, /large.webp 640w', sizes: '300px' });
    expect(FakeImage.last.srcset).toContain('320w');
    expect(FakeImage.last.sizes).toBe('300px');
    FakeImage.last.onload?.();
    expect(await promise).toBe('/selected-320.webp');
  });
  it('settles on errors and aborts, allowing the existing image to remain visible', async () => {
    vi.stubGlobal('Image', FakeImage);
    const failed = preloadResponsiveImage({ src: '/missing.webp' });
    FakeImage.last.onerror?.();
    expect(await failed).toBeNull();
    const controller = new AbortController();
    const pending = preloadResponsiveImage({ src: '/pending.webp' }, controller.signal);
    controller.abort();
    expect(await pending).toBeNull();
    expect(FakeImage.last.onload).toBeNull();
    expect(FakeImage.last.src).toBe('');
  });
  it('bounds a download that never settles', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('Image', FakeImage);
    const pending = preloadResponsiveImage({ src: '/stalled.webp' });
    await vi.advanceTimersByTimeAsync(10_000);
    expect(await pending).toBeNull();
  });
});
