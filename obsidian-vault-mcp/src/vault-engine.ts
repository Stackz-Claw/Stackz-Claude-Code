/**
 * Vault Engine - Core Obsidian vault operations
 */

import * as fs from 'fs';
import * as path from 'path';
import { Note, NoteType, NoteStatus, VaultHealth, GraphData, GraphNode, GraphLink, SearchResult } from './types.js';
import { NoteParser } from './note-parser.js';
import { logger } from './logger.js';

export class VaultEngine {
  private vaultPath: string;
  private parser: NoteParser;
  private noteCache: Map<string, Note> = new Map();
  private graphCache: { nodes: GraphNode[]; links: GraphLink[] } | null = null;
  private lastGraphUpdate: number = 0;

  constructor(vaultPath: string) {
    this.vaultPath = vaultPath;
    this.parser = new NoteParser();
    this.ensureVaultDirectory();
  }

  /**
   * Ensure vault directory exists
   */
  private ensureVaultDirectory(): void {
    if (!fs.existsSync(this.vaultPath)) {
      fs.mkdirSync(this.vaultPath, { recursive: true });
      logger.info(`Created vault directory: ${this.vaultPath}`);
    }
  }

  /**
   * Get all notes from vault
   */
  async getAllNotes(): Promise<Note[]> {
    const notes: Note[] = [];
    const files = this.getMarkdownFiles();

    for (const file of files) {
      const note = await this.loadNoteFromFile(file);
      if (note) {
        notes.push(note);
      }
    }

    // Update backlinks
    return this.updateBacklinks(notes);
  }

  /**
   * Load a single note from file
   */
  async loadNoteFromFile(filePath: string): Promise<Note | null> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const note = this.parser.parseNote(filePath, content);

      if (note) {
        this.noteCache.set(note.id, note);
      }

