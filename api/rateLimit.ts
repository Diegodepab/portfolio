/** Bounded warm-instance protection; deployment-wide limits belong at the edge. */
export class RateLimiter {
  private entries = new Map<string, { count: number; expires: number }>();
  constructor(privateWindow = 60_000, privateMax = 10, privateCapacity = 5_000) {
    this.windowMs = privateWindow;
    this.max = privateMax;
    this.capacity = privateCapacity;
  }
  private windowMs: number;
  private max: number;
  private capacity: number;
  limited(key: string, now = Date.now()): boolean {
    for (const [id, entry] of this.entries) if (entry.expires <= now) this.entries.delete(id);
    const entry = this.entries.get(key);
    if (entry) return ++entry.count > this.max;
    // Do not evict active limits when many distinct clients arrive.
    if (this.entries.size >= this.capacity) return true;
    this.entries.set(key, { count: 1, expires: now + this.windowMs });
    return false;
  }
}
