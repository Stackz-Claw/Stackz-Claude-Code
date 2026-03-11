/**
 * Bookmarks MCP Server
 *
 * Provides tools to manage bookmarks for the Stackz idea-brainstorm workflow.
 *
 * Storage: ~/.stackz/bookmarks/bookmarks.json
 *
 * Tools:
 * - bookmark_list: List all bookmarks
 * - bookmark_add: Add a new bookmark
 * - bookmark_mark_used: Mark bookmarks as used in a session
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

const BOOKMARKS_FILE = path.join(os.homedir(), '.stackz', 'bookmarks', 'bookmarks.json');

// Ensure file exists
function ensureBookmarksFile() {
  const dir = path.dirname(BOOKMARKS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(BOOKMARKS_FILE)) {
    fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify({ bookmarks: [], lastUpdated: new Date().toISOString() }, null, 2));
  }
}

// Read bookmarks
function readBookmarks() {
  ensureBookmarksFile();
  const data = fs.readFileSync(BOOKMARKS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write bookmarks
function writeBookmarks(data) {
  fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify(data, null, 2));
}

// Create MCP server
const server = new Server(
  { name: 'bookmarks', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'bookmark_list',
        description: 'List all bookmarks. Use unread:true to get only unused bookmarks.',
        inputSchema: {
          type: 'object',
          properties: {
            unread: { type: 'boolean', description: 'Only return unread bookmarks' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Filter by tags' }
          }
        }
      },
      {
        name: 'bookmark_add',
        description: 'Add a new bookmark with URL, notes, and tags',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', description: 'The URL to bookmark' },
            notes: { type: 'string', description: 'Why this is relevant' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Tags for categorization' }
          },
          required: ['url']
        }
      },
      {
        name: 'bookmark_mark_used',
        description: 'Mark bookmarks as used in a session',
        inputSchema: {
          type: 'object',
          properties: {
            ids: { type: 'array', items: { type: 'string' }, description: 'Bookmark IDs to mark as used' },
            session_id: { type: 'string', description: 'Session ID that used these bookmarks' }
          },
          required: ['ids']
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'bookmark_list') {
      const data = readBookmarks();
      let bookmarks = data.bookmarks || [];

      // Filter by unread
      if (args.unread) {
        bookmarks = bookmarks.filter(b => !b.used);
      }

      // Filter by tags
      if (args.tags && args.tags.length > 0) {
        bookmarks = bookmarks.filter(b =>
          args.tags.some(tag => b.tags?.includes(tag))
        );
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(bookmarks, null, 2)
        }]
      };
    }

    if (name === 'bookmark_add') {
      const data = readBookmarks();
      const bookmark = {
        id: `bm_${Date.now()}`,
        url: args.url,
        notes: args.notes || '',
        tags: args.tags || [],
        added: new Date().toISOString(),
        used: false
      };

      data.bookmarks = data.bookmarks || [];
      data.bookmarks.push(bookmark);
      data.lastUpdated = new Date().toISOString();
      writeBookmarks(data);

      return {
        content: [{
          type: 'text',
          text: `Added bookmark: ${bookmark.id}\nURL: ${bookmark.url}`
        }]
      };
    }

    if (name === 'bookmark_mark_used') {
      const data = readBookmarks();
      const ids = new Set(args.ids);

      data.bookmarks = data.bookmarks.map(b => {
        if (ids.has(b.id)) {
          return { ...b, used: true, usedInSession: args.session_id };
        }
        return b;
      });
      data.lastUpdated = new Date().toISOString();
      writeBookmarks(data);

      return {
        content: [{
          type: 'text',
          text: `Marked ${args.ids.length} bookmarks as used`
        }]
      };
    }

    throw new Error(`Unknown tool: ${name}`);

  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);