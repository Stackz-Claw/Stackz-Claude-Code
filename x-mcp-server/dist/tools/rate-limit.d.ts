/**
 * Rate Limiter - Prevents hitting Twitter API rate limits
 */
export declare class RateLimiter {
    private limits;
    private defaultLimits;
    /**
     * Check if request is allowed under rate limits
     */
    checkLimit(endpoint: string, customLimit?: number, customWindow?: number): Promise<boolean>;
    /**
     * Get remaining requests for an endpoint
     */
    getRemaining(endpoint: string): number;
    /**
     * Get reset time for an endpoint
     */
    getResetTime(endpoint: string): number | null;
    /**
     * Reset rate limit for an endpoint
     */
    reset(endpoint: string): void;
    /**
     * Reset all rate limits
     */
    resetAll(): void;
    /**
     * Get status of all rate limits
     */
    getStatus(): Record<string, {
        remaining: number;
        reset: number | null;
    }>;
}
//# sourceMappingURL=rate-limit.d.ts.map