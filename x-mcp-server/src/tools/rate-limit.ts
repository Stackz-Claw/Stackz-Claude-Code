/**
 * Rate Limiter - Prevents hitting Twitter API rate limits
 */

import { logger } from '../utils/logger.js';

interface RateLimitEntry {
  timestamps: number[];
  limit: number;
  window: number;
}

export class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();

  // Default rate limits (Twitter API v2)
  private defaultLimits = {
    tweets: { limit: 17, window: 24 * 60 * 60 * 1000 },      // 17 per 24 hours
    follows: { limit: 400, window: 24 * 60 * 60 * 1000 },    // 400 per 24 hours
    likes: { limit: 1000, window: 24 * 60 * 60 * 1000 },    // 1000 per 24 hours
    search: { limit: 180, window: 15 * 60 * 1000 }           // 180 per 15 minutes
  };

  /**
   * Check if request is allowed under rate limits
   */
  async checkLimit(endpoint: string, customLimit?: number, customWindow?: number): Promise<boolean> {
    const now = Date.now();
    const limitConfig = this.defaultLimits[endpoint as keyof typeof this.defaultLimits];

    if (!limitConfig) {
      // Unknown endpoint, allow but warn
      logger.warn(`Unknown rate limit endpoint: ${endpoint}`);
      return true;
    }

    const limit = customLimit || limitConfig.limit;
    const window = customWindow || limitConfig.window;

    let entry = this.limits.get(endpoint);

    if (!entry) {
      entry = {
        timestamps: [],
        limit,
        window
      };
      this.limits.set(endpoint, entry);
    }

    // Clean up expired timestamps
    entry.timestamps = entry.timestamps.filter(
      timestamp => now - timestamp < entry!.window
    );

    // Check if under limit
    if (entry.timestamps.length >= limit) {
      const oldestValid = entry.timestamps[0];
      const retryAfter = Math.ceil((oldestValid + entry.window - now) / 1000);

      logger.warn(`Rate limit exceeded for ${endpoint}. Retry after ${retryAfter} seconds`);

      throw new Error(`Rate limit exceeded for ${endpoint}. Try again in ${retryAfter} seconds.`);
    }

    // Add current timestamp
    entry.timestamps.push(now);

    logger.debug(`Rate limit check passed for ${endpoint}. Remaining: ${limit - entry.timestamps.length}`);

    return true;
  }

  /**
   * Get remaining requests for an endpoint
   */
  getRemaining(endpoint: string): number {
    const entry = this.limits.get(endpoint);

    if (!entry) {
      return entry?.limit || 0;
    }

    const now = Date.now();
    const validTimestamps = entry.timestamps.filter(
      timestamp => now - timestamp < entry.window
    );

    return Math.max(0, entry.limit - validTimestamps.length);
  }

  /**
   * Get reset time for an endpoint
   */
  getResetTime(endpoint: string): number | null {
    const entry = this.limits.get(endpoint);

    if (!entry || entry.timestamps.length === 0) {
      return null;
    }

    const oldestTimestamp = Math.min(...entry.timestamps);
    return oldestTimestamp + entry.window;
  }

  /**
   * Reset rate limit for an endpoint
   */
  reset(endpoint: string): void {
    this.limits.delete(endpoint);
    logger.info(`Rate limit reset for ${endpoint}`);
  }

  /**
   * Reset all rate limits
   */
  resetAll(): void {
    this.limits.clear();
    logger.info('All rate limits reset');
  }

  /**
   * Get status of all rate limits
   */
  getStatus(): Record<string, { remaining: number; reset: number | null }> {
    const status: Record<string, { remaining: number; reset: number | null }> = {};

    for (const [endpoint, entry] of this.limits.entries()) {
      status[endpoint] = {
        remaining: this.getRemaining(endpoint),
        reset: this.getResetTime(endpoint)
      };
    }

    return status;
  }
}
