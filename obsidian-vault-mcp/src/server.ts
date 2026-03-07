/**
 * Obsidian Vault MCP Server
 * Provides vault read/write capabilities to Stackz Agent Swarm
 */

import { McpServer, Tool } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/transport/stdio.js';
import { VaultEngine } from './vault-engine.js';
import { Note, NoteType, NoteStatus, GraphData, VaultHealth, SearchResult } from './types.js';
import { logger } from './logger.js';
import * as path from 'path';
import * as fs from 'fs';

// Get vault path from environment
const VAULT_PATH = process.env.VAULT_PATH || path.join(process.env.HOME || '/Users/jaleeljenkins', '.stackz/vault');

// Initialize vault engine
const vault = new VaultEngine(VAULT_PATH);

// Create MCP Server
const mcpServer = new McpServer('obsidian-vault', {
  version: '1.0.0',
  capabilities: {
    tools: {}
  }
});

logger.info(`Obsidian Vault MCP Server starting with vault: ${VAULT_PATH}`);

// ============== NOTE MANAGEMENT TOOLS ==============

/**
 * vault_create_note - Create a new note in the Obsidian vault
 */
mcpServer.tool('vault_create_note', async (args: {
  title: string;
  content: string;
  type?: NoteType;
  tags?: string[];
  links?: string[];
  author?: string;
  confidence?: number;
  status?: NoteStatus;
}) => {
  try {
    const note = await vault.createNote({
      title: args.title,
      content: args.content,
      type: args.type || 'concept',
      tags: args.tags || [],
      links: args.links || [],
      author: args.author || 'unknown',
      confidence: args.confidence || 50,
      status: args.status || 'seedling'
    });

    return {
      success: true,
      data: note
    };
  } catch (error: any) {
    logger.error('vault_create_note error:', error);
    return {
      success: false,
      error: {
        code: 'CREATE_FAILED',
        message: error.message
      }
    };
  }
});

/**
 * vault_get_note - Retrieve a note by ID with full content and backlinks
 */
mcpServer.tool('vault_get_note', async (args: { id: string }) => {
  try {
    const note = await vault.getNote(args.id);

    if (!note) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Note not found: ${args.id}`
        }
      };
    }

    return {
      success: true,
      data: note
    };
  } catch (error: any) {
    logger.error('vault_get_note error:', error);
    return {
      success: false,
      error: {
        code: 'GET_FAILED',
        message: error.message
      }
    };
  }
});

/**
 * vault_update_note - Update an existing note
 */
mcpServer.tool('vault_update_note', async (args: {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
  links?: string[];
  confidence?: number;
  status?: NoteStatus;
}) => {
  try {
    const note = await vault.updateNote(args.id, args);

    if (!note) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Note not found: ${args.id}`
        }
      };
    }

    return {
      success: true,
      data: note
    };
  } catch (error: any) {
    logger.error('vault_update_note error:', error);
    return {
      success: false,
      error: {
        code: 'UPDATE_FAILED',
        message: error.message
      }
    };
  }
});

/**
 * vault_search_notes - Search notes by query with semantic matching
 */
mcpServer.tool('vault_search_notes', async (args: {
  query: string;
  type_filter?: NoteType;
  tag_filter?: string;
  limit?: number;
}) => {
  try {
    const results = await vault.searchNotes(args.query, {
      typeFilter: args.type_filter as NoteType,
      tagFilter: args.tag_filter,
      limit: args.limit || 20
    });

    return {
      success: true,
      data: {
        results,
        total: results.length
      }
    };
  } catch (error: any) {
    logger.error('vault_search_notes error:', error);
    return {
      success: false,
      error: {
        code: 'SEARCH_FAILED',
        message: error.message
      }
    };
  }
});

/**
 * vault_delete_note - Delete a note
 */
mcpServer.tool('vault_delete_note', async (args: { id: string }) => {
  try {
    const deleted = await vault.deleteNote(args.id);

    return {
      success: deleted,
      ...(deleted ? {} : { error: { code: 'NOT_FOUND', message: `Note not found: ${args.id}` } })
    };
  } catch (error: any) {
    logger.error('vault_delete_note error:', error);
    return {
      success: false,
      error: { code: 'DELETE_FAILED', message: error.message }
    };
  }
});

// ============== GRAPH & RELATIONSHIP TOOLS ==============

/**
 * vault_get_graph - Get the full node/link graph for visualization
 */
mcpServer.tool('vault_get_graph', async (args: {
  center_note_id?: string;
  depth?: number;
}) => {
  try {
    const graph = await vault.getGraphData({
      centerNoteId: args.center_note_id,
      depth: args.depth || 3
    });

    return {
      success: true,
      data: graph
    };
  } catch (error: any) {
    logger.error('vault_get_graph error:', error);
    return {
      success: false,
      error: { code: 'GRAPH_FAILED', message: error.message }
    };
  }
});

/**
 * vault_create_link - Create a bidirectional link between two notes
 */
mcpServer.tool('vault_create_link', async (args: {
  source_note_id: string;
  target_note_id: string;
  relationship_type?: string;
}) => {
  try {
    // Get source note
    const sourceNote = await vault.getNote(args.source_note_id);
    if (!sourceNote) {
      return {
        success: false,
        error: { code: 'NOT_FOUND', message: `Source note not found: ${args.source_note_id}` }
      };
    }

    // Add link if not already present
    const links = [...(sourceNote.links || [])];
    if (!links.includes(args.target_note_id)) {
      links.push(args.target_note_id);
    }

    // Update source note
    await vault.updateNote(args.source_note_id, { links });

    return {
      success: true,
      data: {
        source: args.source_note_id,
        target: args.target_note_id,
        relationship: args.relationship_type
      }
    };
  } catch (error: any) {
    logger.error('vault_create_link error:', error);
    return {
      success: false,
      error: { code: 'LINK_FAILED', message: error.message }
    };
  }
});

