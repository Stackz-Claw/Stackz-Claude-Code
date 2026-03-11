"use strict";
/**
 * Twitter API Client - Multi-account management
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitterClient = exports.TwitterClient = void 0;
const twitter_api_v2_1 = __importDefault(require("twitter-api-v2"));
const logger_js_1 = require("../utils/logger.js");
class TwitterClient {
    constructor() {
        this.accounts = new Map();
        this.defaultAccount = 1;
        this.initializeAccounts();
    }
    initializeAccounts() {
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
        logger_js_1.logger.info(`Initialized ${this.accounts.size} Twitter accounts`);
    }
    addAccount(index, credentials) {
        try {
            const client = new twitter_api_v2_1.default({
                bearerToken: credentials.bearerToken,
                accessToken: credentials.accessToken,
                apiKey: credentials.apiKey,
                apiSecret: credentials.apiSecret
            });
            this.accounts.set(index, client);
            logger_js_1.logger.info(`Added Twitter account ${index}`);
        }
        catch (error) {
            logger_js_1.logger.error(`Failed to add Twitter account ${index}:`, error);
        }
    }
    getClient(accountId) {
        const id = accountId || this.defaultAccount;
        const client = this.accounts.get(id);
        if (!client) {
            throw new Error(`No authenticated account for index ${id}`);
        }
        return client;
    }
    getReadOnlyClient() {
        if (!process.env.X_BEARER_TOKEN) {
            return null;
        }
        return new twitter_api_v2_1.default(process.env.X_BEARER_TOKEN);
    }
    async getMe(accountId) {
        const client = this.getClient(accountId);
        return await client.v2.me();
    }
    async postTweet(text, accountId, replyTo) {
        const client = this.getClient(accountId);
        const tweetData = { text };
        if (replyTo) {
            tweetData.reply = { in_reply_to_tweet_id: replyTo };
        }
        const result = await client.v2.tweet(tweetData);
        logger_js_1.logger.info(`Posted tweet: ${result.data.id}`);
        return result;
    }
    async searchTweets(query, maxResults = 10, accountId) {
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
    async getTimeline(accountId, maxResults = 10) {
        const client = this.getClient(accountId);
        const me = await client.v2.me();
        const result = await client.v2.userTimeline(me.data.id, {
            max_results: maxResults
        });
        return result;
    }
    async getMentions(accountId, maxResults = 10) {
        const client = this.getClient(accountId);
        const me = await client.v2.me();
        const result = await client.v2.userMentionTimeline(me.data.id, {
            max_results: maxResults
        });
        return result;
    }
    async getProfile(accountId) {
        const client = this.getClient(accountId);
        return await client.v2.me();
    }
    async followUser(targetUsername, accountId) {
        const client = this.getClient(accountId);
        // Get current user ID first
        const me = await client.v2.me();
        // Then get target user ID
        const user = await client.v2.userByUsername(targetUsername);
        // Then follow
        const result = await client.v2.follow(me.data.id, user.data.id);
        return result;
    }
    async likeTweet(tweetId, accountId) {
        const client = this.getClient(accountId);
        const me = await client.v2.me();
        const result = await client.v2.like(me.data.id, tweetId);
        logger_js_1.logger.info(`Liked tweet: ${tweetId}`);
        return result;
    }
    async retweet(tweetId, accountId) {
        const client = this.getClient(accountId);
        const me = await client.v2.me();
        const result = await client.v2.retweet(me.data.id, tweetId);
        logger_js_1.logger.info(`Retweeted: ${tweetId}`);
        return result;
    }
    async getUserByUsername(username) {
        const client = this.getReadOnlyClient();
        if (!client) {
            throw new Error('Bearer token required');
        }
        return await client.v2.userByUsername(username);
    }
    async getBookmarks(accountId, maxResults = 25) {
        const client = this.getClient(accountId);
        // Get bookmarks (saved tweets)
        const result = await client.v2.bookmarks({
            max_results: maxResults
        });
        return result;
    }
    async getBookmarksWithMedia(accountId, maxResults = 25) {
        const client = this.getClient(accountId);
        // Get bookmarks with expansions for included data
        const result = await client.v2.bookmarks({
            max_results: maxResults,
            expansions: ['attachments.media_keys', 'author_id'],
            'tweet.fields': ['created_at', 'public_metrics', 'entities'],
            'user.fields': ['username', 'name', 'profile_image_url'],
            'media.fields': ['url', 'preview_image_url', 'type']
        });
        return result;
    }
    getActiveAccounts() {
        return Array.from(this.accounts.keys());
    }
}
exports.TwitterClient = TwitterClient;
// Singleton instance
exports.twitterClient = new TwitterClient();
//# sourceMappingURL=client.js.map