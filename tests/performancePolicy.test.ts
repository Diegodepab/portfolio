import { describe, expect, it } from 'vitest';
import { FrameBudget, hasLimitedResources } from '../src/performance/policy';

describe('visual effects admission', () => {
  it('treats missing hardware information as unknown, not as a failure', () => {
    expect(hasLimitedResources({})).toBe(false);
    expect(hasLimitedResources({ hardwareConcurrency: 4, deviceMemory: 4 })).toBe(false);
  });
  it('honours each independent resource constraint', () => {
    expect(hasLimitedResources({ connection: { saveData: true } })).toBe(true);
    expect(hasLimitedResources({ deviceMemory: 2, hardwareConcurrency: 16 })).toBe(true);
    expect(hasLimitedResources({ deviceMemory: 16, hardwareConcurrency: 2 })).toBe(true);
  });
});
describe('sustained frame pressure', () => {
  it('reduces effects when a previously smooth 60 Hz page sustains 30 FPS', () => {
    const budget = new FrameBudget();
    for (let now = 0; now < 1000; now += 1000 / 60) expect(budget.sample(now)).toBe(false);
    let reduced = false;
    for (let now = 1000; now < 7500; now += 1000 / 30) reduced ||= budget.sample(now);
    expect(reduced).toBe(true);
  });
  it('does not downgrade smooth browsers at 30, 60 or 120 Hz', () => {
    for (const interval of [1000 / 30, 1000 / 60, 1000 / 120]) {
      const budget = new FrameBudget();
      for (let now = 0; now < 10_000; now += interval) expect(budget.sample(now)).toBe(false);
    }
  });
  it('requires two consecutive slow windows, tolerating a single stall', () => {
    const budget = new FrameBudget();
    budget.sample(0);
    expect(budget.sample(600)).toBe(false);
    for (let now = 616; now < 4_100; now += 16) expect(budget.sample(now)).toBe(false);
    const slow = new FrameBudget();
    let downgraded = false;
    for (let now = 0; now <= 4_200; now += 70) downgraded ||= slow.sample(now);
    expect(downgraded).toBe(true);
  });
  it('excludes hidden-tab time when resumed', () => {
    const budget = new FrameBudget();
    for (let now = 0; now < 2_100; now += 70) expect(budget.sample(now)).toBe(false);
    budget.reset();
    for (let now = 60_000; now < 62_100; now += 16) expect(budget.sample(now)).toBe(false);
  });
});
