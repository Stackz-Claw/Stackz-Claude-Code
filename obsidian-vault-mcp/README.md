# OBSIDIAN VAULT MCP SERVER
*Obsidian-compatible vault for Stackz Agent Swarm*

---

## OVERVIEW

This MCP Server provides direct Obsidian vault read/write capabilities to the Stackz Agent Swarm. Notes are stored as markdown files with YAML frontmatter, making them fully compatible with Obsidian.

---

## QUICK START

### 1. Install Dependencies

```bash
cd obsidian-vault-mcp
npm install
npm run build
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your vault path
```

### 3. Run the Server

```bash
# Development
npm run dev

# Production
npm start
```

### 4. Connect to Claude Code

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "obsidian-vault": {
      "command": "node",
      "args": ["/path/to/obsidian-vault-mcp/dist/server.js"],
      "env": {
        "VAULT_PATH": "~/.stackz/vault/"
      }
    }
  }
}
```

---

## MCP TOOLS

### Note Management

| Tool | Description |
|------|-------------|
| `vault_create_note` | Create a new note |
| `vault_get_note` | Retrieve a note by ID |
| `vault_update_note` | Update an existing note |
| `vault_delete_note` | Delete a note |
| `vault_search_notes` | Search notes by query |
| `vault_list_notes` | List all notes with filtering |

### Graph & Relationships

| Tool | Description |
|------|-------------|
| `vault_get_graph` | Get node/link graph |
| `vault_create_link` | Create link between notes |
| `vault_find_path` | Find shortest path between notes |

### Vault Management

| Tool | Description |
|------|-------------|
| `vault_get_health` | Get vault health metrics |
| `vault_export_backup` | Create vault backup |
| `vault_import_notes` | Import notes from external sources |

---

## NOTE DATA MODEL

```typescript
interface Note {
  id: string;           // Zettelkasten format: YYYYMMDDHHMMSS
  title: string;
  type: NoteType;        // concept | agent | project | decision | insight | resource | person | tool
  content: string;
  tags: string[];
  links: string[];      // Note IDs this note links to
  backlinks: string[];   // Notes that link to this note
  author: string;        // Agent name
  created: string;       // ISO timestamp
  modified: string;      // ISO timestamp
  confidence: number;    // 0-100
  status: NoteStatus;   // evergreen | budding | seedling | archived
}
```

---

## OBSIDIAN FILE FORMAT

Notes are stored as markdown with YAML frontmatter:

```markdown
---
id: "20260306143022"
title: "Radar Pipeline"
type: "concept"
tags:
  - radar
  - business-strategy
links:
  - "20260201120000"
author: "radar"
created: "2026-03-06T14:30:22Z"
modified: "2026-03-06T14:30:22Z"
confidence: 87
status: "evergreen"
---

## Scoring Model

The Radar pipeline follows a structured approach...

[[Related Concept]]
```

---

## AGENT PERMISSIONS

| Agent | Permissions |
|-------|-------------|
| warden | Full access |
| radar | create, get, search, graph |
| forge | create, get, update |
| megaphone | create, get |
| ghost | create, get |
| scout | search, create |
| canvas | create, get |
| cashflow | create, get |
| ledger | create |

---

## FILE STRUCTURE

```
obsidian-vault-mcp/
├── src/
│   ├── server.ts           # MCP server implementation
│   ├── vault-engine.ts    # Core vault operations
│   ├── note-parser.ts    # Markdown/YAML parsing
│   ├── types.ts          # Type definitions
│   └── logger.ts         # Winston logging
├── package.json
├── tsconfig.json
└── .env.example
```

---

## CONFIGURATION

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VAULT_PATH` | `~/.stackz/vault/` | Vault directory |
| `BACKUP_ENABLED` | `true` | Enable auto-backups |
| `BACKUP_INTERVAL` | `3600000` | Backup interval (ms) |
| `CACHE_TTL` | `30000` | Cache TTL (ms) |
| `MAX_FILE_SIZE` | `10485760` | Max note size (bytes) |
| `LOG_LEVEL` | `info` | Log level |

---

## INTEGRATION WITH STACKZ

### Lane Queue

Agents request vault access through the Stackz lane queue:

```typescript
const vaultRequest = {
  lane_id: "lane_001",
  from_team: "business",
  from_agent: "radar",
  to_agent: "obsidian_vault",
  type: "tool_request",
  tool: "vault_create_note",
  payload: { /* note data */ }
};
```

---

## ERROR HANDLING

All tools return:

```json
{
  "success": true,
  "data": { /* result */ }
}

// Or on error:
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

---

## TESTING

```bash
# Run tests
npm test

# Run in development
npm run dev

# Build for production
npm run build
```

---

## BACKUP & RECOVERY

### Manual Backup

```bash
node dist/server.js
# Tool: vault_export_backup
```

### Restore from Backup

```bash
# Copy backup files to vault directory
cp -r ~/.stackz/vault-backups/YYYYMMDDHHMMSS/* ~/.stackz/vault/
```

---

## TROUBLESHOOTING

### Vault not found

```bash
# Create vault directory
mkdir -p ~/.stackz/vault/
```

### Permission denied

```bash
# Fix permissions
chmod -R 755 ~/.stackz/vault/
```

### Cache issues

The server caches notes in memory. If you modify files directly in Obsidian, restart the server to refresh the cache.

---

## ROADMAP

- [x] Core CRUD operations
- [x] Search functionality
- [x] Graph visualization
- [ ] Bidirectional sync with Obsidian
- [ ] Real-time SSE events
- [ ] Conflict detection
- [ ] Backup automation
