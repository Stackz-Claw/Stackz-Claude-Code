/**
 * Note Parser - Markdown/YAML frontmatter parsing
 */

import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { Note, NoteFrontmatter, NoteType, NoteStatus } from './types.js';
import { logger } from './logger.js';

export class NoteParser {
  /**
   * Parse a markdown file with YAML frontmatter into a Note object
   */
  parseNote(filePath: string, content: string): Note | null {
    try {
      const { data, content: markdown } = matter(content);

      // Extract frontmatter
      const frontmatter: NoteFrontmatter = {
        id: data.id || this.extractIdFromFilename(filePath),
        title: data.title || this.extractTitleFromFilename(filePath),
        type: this.validateNoteType(data.type),
        tags: data.tags || [],
        links: data.links || [],
        author: data.author || 'unknown',
        created: data.created || new Date().toISOString(),
        modified: data.modified || new Date().toISOString(),
        confidence: data.confidence || 50,
        status: this.validateNoteStatus(data.status)
      };

      // Extract wikilinks from content
      const extractedLinks = this.extractWikilinks(markdown);

      // Merge frontmatter links with extracted links
      const allLinks = [...new Set([...frontmatter.links, ...extractedLinks])];

      return {
        ...frontmatter,
        content: markdown,
        links: allLinks,
        backlinks: [] // Will be populated by graph builder
      };
    } catch (error) {
      logger.error(`Failed to parse note from ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Serialize a Note object to markdown with YAML frontmatter
   */
  serializeNote(note: Note): string {
    const frontmatter: NoteFrontmatter = {
      id: note.id,
      title: note.title,
      type: note.type,
      tags: note.tags,
      links: note.links,
      author: note.author,
      created: note.created,
      modified: note.modified,
      confidence: note.confidence,
      status: note.status
    };

    // Build YAML frontmatter
    const yaml = this.buildFrontmatter(frontmatter);

    return `---\n${yaml}---\n\n${note.content}`;
  }

  /**
   * Build YAML frontmatter from note metadata
   */
  private buildFrontmatter(frontmatter: NoteFrontmatter): string {
    const lines: string[] = [];

    lines.push(`id: "${frontmatter.id}"`);
    lines.push(`title: "${this.escapeYamlString(frontmatter.title)}"`);
    lines.push(`type: "${frontmatter.type}"`);

    if (frontmatter.tags.length > 0) {
      lines.push(`tags:`);
      frontmatter.tags.forEach(tag => lines.push(`  - "${tag}"`));
    }

    if (frontmatter.links.length > 0) {
      lines.push(`links:`);
      frontmatter.links.forEach(link => lines.push(`  - "${link}"`));
    }

    lines.push(`author: "${frontmatter.author}"`);
    lines.push(`created: "${frontmatter.created}"`);
    lines.push(`modified: "${frontmatter.modified}"`);
    lines.push(`confidence: ${frontmatter.confidence}`);
    lines.push(`status: "${frontmatter.status}"`);

    return lines.join('\n');
  }

  /**
   * Extract wikilinks from markdown content
   * Matches [[note title]] or [[note-id]]
   */
  extractWikilinks(content: string): string[] {
    const regex = /\[\[([^\]]+)\]\]/g;
    const links: string[] = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      links.push(match[1]);
    }

    return links;
  }

  /**
   * Extract ID from filename (e.g., "20260306143022.md" -> "20260306143022")
   */
  private extractIdFromFilename(filePath: string): string {
    const basename = path.basename(filePath, '.md');
    return basename;
  }

  /**
   * Extract title from filename (e.g., "My Note.md" -> "My Note")
   */
  private extractTitleFromFilename(filePath: string): string {
    const basename = path.basename(filePath, '.md');
    return basename;
  }

  /**
   * Validate note type
   */
  private validateNoteType(type: string): NoteType {
    const validTypes: NoteType[] = [
      'concept', 'agent', 'project', 'decision',
      'insight', 'resource', 'person', 'tool'
    ];

    if (validTypes.includes(type as NoteType)) {
      return type as NoteType;
    }

    return 'concept'; // Default
  }

  /**
   * Validate note status
   */
  private validateNoteStatus(status: string): NoteStatus {
    const validStatuses: NoteStatus[] = [
      'evergreen', 'budding', 'seedling', 'archived'
    ];

    if (validStatuses.includes(status as NoteStatus)) {
      return status as NoteStatus;
    }

    return 'seedling'; // Default
  }

  /**
   * Escape special characters for YAML string
   */
  private escapeYamlString(str: string): string {
    return str
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n');
  }

  /**
   * Generate a new note ID in Zettelkasten format
   */
  static generateNoteId(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
}

export default NoteParser;