      return note;
    } catch (error) {
      logger.error(`Failed to load note from ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Get a single note by ID
   */
  async getNote(id: string): Promise<Note | null> {
    // Check cache first
    if (this.noteCache.has(id)) {
      return this.noteCache.get(id)!;
    }

    // Load from file
    const filePath = this.getNoteFilePath(id);
    if (fs.existsSync(filePath)) {
      return await this.loadNoteFromFile(filePath);
    }

    return null;
  }

  /**
   * Create a new note
   */
  async createNote(noteData: Partial<Note>): Promise<Note> {
    const now = new Date().toISOString();

    const note: Note = {
      id: noteData.id || NoteParser.generateNoteId(),
      title: noteData.title || 'Untitled',
      type: noteData.type || 'concept',
      content: noteData.content || '',
      tags: noteData.tags || [],
      links: noteData.links || [],
      backlinks: [],
      author: noteData.author || 'unknown',
      created: now,
      modified: now,
      confidence: noteData.confidence || 50,
      status: noteData.status || 'seedling'
    };

    // Write to file
    const filePath = path.join(this.vaultPath, `${note.id}.md`);
    const content = this.parser.serializeNote(note);
    fs.writeFileSync(filePath, content, 'utf-8');

    // Update cache
    this.noteCache.set(note.id, note);

    // Invalidate graph cache
    this.invalidateGraphCache();

    logger.info(`Created note: ${note.id} - ${note.title}`);
    return note;
  }

  /**
   * Update an existing note
   */
  async updateNote(id: string, updates: Partial<Note>): Promise<Note | null> {
    const existing = await this.getNote(id);
    if (!existing) {
      logger.warn(`Note not found for update: ${id}`);
      return null;
    }

    const updated: Note = {
      ...existing,
      ...updates,
      id: existing.id, // Don't allow ID change
      created: existing.created, // Don't allow creation date change
      modified: new Date().toISOString()
    };

    // Write to file
    const filePath = path.join(this.vaultPath, `${id}.md`);
    const content = this.parser.serializeNote(updated);
    fs.writeFileSync(filePath, content, 'utf-8');

    // Update cache
    this.noteCache.set(id, updated);

    // Invalidate graph cache
    this.invalidateGraphCache();

    logger.info(`Updated note: ${id}`);
    return updated;
  }

  /**
   * Delete a note
   */
  async deleteNote(id: string): Promise<boolean> {
    const filePath = path.join(this.vaultPath, `${id}.md`);

    if (!fs.existsSync(filePath)) {
      logger.warn(`Note file not found: ${id}`);
      return false;
    }

    fs.unlinkSync(filePath);
    this.noteCache.delete(id);
    this.invalidateGraphCache();

    logger.info(`Deleted note: ${id}`);
    return true;
  }

  /**
   * Search notes
   */
  async searchNotes(
    query: string,
    options: {
      typeFilter?: NoteType;
      tagFilter?: string;
      limit?: number;
    } = {}
  ): Promise<SearchResult[]> {
    const allNotes = await this.getAllNotes();
    const results: SearchResult[] = [];
    const q = query.toLowerCase();

    for (const note of allNotes) {
      let score = 0;
      const matchedOn: string[] = [];

      // Title match (highest weight)
      if (note.title.toLowerCase().includes(q)) {
        score += 10;
        matchedOn.push('title');
      }

      // Content match
      if (note.content.toLowerCase().includes(q)) {
        score += 5;
        matchedOn.push('content');
      }

      // Tag match
      if (note.tags.some(t => t.toLowerCase().includes(q))) {
        score += 8;
        matchedOn.push('tags');
      }

      // Type match
      if (note.type === q) {
        score += 3;
        matchedOn.push('type');
      }

      // Apply filters
      if (options.typeFilter && note.type !== options.typeFilter) {
        continue;
      }

      if (options.tagFilter && !note.tags.includes(options.tagFilter)) {
        continue;
      }

      if (score > 0) {
        results.push({ note, score, matchedOn });
      }
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    // Apply limit
    if (options.limit) {
      return results.slice(0, options.limit);
    }

    return results;
  }

  /**
   * Get graph data for visualization
   */
  async getGraphData(options: { centerNoteId?: string; depth?: number } = {}): Promise<GraphData> {
    // Check cache
    if (this.graphCache && Date.now() - this.lastGraphUpdate < 30000) {
      return this.filterGraphByDepth(this.graphCache, options.centerNoteId, options.depth || 3);
    }

    const notes = await this.getAllNotes();

    // Build nodes
    const nodes: GraphNode[] = notes.map(note => ({
      id: note.id,
      title: note.title,
      type: note.type,
      status: note.status,
      author: note.author,
      backlinks: note.backlinks?.length || 0,
      links: note.links?.length || 0
    }));

    // Build links
    const links: GraphLink[] = [];
    const noteIdMap = new Map(notes.map(n => [n.title.toLowerCase(), n.id]));
    const noteIdMap2 = new Map(notes.map(n => [n.id, n]));

    for (const note of notes) {
      for (const link of note.links || []) {
        // Try to resolve link to note ID
        let targetId = link;

        // Check if link is a title
        const resolved = noteIdMap.get(link.toLowerCase());
        if (resolved) {
          targetId = resolved;
        }

        // Verify target exists
        if (noteIdMap2.has(targetId)) {
          links.push({
            source: note.id,
            target: targetId
          });
        }
      }
    }

    this.graphCache = { nodes, links };
    this.lastGraphUpdate = Date.now();

    return this.filterGraphByDepth(this.graphCache, options.centerNoteId, options.depth || 3);
  }

  /**
   * Filter graph by depth from center note
   */
  private filterGraphByDepth(
    graph: GraphData,
    centerId?: string,
    depth: number = 3
  ): GraphData {
    if (!centerId || depth === 0) {
      return graph;
    }

    // BFS to find all nodes within depth
    const visited = new Set<string>([centerId]);
    const queue: { id: string; currentDepth: number }[] = [{ id: centerId, currentDepth: 0 }];

    while (queue.length > 0) {
      const { id, currentDepth } = queue.shift()!;

      if (currentDepth >= depth) continue;

      // Find neighbors
      for (const link of graph.links) {
        if (link.source === id && !visited.has(link.target)) {
          visited.add(link.target);
          queue.push({ id: link.target, currentDepth: currentDepth + 1 });
        }
        if (link.target === id && !visited.has(link.source)) {
          visited.add(link.source);
          queue.push({ id: link.source, currentDepth: currentDepth + 1 });
        }
      }
    }

    // Filter nodes and links
    const filteredNodes = graph.nodes.filter(n => visited.has(n.id));
    const filteredLinks = graph.links.filter(
      l => visited.has(l.source) && visited.has(l.target)
    );

    return { nodes: filteredNodes, links: filteredLinks };
  }

  /**
   * Get vault health metrics
   */
  async getVaultHealth(): Promise<VaultHealth> {
    const notes = await this.getAllNotes();

    // Calculate health score
    const totalNotes = notes.length;
    const allLinks = notes.reduce((sum, n) => sum + (n.links?.length || 0), 0);
    const totalLinks = allLinks / 2; // Each link counted twice

    // Find orphans (no links)
    const orphans = notes.filter(
      n => !n.links?.length && !n.backlinks?.length
    ).length;

    // Calculate health score (0-100)
    let healthScore = 50; // Base

    // Connectivity bonus
    if (totalNotes > 0) {
      healthScore += Math.min(20, (totalLinks / totalNotes) * 10);
    }

    // Orphan penalty
    healthScore -= Math.min(20, orphans * 5);

    // Completeness bonus (notes with tags, confidence)
    const completeNotes = notes.filter(
      n => n.tags?.length > 0 && n.confidence > 0
    ).length;
    if (totalNotes > 0) {
      healthScore += Math.min(10, (completeNotes / totalNotes) * 10);
    }

    healthScore = Math.max(0, Math.min(100, healthScore));

    // Calculate storage size
    let storageSize = 0;
    for (const file of this.getMarkdownFiles()) {
      const stats = fs.statSync(file);
      storageSize += stats.size;
    }

    // Recent activity
    const today = new Date().toISOString().split('T')[0];
    const recentNotes = notes.filter(n => n.created.startsWith(today));
    const recentModified = notes.filter(n => n.modified.startsWith(today));

    return {
      totalNotes,
      totalLinks,
      orphanNotes: orphans,
      healthScore: Math.round(healthScore),
      recentActivity: {
        notesCreatedToday: recentNotes.length,
        notesModifiedToday: recentModified.length,
        linksCreatedToday: 0 // Would need to track this
      },
      storageSize,
      conflicts: [] // Would need content analysis
    };
  }

  /**
   * Find shortest path between two notes
   */
  async findPath(startId: string, endId: string): Promise<string[] | null> {
    const graph = await this.getGraphData();

    // BFS for shortest path
    const queue: { id: string; path: string[] }[] = [{ id: startId, path: [startId] }];
    const visited = new Set<string>([startId]);

    while (queue.length > 0) {
      const { id, path } = queue.shift()!;

      if (id === endId) {
        return path;
      }

      // Find neighbors
      for (const link of graph.links) {
        let neighbor: string | null = null;

        if (link.source === id && !visited.has(link.target)) {
          neighbor = link.target;
        } else if (link.target === id && !visited.has(link.source)) {
          neighbor = link.source;
        }

        if (neighbor) {
          visited.add(neighbor);
          queue.push({ id: neighbor, path: [...path, neighbor] });
        }
      }
    }

    return null; // No path found
  }

  /**
   * Get all markdown files in vault
   */
  private getMarkdownFiles(): string[] {
    const files = fs.readdirSync(this.vaultPath);
    return files
      .filter(f => f.endsWith('.md'))
      .map(f => path.join(this.vaultPath, f));
  }

  /**
   * Get file path for a note
   */
  private getNoteFilePath(id: string): string {
    return path.join(this.vaultPath, `${id}.md`);
  }

  /**
   * Update backlinks for all notes
   */
  private updateBacklinks(notes: Note[]): Note[] {
    const noteIdMap = new Map(notes.map(n => [n.id, n]));

    // Reset backlinks
    for (const note of notes) {
      note.backlinks = [];
    }

    // Populate backlinks
    for (const note of notes) {
      for (const link of note.links || []) {
        // Try to resolve link
        const target = noteIdMap.get(link) ||
          notes.find(n => n.title.toLowerCase() === link.toLowerCase());

        if (target) {
          if (!target.backlinks) target.backlinks = [];
          if (!target.backlinks.includes(note.id)) {
            target.backlinks.push(note.id);
          }
        }
      }
    }

    return notes;
  }

  /**
   * Invalidate graph cache
   */
  invalidateGraphCache(): void {
    this.graphCache = null;
    this.lastGraphUpdate = 0;
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.noteCache.clear();
    this.invalidateGraphCache();
  }
}

export default VaultEngine;