/**
 * vault_find_path - Find the shortest path between two notes
 */
mcpServer.tool('vault_find_path', async (args: {
  start_note_id: string;
  end_note_id: string;
}) => {
  try {
    const path = await vault.findPath(args.start_note_id, args.end_note_id);

    return {
      success: true,
      data: {
        path,
        found: path !== null
      }
    };
  } catch (error: any) {
    logger.error('vault_find_path error:', error);
    return {
      success: false,
      error: { code: 'PATH_FAILED', message: error.message }
    };
  }
});

// ============== VAULT MANAGEMENT TOOLS ==============

/**
 * vault_get_health - Get vault health metrics and statistics
 */
mcpServer.tool('vault_get_health', async () => {
  try {
    const health = await vault.getVaultHealth();

    return {
      success: true,
      data: health
    };
  } catch (error: any) {
    logger.error('vault_get_health error:', error);
    return {
      success: false,
      error: { code: 'HEALTH_FAILED', message: error.message }
    };
  }
});

/**
 * vault_export_backup - Create a backup of the entire vault
 */
mcpServer.tool('vault_export_backup', async (args: {
  backup_path?: string;
}) => {
  try {
    const backupDir = args.backup_path ||
      path.join(process.env.HOME || '/Users/jaleeljenkins', '.stackz/vault-backups', Date.now().toString());

    // Create backup directory
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Copy vault files
    const vaultFiles = fs.readdirSync(VAULT_PATH).filter(f => f.endsWith('.md'));
    for (const file of vaultFiles) {
      const src = path.join(VAULT_PATH, file);
      const dest = path.join(backupDir, file);
      fs.copyFileSync(src, dest);
    }

    return {
      success: true,
      data: {
        backup_path: backupDir,
        notes_backed_up: vaultFiles.length
      }
    };
  } catch (error: any) {
    logger.error('vault_export_backup error:', error);
    return {
      success: false,
      error: { code: 'BACKUP_FAILED', message: error.message }
    };
  }
});

/**
 * vault_import_notes - Import notes from external sources
 */
mcpServer.tool('vault_import_notes', async (args: {
  source_path: string;
  format?: 'markdown' | 'json' | 'obsidian';
}) => {
  try {
    const format = args.format || 'markdown';
    let notesImported = 0;

    if (format === 'markdown') {
      // Import markdown files
      const files = fs.readdirSync(args.source_path).filter(f => f.endsWith('.md'));

      for (const file of files) {
        const filePath = path.join(args.source_path, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Extract title from filename
        const title = path.basename(file, '.md');

        // Create note
        await vault.createNote({
          title,
          content,
          type: 'resource',
          author: 'import'
        });

        notesImported++;
      }
    } else if (format === 'json') {
      // Import JSON format
      const data = JSON.parse(fs.readFileSync(args.source_path, 'utf-8'));
      const notes = Array.isArray(data) ? data : data.notes || [];

      for (const note of notes) {
        await vault.createNote(note);
        notesImported++;
      }
    }

    return {
      success: true,
      data: {
        notes_imported: notesImported
      }
    };
  } catch (error: any) {
    logger.error('vault_import_notes error:', error);
    return {
      success: false,
      error: { code: 'IMPORT_FAILED', message: error.message }
    };
  }
});

/**
 * vault_list_notes - List all notes with optional filtering
 */
mcpServer.tool('vault_list_notes', async (args: {
  type?: NoteType;
  author?: string;
  status?: NoteStatus;
  limit?: number;
}) => {
  try {
    let notes = await vault.getAllNotes();

    // Apply filters
    if (args.type) {
      notes = notes.filter(n => n.type === args.type);
    }
    if (args.author) {
      notes = notes.filter(n => n.author === args.author);
    }
    if (args.status) {
      notes = notes.filter(n => n.status === args.status);
    }

    // Apply limit
    if (args.limit) {
      notes = notes.slice(0, args.limit);
    }

    return {
      success: true,
      data: {
        notes,
        total: notes.length
      }
    };
  } catch (error: any) {
    logger.error('vault_list_notes error:', error);
    return {
      success: false,
      error: { code: 'LIST_FAILED', message: error.message }
    };
  }
});

// ============== SERVER STARTUP ==============

async function main() {
  logger.info('Starting Obsidian Vault MCP Server...');

  // Create stdio transport
  const transport = new StdioServerTransport();

  // Connect to transport
  try {
    await mcpServer.connect(transport);
    logger.info('Obsidian Vault MCP Server connected to stdio transport');

    // Send ready message
    process.send?.({ type: 'ready' });
  } catch (error) {
    logger.error('Failed to connect MCP server:', error);
    process.exit(1);
  }

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    logger.info('Shutting down Obsidian Vault MCP Server...');
    await mcpServer.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.info('Shutting down Obsidian Vault MCP Server...');
    await mcpServer.close();
    process.exit(0);
  });
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
});

main().catch((error) => {
  logger.error('Fatal error:', error);
  process.exit(1);
});
