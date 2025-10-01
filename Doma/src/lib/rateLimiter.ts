// Simple client-side rate limiting
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry || now > entry.resetTime) {
      this.storage.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingTime(key: string): number {
    const entry = this.storage.get(key);
    if (!entry) return 0;
    return Math.max(0, entry.resetTime - Date.now());
  }
}

export const bookingRateLimiter = new RateLimiter(5, 300000); // 5 requests per 5 minutes
export const formRateLimiter = new RateLimiter(10, 60000); // 10 requests per minute