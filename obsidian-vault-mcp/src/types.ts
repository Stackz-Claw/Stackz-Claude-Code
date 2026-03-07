/**
 * Type definitions for Obsidian Vault MCP Server
 */

// Note types matching Smart Notes configuration
export type NoteType =
  | 'concept'
  | 'agent'
  | 'project'
  | 'decision'
  | 'insight'
  | 'resource'
  | 'person'
  | 'tool';

// Note status
export type NoteStatus = 'evergreen' | 'budding' | 'seedling' | 'archived';

// Note interface
export interface Note {
  id: string;           // Zettelkasten timestamp: YYYYMMDDHHMMSS
  title: string;
  type: NoteType;
  content: string;
  tags: string[];
  links: string[];      // Note IDs this note links to
  backlinks: string[];    // Note IDs that link to this note
  author: string;         // Agent name
  created: string;       // ISO timestamp
  modified: string;       // ISO timestamp
  confidence: number;      // 0-100
  status: NoteStatus;
}

// Note frontmatter (YAML)
export interface NoteFrontmatter {
  id: string;
  title: string;
  type: NoteType;
  tags: string[];
  links: string[];
  author: string;
  created: string;
  modified: string;
  confidence: number;
  status: NoteStatus;
}

// Vault health metrics
export interface VaultHealth {
  totalNotes: number;
  totalLinks: number;
  orphanNotes: number;    // Notes with no links
  healthScore: number;      // 0-100
  recentActivity: ActivityStats;
  storageSize: number;      // bytes
  conflicts: string[];       // Notes with conflicting content
}

// Activity statistics
export interface ActivityStats {
  notesCreatedToday: number;
  notesModifiedToday: number;
  linksCreatedToday: number;
}

// Graph data for visualization
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface GraphNode {
  id: string;
  title: string;
  type: NoteType;
  status: NoteStatus;
  author: string;
  backlinks: number;
  links: number;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  relationshipType?: string;
}

// Search result
export interface SearchResult {
  note: Note;
  score: number;
  matchedOn: string[]; // Which fields matched
}

// Batch operation result
export interface BatchResult {
  success: boolean;
  id?: string;
  error?: string;
}

// Agent permissions
export interface AgentPermissions {
  agent: string;
  permissions: string[];
}

// Configuration
export interface VaultConfig {
  vaultPath: string;
  backupEnabled: boolean;
  backupInterval: number;
  cacheTTL: number;
  maxFileSize: number;
  logLevel: string;
}

// Event types for SSE
export type VaultEventType =
  | 'note_created'
  | 'note_updated'
  | 'note_deleted'
  | 'link_created'
  | 'file_sync';

export interface VaultEvent {
  type: VaultEventType;
  note?: Note;
  timestamp: string;
  data?: any;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Environment config
export interface EnvConfig {
  VAULT_PATH: string;
  BACKUP_ENABLED: boolean;
  BACKUP_INTERVAL: number;
  CACHE_TTL: number;
  MAX_FILE_SIZE: number;
  LOG_LEVEL: string;
}
