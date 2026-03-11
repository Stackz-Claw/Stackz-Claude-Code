/**
 * X MCP Server - Main Entry Point
 * Multi-account Twitter/X integration for STACKZ agent swarm
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { TwitterClient } from './client.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Load environment variables
dotenv.config();

// Twitter client
const twitterClient = new TwitterClient();

// Sync state file
const SYNC_STATE_FILE = path.join(os.homedir(), '.stackz', 'bookmarks', 'sync-state.json');

// Ensure sync state directory exists
function ensureSyncStateDir() {
  const dir = path.dirname(SYNC_STATE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Read sync state
function readSyncState() {
  ensureSyncStateDir();
  if (!fs.existsSync(SYNC_STATE_FILE)) {
    return { lastSyncTweetId: null, lastSyncTime: null };
  }
  try {
    return JSON.parse(fs.readFileSync(SYNC_STATE_FILE, 'utf-8'));
  } catch {
    return { lastSyncTweetId: null, lastSyncTime: null };
  }
}

// Write sync state
function writeSyncState(state) {
  ensureSyncStateDir();
  fs.writeFileSync(SYNC_STATE_FILE, JSON.stringify(state, null, 2));
}

// Auto-tagging logic
function autoTagTweet(text) {
  const tags = ['x-bookmark'];
  const lowerText = text.toLowerCase();

  // Demand signals
  if (/\b(would pay|wish existed|need a tool|can'?t find|no good option|looking for)\b/i.test(text)) {
    tags.push('signal');
  }
  if (/\b(just launched|hit.*mrr|revenue|paid customers)\b/i.test(text)) {
    tags.push('signal');
  }

  // Competitors
  if (/\b(just released|new tool|launched)\b/i.test(text)) {
    tags.push('competitor');
  }
  if (/\b(vs |better than|alternative to)\b/i.test(text)) {
    tags.push('competitor');
  }

  // Market data
  if (/(\d+%|million|billion|growth|market size|report)/i.test(text)) {
    tags.push('market');
  }

  // Inspiration
  if (/\b(what if|imagine|concept|would be cool)\b/i.test(text)) {
    tags.push('inspiration');
  }

  // Founder stories
  if (/\b(built this because|started|founder|build in public|journey)\b/i.test(text)) {
    tags.push('founder');
  }

  // Tools/APIs
  if (/\b(released api|new integration|just added|library|framework)\b/i.test(text)) {
    tags.push('tool');
  }

  return [...new Set(tags)];
}

// Bookmark storage helpers
const BOOKMARKS_FILE = path.join(os.homedir(), '.stackz', 'bookmarks', 'bookmarks.json');

function ensureBookmarksFile() {
  const dir = path.dirname(BOOKMARKS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(BOOKMARKS_FILE)) {
    fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify({ bookmarks: [], lastUpdated: new Date().toISOString() }, null, 2));
  }
}

function readBookmarks() {
  ensureBookmarksFile();
  return JSON.parse(fs.readFileSync(BOOKMARKS_FILE, 'utf-8'));
}

function writeBookmarks(data) {
  fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify(data, null, 2));
}

function addBookmark(url, notes, tags) {
  const data = readBookmarks();
  const bookmark = {
    id: `bm_${Date.now()}`,
    url,
    notes: notes || '',
    tags: tags || ['x-bookmark'],
    added: new Date().toISOString(),
    used: false,
    source: 'x-bookmark-sync'
  };

  // Check for duplicates
  const exists = data.bookmarks.some(b => b.url === url);
  if (exists) {
    return { success: false, duplicate: true, id: null };
  }

  data.bookmarks.push(bookmark);
  data.lastUpdated = new Date().toISOString();
  writeBookmarks(data);

  return { success: true, id: bookmark.id };
}

// Create MCP server
const server = new Server(
  { name: 'x-twitter', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// Tool definitions
const tools = [
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
      }
    }
  },
  {
    name: 'get_sync_state',
    description: 'Get the current sync state for X bookmarks (last synced tweet ID and timestamp)',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'sync_x_bookmarks',
    description: 'Sync new X bookmarks to the bookmarks store. Fetches saved tweets, extracts URLs, auto-tags them, and adds to the bookmark database.',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'number',
          description: 'Account index (1, 2, or 3)'
        },
        maxResults: {
          type: 'number',
          description: 'Maximum bookmarks to check (default: 25)'
        },
        dryRun: {
          type: 'boolean',
          description: 'If true, only report what would be synced without actually adding'
        }
      }
    }
  },
  {
    name: 'get_account_info',
    description: 'Get information about managed X accounts',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'search_tweets',
    description: 'Search for tweets matching a query',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        maxResults: { type: 'number', default: 10 }
      },
      required: ['query']
    }
  },
  {
    name: 'x_signal_search',
    description: 'Search X for signals and add valuable findings to bookmarks. Use for active idea discovery - searches for pain points, launches, revenue, frustrations, and extracts URLs to save for the brainstorm workflow.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (e.g., "I would pay for a tool that", "frustrated with software", "just launched a tool")'
        },
        maxResults: {
          type: 'number',
          description: 'Maximum tweets to fetch (default: 25)'
        },
        autoAdd: {
          type: 'boolean',
          description: 'If true, automatically add URLs to bookmarks (default: true)'
        },
        minEngagement: {
          type: 'number',
          description: 'Minimum engagement (likes + retweets) to consider (default: 0)'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'x_idea_hunt',
    description: 'Run a pre-configured idea hunt sweep across multiple signal queries. Searches X for: pain points, wishlist features, launches, revenue, frustrations. Adds all URLs to bookmarks for brainstorm.',
    inputSchema: {
      type: 'object',
      properties: {
        topics: {
          type: 'array',
          items: { type: 'string' },
          description: 'Topics to hunt for ideas (e.g., ["AI", "SaaS", "developer tools"])'
        },
        autoAdd: {
          type: 'boolean',
          description: 'Automatically add to bookmarks (default: true)'
        }
      }
    }
  }
];

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'get_bookmarks') {
      const maxResults = args.maxResults || 25;
      const includeMedia = args.includeMedia !== false;

      let result;
      if (includeMedia) {
        result = await twitterClient.getBookmarksWithMedia(args.accountId, maxResults);
      } else {
        result = await twitterClient.getBookmarks(args.accountId, maxResults);
      }

      const tweets = (result.data || []).map(tweet => ({
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        urls: tweet.entities?.urls?.map(u => u.expanded_url) || [],
        has_urls: (tweet.entities?.urls?.length || 0) > 0
      }));

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: true, data: { tweets, count: tweets.length } }, null, 2)
        }]
      };
    }

    if (name === 'get_sync_state') {
      const state = readSyncState();
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: true, data: state }, null, 2)
        }]
      };
    }

    if (name === 'sync_x_bookmarks') {
      const maxResults = args.maxResults || 25;
      const dryRun = args.dryRun || false;

      // Get bookmarks
      const result = await twitterClient.getBookmarksWithMedia(args.accountId, maxResults);
      const tweets = result.data || [];

      // Get sync state
      const syncState = readSyncState();
      const lastSyncId = syncState.lastSyncTweetId;

      // Filter to new tweets (before last sync)
      let newTweets = tweets;
      if (lastSyncId) {
        const lastSyncIndex = tweets.findIndex(t => t.id === lastSyncId);
        if (lastSyncIndex > 0) {
          newTweets = tweets.slice(0, lastSyncIndex);
        } else if (lastSyncIndex === -1) {
          // Tweet not found - could be older than what we're fetching
          newTweets = tweets;
        } else {
          newTweets = [];
        }
      }

      // Extract URLs from new tweets
      const bookmarksToAdd = [];
      for (const tweet of newTweets) {
        const urls = tweet.entities?.urls?.map(u => u.expanded_url) || [];
        if (urls.length > 0) {
          for (const url of urls) {
            const tags = autoTagTweet(tweet.text);
            const notes = tweet.text.slice(0, 200) + (tweet.text.length > 200 ? '...' : '');

            bookmarksToAdd.push({
              url,
              notes: `${notes} | Source: X bookmark`,
              tags
            });
          }
        }
      }

      if (dryRun) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              data: {
                dryRun: true,
                fetched: tweets.length,
                newSinceLastSync: newTweets.length,
                wouldAdd: bookmarksToAdd.length,
                bookmarks: bookmarksToAdd
              }
            }, null, 2)
          }]
        };
      }

      // Actually add bookmarks to the store
      const added = [];
      const skipped = [];
      for (const bm of bookmarksToAdd) {
        const result = addBookmark(bm.url, bm.notes, bm.tags);
        if (result.success) {
          added.push({ url: bm.url, id: result.id });
        } else if (result.duplicate) {
          skipped.push(bm.url);
        }
      }

      // Update sync state
      if (tweets.length > 0) {
        writeSyncState({
          lastSyncTweetId: tweets[0].id,
          lastSyncTime: new Date().toISOString()
        });
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            data: {
              added: added.length,
              skipped: skipped.length,
              newSinceLastSync: newTweets.length,
              lastSyncTweetId: tweets[0]?.id || null,
              addedBookmarks: added,
              skippedUrls: skipped
            }
          }, null, 2)
        }]
      };
    }

    if (name === 'get_account_info') {
      const accounts = twitterClient.getActiveAccounts();

      const accountDetails = await Promise.all(
        accounts.map(async (id) => {
          try {
            const profile = await twitterClient.getProfile(id);
            return {
              index: id,
              username: profile.data.username,
              name: profile.data.name,
              followers: profile.data.public_metrics?.followers_count || 0
            };
          } catch {
            return { index: id, username: 'unknown', error: 'Failed to fetch' };
          }
        })
      );

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: true, data: { accounts: accountDetails } }, null, 2)
        }]
      };
    }

    if (name === 'search_tweets') {
      const result = await twitterClient.searchTweets(args.query, args.maxResults || 10);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            data: { tweets: result.data || [], count: result.meta?.result_count || 0 }
          }, null, 2)
        }]
      };
    }

    if (name === 'x_signal_search') {
      const maxResults = args.maxResults || 25;
      const autoAdd = args.autoAdd !== false;
      const minEngagement = args.minEngagement || 0;

      // Search for tweets
      const result = await twitterClient.searchTweets(args.query, maxResults);
      const tweets = result.data || [];

      // Filter by engagement
      const filteredTweets = tweets.filter(t => {
        const engagement = (t.public_metrics?.like_count || 0) + (t.public_metrics?.retweet_count || 0);
        return engagement >= minEngagement;
      });

      // Extract URLs and prepare bookmarks
      const signals = [];
      for (const tweet of filteredTweets) {
        const urls = tweet.entities?.urls?.map(u => u.expanded_url) || [];
        if (urls.length > 0) {
          const tags = autoTagTweet(tweet.text);
          tags.push('x-signal', 'x-search');
          const notes = tweet.text.slice(0, 200) + (tweet.text.length > 200 ? '...' : '');

          signals.push({
            tweet_id: tweet.id,
            text: tweet.text,
            engagement: (t.public_metrics?.like_count || 0) + (t.public_metrics?.retweet_count || 0),
            urls: urls.map(url => ({ url, tags, notes: `${notes} | Signal: ${args.query}` }))
          });
        }
      }

      // Auto-add to bookmarks if enabled
      const added = [];
      const skipped = [];
      if (autoAdd) {
        for (const signal of signals) {
          for (const bm of signal.urls) {
            const result = addBookmark(bm.url, bm.notes, bm.tags);
            if (result.success) {
              added.push({ url: bm.url, id: result.id, signal: signal.tweet_id });
            } else if (result.duplicate) {
              skipped.push(bm.url);
            }
          }
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            data: {
              query: args.query,
              found: tweets.length,
              withUrls: signals.length,
              added: added.length,
              skipped: skipped.length,
              signals: autoAdd ? undefined : signals.slice(0, 10),
              addedBookmarks: added,
              skippedUrls: skipped
            }
          }, null, 2)
        }]
      };
    }

    if (name === 'x_idea_hunt') {
      const topics = args.topics || [];
      const autoAdd = args.autoAdd !== false;

      // Pre-configured signal queries
      const signalQueries = [
        'I would pay for a tool that',
        'wish existed',
        'frustrated with',
        'just launched',
        'hit $',
        'no good option for',
        'looking for a tool',
        'built this because nothing existed',
        'need a way to',
        'AI workflow automation'
      ];

      const allResults = [];
      let totalAdded = 0;
      let totalSkipped = 0;

      for (const topic of topics) {
        for (const query of signalQueries) {
          const searchQuery = `${topic} ${query}`;

          try {
            const result = await twitterClient.searchTweets(searchQuery, 10);
            const tweets = result.data || [];

            for (const tweet of tweets) {
              const urls = tweet.entities?.urls?.map(u => u.expanded_url) || [];
              if (urls.length > 0) {
                const tags = autoTagTweet(tweet.text);
                tags.push('x-idea-hunt', 'x-signal');
                const notes = tweet.text.slice(0, 200) + (tweet.text.length > 200 ? '...' : '');

                for (const url of urls) {
                  if (autoAdd) {
                    const bmResult = addBookmark(url, `${notes} | Hunt: ${topic} ${query}`, tags);
                    if (bmResult.success) {
                      totalAdded++;
                      allResults.push({ topic, query, url, added: true });
                    } else if (bmResult.duplicate) {
                      totalSkipped++;
                    }
                  } else {
                    allResults.push({ topic, query, url, added: false });
                  }
                }
              }
            }
          } catch (e) {
            // Continue on search errors
          }
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            data: {
              topics: topics,
              queriesRun: topics.length * signalQueries.length,
              totalFound: allResults.length,
              added: totalAdded,
              skipped: totalSkipped,
              results: autoAdd ? undefined : allResults.slice(0, 20)
            }
          }, null, 2)
        }]
      };
    }

    throw new Error(`Unknown tool: ${name}`);

  } catch (error) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ success: false, error: error.message }) }],
      isError: true
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('X MCP Server running...');
}

main().catch(console.error);