/**
 * Twitter API Client - Multi-account management
 */

import { TwitterApi, TwitterApiReadWrite v2 } from 'twitter-api-v2';
import { logger } from '../utils/logger.js';
import { Account, TwitterCredentials } from '../types/index.js';

export class TwitterClient {
  private accounts: Map<number, TwitterApi> = new Map();
  private defaultAccount: number = 1;

  constructor() {
    this.initializeAccounts();
  }

  private initializeAccounts(): void {
    // Load account 1
    if (process.env.X_ACCOUNT_1_ACCESS_TOKEN) {
      this.addAccount(1, {
        bearerToken: process.env.X_BEARER_TOKEN || '',
        accessToken: process.env.X_ACCOUNT_1_ACCESS_TOKEN || '',
        apiKey: process.env.X_ACCOUNT_1_API_KEY || '',
        apiSecret: process.env.X_ACCOUNT_1_API_SECRET || ''
      });
    }

    // Load account 2
    if (process.env.X_ACCOUNT_2_ACCESS_TOKEN) {
      this.addAccount(2, {
        bearerToken: process.env.X_BEARER_TOKEN || '',
        accessToken: process.env.X_ACCOUNT_2_ACCESS_TOKEN || '',
        apiKey: process.env.X_ACCOUNT_2_API_KEY || '',
        apiSecret: process.env.X_ACCOUNT_2_API_SECRET || ''
      });
    }

    // Load account 3
    if (process.env.X_ACCOUNT_3_ACCESS_TOKEN) {
      this.addAccount(3, {
        bearerToken: process.env.X_BEARER_TOKEN || '',
        accessToken: process.env.X_ACCOUNT_3_ACCESS_TOKEN || '',
        apiKey: process.env.X_ACCOUNT_3_API_KEY || '',
        apiSecret: process.env.X_ACCOUNT_3_API_SECRET || ''
      });
    }

    // Set default account
    this.defaultAccount = parseInt(process.env.X_DEFAULT_ACCOUNT || '1');

    logger.info(`Initialized ${this.accounts.size} Twitter accounts`);
  }

  private addAccount(index: number, credentials: TwitterCredentials): void {
    try {
      const client = new TwitterApi({
        bearerToken: credentials.bearerToken,
        accessToken: credentials.accessToken,
        apiKey: credentials.apiKey,
        apiSecret: credentials.apiSecret
      });

      this.accounts.set(index, client);
      logger.info(`Added Twitter account ${index}`);
    } catch (error) {
      logger.error(`Failed to add Twitter account ${index}:`, error);
    }
  }

  getClient(accountId?: number): TwitterApi {
    const id = accountId || this.defaultAccount;
    const client = this.accounts.get(id);

    if (!client) {
      throw new Error(`No authenticated account for index ${id}`);
    }

    return client;
  }

  getReadOnlyClient(): v2.TwitterApi | null {
    if (!process.env.X_BEARER_TOKEN) {
      return null;
    }

    return new TwitterApi(process.env.X_BEARER_TOKEN);
  }

  async getMe(accountId?: number): Promise<any> {
    const client = this.getClient(accountId);
    return await client.v2.me();
  }

  async postTweet(text: string, accountId?: number, replyTo?: string): Promise<any> {
    const client = this.getClient(accountId);

    const tweetData: any = { text };
    if (replyTo) {
      tweetData.reply = { in_reply_to_tweet_id: replyTo };
    }

    const result = await client.v2.tweet(tweetData);
    logger.info(`Posted tweet: ${result.data.id}`);
    return result;
  }

  async searchTweets(query: string, maxResults: number = 10, accountId?: number): Promise<any> {
    // Use read-only client for search (bearer token)
    const client = this.getReadOnlyClient();

    if (!client) {
      throw new Error('Bearer token required for search');
    }

    const result = await client.v2.search(query, {
      max_results: maxResults
    });

    return result;
  }

  async getTimeline(accountId?: number, maxResults: number = 10): Promise<any> {
    const client = this.getClient(accountId);
    const me = await client.v2.me();

    const result = await client.v2.userTimeline(me.data.id, {
      max_results: maxResults
    });

    return result;
  }

  async getMentions(accountId?: number, maxResults: number = 10): Promise<any> {
    const client = this.getClient(accountId);
    const me = await client.v2.me();

    const result = await client.v2.userMentionTimeline(me.data.id, {
      max_results: maxResults
    });

    return result;
  }

  async getProfile(accountId?: number): Promise<any> {
    const client = this.getClient(accountId);
    return await client.v2.me();
  }

  async followUser(targetUsername: string, accountId?: number): Promise<any> {
    const client = this.getClient(accountId);

    // First get user ID
    const user = await client.v2.userByUsername(targetUsername);

    // Then follow
    const result = await client.v2.follow(me.data.id, user.data.id);
    return result;
  }

  async likeTweet(tweetId: string, accountId?: number): Promise<any> {
    const client = this.getClient(accountId);
    const me = await client.v2.me();

    const result = await client.v2.like(me.data.id, tweetId);
    logger.info(`Liked tweet: ${tweetId}`);
    return result;
  }

  async retweet(tweetId: string, accountId?: number): Promise<any> {
    const client = this.getClient(accountId);
    const me = await client.v2.me();

    const result = await client.v2.retweet(me.data.id, tweetId);
    logger.info(`Retweeted: ${tweetId}`);
    return result;
  }

  async getUserByUsername(username: string): Promise<any> {
    const client = this.getReadOnlyClient();

    if (!client) {
      throw new Error('Bearer token required');
    }

    return await client.v2.userByUsername(username);
  }

  getActiveAccounts(): number[] {
    return Array.from(this.accounts.keys());
  }
}

// Singleton instance
export const twitterClient = new TwitterClient();
