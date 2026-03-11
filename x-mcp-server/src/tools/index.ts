/**
 * MCP Tools Registration
 * Registers all Twitter tools with the MCP server
 */

import { McpServer, Tool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { twitterClient } from '../client.js';
import { logger } from '../utils/logger.js';
import { RateLimiter } from './rate-limit.js';

// Tool definitions
const tools: Tool[] = [
  {
    name: 'post_tweet',
    description: 'Post a new tweet from any managed Twitter/X account',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The text content of the tweet (max 280 characters)'
        },
        accountId: {
          type: 'number',
          description: 'Account index to post from (1, 2, or 3). Default: 1'
        },
        replyTo: {
          type: 'string',
          description: 'Tweet ID to reply to (optional)'
        }
      },
      required: ['text']
    }
  },
  {
    name: 'search_tweets',
    description: 'Search for tweets matching a query',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (supports Twitter search operators)'
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of results (1-100, default: 10)',
          minimum: 1,
          maximum: 100
        },
        accountId: {
          type: 'number',
          description: 'Account index for rate limiting (optional)'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_timeline',
    description: 'Get recent tweets from an account timeline',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'number',
          description: 'Account index (1, 2, or 3)'
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of tweets (1-100, default: 10)',
          minimum: 1,
          maximum: 100
        }
      },
      required: ['accountId']
    }
  },
  {
    name: 'get_mentions',
    description: 'Get recent mentions of an account',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'number',
          description: 'Account index (1, 2, or 3)'
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of mentions (1-100, default: 10)',
          minimum: 1,
          maximum: 100
        }
      },
      required: ['accountId']
    }
  },
  {
    name: 'get_profile',
    description: 'Get profile information for an account',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'number',
          description: 'Account index (1, 2, or 3)'
        }
      },
      required: ['accountId']
    }
  },
  {
    name: 'follow_user',
    description: 'Follow a user on Twitter/X',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'number',
          description: 'Account index (1, 2, or 3)'
        },
        targetUsername: {
          type: 'string',
          description: 'Username to follow (without @)'
        }
      },
      required: ['accountId', 'targetUsername']
    }
  },
  {
    name: 'like_tweet',
    description: 'Like a tweet',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'number',
          description: 'Account index (1, 2, or 3)'
        },
        tweetId: {
          type: 'string',
          description: 'Tweet ID to like'
        }
      },
      required: ['accountId', 'tweetId']
    }
  },
  {
    name: 'retweet',
    description: 'Retweet a tweet',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'number',
          description: 'Account index (1, 2, or 3)'
        },
        tweetId: {
          type: 'string',
          description: 'Tweet ID to retweet'
        }
      },
      required: ['accountId', 'tweetId']
    }
  },
  {
    name: 'get_account_info',
    description: 'Get information about managed accounts',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_bookmarks',
    description: 'Get your saved tweets (bookmarks) from X. Returns tweets you have bookmarked for later reading. Use this to sync your X bookmarks into the idea brainstorm workflow.',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'number',
          description: 'Account index (1, 2, or 3)'
        },
        maxResults: {
          type: 'number',
          description: 'Maximum number of bookmarks to fetch (1-100, default: 25)'
        },
        includeMedia: {
          type: 'boolean',
          description: 'Include media attachments in response (default: true)'
        }
      },
      required: []
    }
  }
];

// Rate limiter instance
const rateLimiter = new RateLimiter();

/**
 * Register all tools with the MCP server
 */
