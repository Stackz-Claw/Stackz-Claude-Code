/**
 * TypeScript type definitions for X MCP Server
 */

export interface TwitterCredentials {
  bearerToken: string;
  accessToken: string;
  apiKey: string;
  apiSecret: string;
}

export interface Account {
  index: number;
  username: string;
  credentials: TwitterCredentials;
}

export interface TweetData {
  text: string;
  accountId?: number;
  replyTo?: string;
}

export interface SearchQuery {
  query: string;
  maxResults?: number;
  accountId?: number;
}

export interface TimelineQuery {
  accountId: number;
  maxResults?: number;
}

export interface MentionsQuery {
  accountId: number;
  maxResults?: number;
}

export interface FollowUserQuery {
  accountId: number;
  targetUsername: string;
}

export interface LikeTweetQuery {
  accountId: number;
  tweetId: string;
}

export interface RetweetQuery {
  accountId: number;
  tweetId: string;
}

export interface GetProfileQuery {
  accountId: number;
}

export interface ToolResponse {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    retryAfter?: number;
  };
}

export interface RateLimitInfo {
  remaining: number;
  reset: number;
  limit: number;
}
