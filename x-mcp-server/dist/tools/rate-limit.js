"use strict";
/**
 * Rate Limiter - Prevents hitting Twitter API rate limits
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
const logger_js_1 = require("../utils/logger.js");
class RateLimiter {
    constructor() {
        this.limits = new Map();
        // Default rate limits (Twitter API v2)
        this.defaultLimits = {
            tweets: { limit: 17, window: 24 * 60 * 60 * 1000 }, // 17 per 24 hours
            follows: { limit: 400, window: 24 * 60 * 60 * 1000 }, // 400 per 24 hours
            likes: { limit: 1000, window: 24 * 60 * 60 * 1000 }, // 1000 per 24 hours
            search: { limit: 180, window: 15 * 60 * 1000 } // 180 per 15 minutes
        };
    }
    /**
     * Check if request is allowed under rate limits
     */
    async checkLimit(endpoint, customLimit, customWindow) {
        const now = Date.now();
        const limitConfig = this.defaultLimits[endpoint];
        if (!limitConfig) {
            // Unknown endpoint, allow but warn
            logger_js_1.logger.warn(`Unknown rate limit endpoint: ${endpoint}`);
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
        entry.timestamps = entry.timestamps.filter(timestamp => now - timestamp < entry.window);
        // Check if under limit
        if (entry.timestamps.length >= limit) {
            const oldestValid = entry.timestamps[0];
            const retryAfter = Math.ceil((oldestValid + entry.window - now) / 1000);
            logger_js_1.logger.warn(`Rate limit exceeded for ${endpoint}. Retry after ${retryAfter} seconds`);
            throw new Error(`Rate limit exceeded for ${endpoint}. Try again in ${retryAfter} seconds.`);
        }
        // Add current timestamp
        entry.timestamps.push(now);
        logger_js_1.logger.debug(`Rate limit check passed for ${endpoint}. Remaining: ${limit - entry.timestamps.length}`);
        return true;
    }
    /**
     * Get remaining requests for an endpoint
     */
    getRemaining(endpoint) {
        const entry = this.limits.get(endpoint);
        if (!entry) {
            return entry?.limit || 0;
        }
        const now = Date.now();
        const validTimestamps = entry.timestamps.filter(timestamp => now - timestamp < entry.window);
        return Math.max(0, entry.limit - validTimestamps.length);
    }
    /**
     * Get reset time for an endpoint
     */
    getResetTime(endpoint) {
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
    reset(endpoint) {
        this.limits.delete(endpoint);
        logger_js_1.logger.info(`Rate limit reset for ${endpoint}`);
    }
    /**
     * Reset all rate limits
     */
    resetAll() {
        this.limits.clear();
        logger_js_1.logger.info('All rate limits reset');
    }
    /**
     * Get status of all rate limits
     */
    getStatus() {
        const status = {};
        for (const [endpoint, entry] of this.limits.entries()) {
            status[endpoint] = {
                remaining: this.getRemaining(endpoint),
                reset: this.getResetTime(endpoint)
            };
        }
        return status;
    }
}
exports.RateLimiter = RateLimiter;
//# sourceMappingURL=rate-limit.js.map