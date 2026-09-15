import { describe, expect, it } from 'vitest';
import { RateLimiter } from '../api/rateLimit';

describe('warm-instance rate limit', () => {
  it('expires limits and admits new clients without evicting active limits', () => {
    const limiter = new RateLimiter(1000, 2, 1);
    expect(limiter.limited('a', 0)).toBe(false);
    expect(limiter.limited('a', 1)).toBe(false);
    expect(limiter.limited('a', 2)).toBe(true);
    expect(limiter.limited('b', 3)).toBe(true);
    expect(limiter.limited('b', 1000)).toBe(false);
    expect(limiter.limited('a', 1001)).toBe(true);
  });
});
