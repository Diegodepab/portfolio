export type EffectsQuality = 'full' | 'reduced';
export type EffectsReason = 'preparing' | 'ready' | 'preference' | 'limited-device' | 'graphics-unavailable' | 'graphics-failure' | 'slow-frames';

export interface PerformanceHints {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  connection?: { saveData?: boolean };
}

export function hasLimitedResources(hints: PerformanceHints): boolean {
  return hints.connection?.saveData === true
    || (typeof hints.deviceMemory === 'number' && hints.deviceMemory < 4)
    || (typeof hints.hardwareConcurrency === 'number' && hints.hardwareConcurrency < 4);
}

/** Samples browser RAF cadence, never the renderer's deliberately capped FPS. */
export class FrameBudget {
  private last: number | null = null;
  private start = 0;
  private count = 0;
  private slow = 0;
  private badWindows = 0;

  reset() {
    this.last = null;
    this.start = this.count = this.slow = this.badWindows = 0;
  }

  sample(now: number): boolean {
    if (this.last === null) {
      this.last = this.start = now;
      return false;
    }
    this.count++;
    if (now - this.last > 50) this.slow++;
    this.last = now;
    if (now - this.start < 2_000) return false;
    this.badWindows = this.slow / this.count > 0.2 ? this.badWindows + 1 : 0;
    this.start = now;
    this.count = this.slow = 0;
    return this.badWindows >= 2;
  }
}