export function registerTools(server: McpServer): void {
  // Register each tool
  server.tool('post_tweet', async (args: any) => {
    try {
      // Check rate limit
      await rateLimiter.checkLimit('tweets', 17, 24 * 60 * 60 * 1000);

      const result = await twitterClient.postTweet(
        args.text,
        args.accountId,
        args.replyTo
      );

      return {
        success: true,
        data: {
          tweetId: result.data.id,
          text: args.text
        }
      };
    } catch (error: any) {
      logger.error('post_tweet error:', error);
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message || 'Failed to post tweet'
        }
      };
    }
  });

  server.tool('search_tweets', async (args: any) => {
    try {
      // Check rate limit
      await rateLimiter.checkLimit('search', 180, 15 * 60 * 1000);

      const result = await twitterClient.searchTweets(
        args.query,
        args.maxResults || 10,
        args.accountId
      );

      return {
        success: true,
        data: {
          tweets: result.data || [],
          count: result.meta?.result_count || 0
        }
      };
    } catch (error: any) {
      logger.error('search_tweets error:', error);
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message || 'Failed to search tweets'
        }
      };
    }
  });

  server.tool('get_timeline', async (args: any) => {
    try {
      const result = await twitterClient.getTimeline(
        args.accountId,
        args.maxResults || 10
      );

      return {
        success: true,
        data: {
          tweets: result.data || [],
          count: result.meta?.result_count || 0
        }
      };
    } catch (error: any) {
      logger.error('get_timeline error:', error);
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message || 'Failed to get timeline'
        }
      };
    }
  });

  server.tool('get_mentions', async (args: any) => {
    try {
      const result = await twitterClient.getMentions(
        args.accountId,
        args.maxResults || 10
      );

      return {
        success: true,
        data: {
          mentions: result.data || [],
          count: result.meta?.result_count || 0
        }
      };
    } catch (error: any) {
      logger.error('get_mentions error:', error);
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message || 'Failed to get mentions'
        }
      };
    }
  });

  server.tool('get_profile', async (args: any) => {
    try {
      const profile = await twitterClient.getProfile(args.accountId);

      return {
        success: true,
        data: profile.data
      };
    } catch (error: any) {
      logger.error('get_profile error:', error);
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message || 'Failed to get profile'
        }
      };
    }
  });

  server.tool('follow_user', async (args: any) => {
    try {
      await rateLimiter.checkLimit('follows', 400, 24 * 60 * 60 * 1000);

      const result = await twitterClient.followUser(
        args.targetUsername,
        args.accountId
      );

      return {
        success: true,
        data: {
          following: args.targetUsername
        }
      };
    } catch (error: any) {
      logger.error('follow_user error:', error);
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message || 'Failed to follow user'
        }
      };
    }
  });

  server.tool('like_tweet', async (args: any) => {
    try {
      await rateLimiter.checkLimit('likes', 1000, 24 * 60 * 60 * 1000);

      const result = await twitterClient.likeTweet(
        args.tweetId,
        args.accountId
      );

      return {
        success: true,
        data: {
          liked: args.tweetId
        }
      };
    } catch (error: any) {
      logger.error('like_tweet error:', error);
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message || 'Failed to like tweet'
        }
      };
    }
  });

  server.tool('retweet', async (args: any) => {
    try {
      await rateLimiter.checkLimit('tweets', 17, 24 * 60 * 60 * 1000);

      const result = await twitterClient.retweet(
        args.tweetId,
        args.accountId
      );

      return {
        success: true,
        data: {
          retweeted: args.tweetId
        }
      };
    } catch (error: any) {
      logger.error('retweet error:', error);
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message || 'Failed to retweet'
        }
      };
    }
  });

  server.tool('get_account_info', async () => {
    try {
      const accounts = twitterClient.getActiveAccounts();

      const accountDetails = await Promise.all(
        accounts.map(async (id) => {
          try {
            const profile = await twitterClient.getProfile(id);
            return {
              index: id,
              username: profile.data.username,
              name: profile.data.name,
              followers: profile.data.public_metrics?.followers_count || 0,
              following: profile.data.public_metrics?.following_count || 0
            };
          } catch {
            return {
              index: id,
              username: 'unknown',
              error: 'Failed to fetch'
            };
          }
        })
      );

      return {
        success: true,
        data: {
          accounts: accountDetails,
          default: twitterClient.getActiveAccounts()[0] || 1
        }
      };
    } catch (error: any) {
      logger.error('get_account_info error:', error);
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message || 'Failed to get account info'
        }
      };
    }
  });

  server.tool('get_bookmarks', async (args: any) => {
    try {
      const maxResults = args.maxResults || 25;
      const includeMedia = args.includeMedia !== false;

      let result;
      if (includeMedia) {
        result = await twitterClient.getBookmarksWithMedia(args.accountId, maxResults);
      } else {
        result = await twitterClient.getBookmarks(args.accountId, maxResults);
      }

      // Extract tweet URLs and format response
      const tweets = (result.data || []).map((tweet: any) => {
        const urls = tweet.entities?.urls?.map((u: any) => u.expanded_url) || [];
        return {
          id: tweet.id,
          text: tweet.text,
          created_at: tweet.created_at,
          author_id: tweet.author_id,
          public_metrics: tweet.public_metrics,
          urls: urls,
          has_urls: urls.length > 0,
          has_media: tweet.attachments?.media_keys?.length > 0
        };
      });

      return {
        success: true,
        data: {
          tweets: tweets,
          count: tweets.length,
          includes: result.includes || null
        }
      };
    } catch (error: any) {
      logger.error('get_bookmarks error:', error);
      return {
        success: false,
        error: {
          code: error.code || 'ERROR',
          message: error.message || 'Failed to get bookmarks'
        }
      };
    }
  });

  logger.info(`Registered ${tools.length} MCP tools`);
}
