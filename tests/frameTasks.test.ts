import { afterEach, expect, it, vi } from 'vitest';
import { cancelVisualMeasurement, scheduleVisualMeasurement } from '../src/performance/frameTasks';
afterEach(() => vi.unstubAllGlobals());
it('coalesces repeated work and finishes every read before any write', () => {
  let callback: FrameRequestCallback = () => {};
  vi.stubGlobal('requestAnimationFrame', (next: FrameRequestCallback) => { callback = next; return 1; });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  const calls: string[] = [];
  const first = {}, second = {}, cancelled = {};
  scheduleVisualMeasurement(first, () => { calls.push('obsolete'); return undefined; });
  scheduleVisualMeasurement(first, () => { calls.push('read-a'); return () => calls.push('write-a'); });
  scheduleVisualMeasurement(second, () => { calls.push('read-b'); return () => calls.push('write-b'); });
  scheduleVisualMeasurement(cancelled, () => { calls.push('cancelled'); return undefined; });
  cancelVisualMeasurement(cancelled);
  callback(0);
  expect(calls).toEqual(['read-a', 'read-b', 'write-a', 'write-b']);
});
