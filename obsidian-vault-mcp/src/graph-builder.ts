/**
 * Graph Builder - Graph relationship analysis and path finding
 */

import { Note, GraphData, GraphNode, GraphLink } from './types.js';
import { logger } from './logger.js';

export class GraphBuilder {
  private notes: Map<string, Note> = new Map();

  /**
   * Load all notes into the graph builder
   */
  loadNotes(notes: Note[]): void {
    this.notes.clear();
    notes.forEach(note => {
      this.notes.set(note.id, note);
    });

    // Build backlinks
    this.buildBacklinks();
  }

  /**
   * Build bidirectional backlinks from links
   */
  private buildBacklinks(): void {
    // Reset all backlinks
    this.notes.forEach(note => {
      note.backlinks = [];
    });

    // Build backlinks
    this.notes.forEach(note => {
      note.links.forEach(linkId => {
        // Try to find the linked note
        const linkedNote = this.findNoteByIdOrTitle(linkId);
        if (linkedNote && !linkedNote.backlinks.includes(note.id)) {
          linkedNote.backlinks.push(note.id);
        }
      });
    });
  }

  /**
   * Find a note by ID or title
   */
  private findNoteByIdOrTitle(query: string): Note | undefined {
    // First try exact ID match
    if (this.notes.has(query)) {
      return this.notes.get(query);
    }

    // Then try title match (case insensitive)
    const lowerQuery = query.toLowerCase();
    for (const note of this.notes.values()) {
      if (note.title.toLowerCase().includes(lowerQuery)) {
        return note;
      }
    }

    return undefined;
  }

  /**
   * Get full graph data for visualization
   */
  getGraph(depth: number = 3): GraphData {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const addedNodes = new Set<string>();

    // Add all notes as nodes
    this.notes.forEach(note => {
      nodes.push({
        id: note.id,
        title: note.title,
        type: note.type,
        status: note.status,
        author: note.author,
        backlinks: note.backlinks.length,
        links: note.links.length
      });
      addedNodes.add(note.id);
    });

    // Add links
    this.notes.forEach(note => {
      note.links.forEach(linkId => {
        const targetNote = this.findNoteByIdOrTitle(linkId);
        if (targetNote) {
          // Avoid duplicate links
          const linkExists = links.some(l =>
            (l.source === note.id && l.target === targetNote.id) ||
            (l.source === targetNote.id && l.target === note.id)
          );

          if (!linkExists) {
            links.push({
              source: note.id,
              target: targetNote.id
            });
          }
        }
      });
    });

    return { nodes, links };
  }

  /**
   * Get graph centered on a specific note
   */
  getGraphAroundNote(centerNoteId: string, depth: number = 1): GraphData {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const centerNote = this.notes.get(centerNoteId);

    if (!centerNote) {
      return { nodes, links };
    }

    const visited = new Set<string>();
    const toVisit = [centerNoteId];
    const depthMap = new Map<string, number>();
    depthMap.set(centerNoteId, 0);

    // BFS to get notes within depth
    while (toVisit.length > 0) {
      const currentId = toVisit.shift()!;
      const currentDepth = depthMap.get(currentId)!;

      if (visited.has(currentId) || currentDepth > depth) continue;
      visited.add(currentId);

      const currentNote = this.notes.get(currentId);
      if (!currentNote) continue;

      // Add current note as node
      if (!nodes.find(n => n.id === currentId)) {
        nodes.push({
          id: currentNote.id,
          title: currentNote.title,
          type: currentNote.type,
          status: currentNote.status,
          author: currentNote.author,
          backlinks: currentNote.backlinks.length,
          links: currentNote.links.length
        });
      }

      // Add links to neighbors
      if (currentDepth < depth) {
        [...currentNote.links, ...currentNote.backlinks].forEach(linkId => {
          const linkedNote = this.findNoteByIdOrTitle(linkId);
          if (linkedNote && !visited.has(linkedNote.id)) {
            // Add link
            const linkExists = links.some(l =>
              (l.source === currentId && l.target === linkedNote.id) ||
              (l.source === linkedNote.id && l.target === currentId)
            );

            if (!linkExists) {
              links.push({
                source: currentId,
                target: linkedNote.id
              });
            }

            // Queue for visiting
            if (!depthMap.has(linkedNote.id)) {
              depthMap.set(linkedNote.id, currentDepth + 1);
              toVisit.push(linkedNote.id);
            }
          }
        });
      }
    }

    return { nodes, links };
  }

  /**
   * Find shortest path between two notes using BFS
   */
  findPath(startNoteId: string, endNoteId: string): string[] | null {
    const startNote = this.notes.get(startNoteId);
    const endNote = this.findNoteByIdOrTitle(endNoteId);

    if (!startNote || !endNote) {
      return null;
    }

    // BFS to find shortest path
    const queue: string[][] = [[startNoteId]];
    const visited = new Set<string>([startNoteId]);

    while (queue.length > 0) {
      const path = queue.shift()!;
      const currentId = path[path.length - 1];

      if (currentId === endNote.id) {
        return path;
      }

      const currentNote = this.notes.get(currentId);
      if (!currentNote) continue;

      // Check all neighbors (links and backlinks)
      const neighbors = [...currentNote.links, ...currentNote.backlinks];

      for (const neighborId of neighbors) {
        const neighborNote = this.findNoteByIdOrTitle(neighborId);
        if (neighborNote && !visited.has(neighborNote.id)) {
          visited.add(neighborNote.id);
          queue.push([...path, neighborNote.id]);
        }
      }
    }

    return null; // No path found
  }

  /**
   * Get orphan notes (notes with no links)
   */
  getOrphanNotes(): Note[] {
    return Array.from(this.notes.values()).filter(
      note => note.links.length === 0 && note.backlinks.length === 0
    );
  }

  /**
   * Find notes that might have conflicting content
   * (simple keyword-based detection)
   */
  findPotentialConflicts(): string[][] {
    const notes = Array.from(this.notes.values());
    const conflicts: string[][] = [];
    const processed = new Set<string>();

    // Simple conflict detection based on similar titles or overlapping tags
    for (let i = 0; i < notes.length; i++) {
      for (let j = i + 1; j < notes.length; j++) {
        const note1 = notes[i];
        const note2 = notes[j];

        if (processed.has(note1.id) || processed.has(note2.id)) continue;

        // Check for similar titles
        const titleSimilarity = this.calculateSimilarity(
          note1.title.toLowerCase(),
          note2.title.toLowerCase()
        );

        // Check for conflicting statuses (archived vs evergreen for similar notes)
        if (titleSimilarity > 0.7) {
          if (note1.status === 'archived' && note2.status === 'evergreen') {
            conflicts.push([note1.id, note2.id]);
            processed.add(note1.id);
            processed.add(note2.id);
          }
        }

        // Check for same topic with different conclusions
        const commonTags = note1.tags.filter(t => note2.tags.includes(t));
        if (commonTags.length >= 2 && titleSimilarity > 0.5) {
          // Potential conflict if content is different
          conflicts.push([note1.id, note2.id]);
        }
      }
    }

    return conflicts;
  }

  /**
   * Calculate simple string similarity (0-1)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = new Set(str1.split(/\s+/));
    const words2 = new Set(str2.split(/\s+/));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  /**
   * Get notes by type
   */
  getNotesByType(type: string): Note[] {
    return Array.from(this.notes.values()).filter(note => note.type === type);
  }

  /**
   * Get notes by author
   */
  getNotesByAuthor(author: string): Note[] {
    return Array.from(this.notes.values()).filter(note => note.author === author);
  }

  /**
   * Get notes by tag
   */
  getNotesByTag(tag: string): Note[] {
    return Array.from(this.notes.values()).filter(note =>
      note.tags.includes(tag)
    );
  }

  /**
   * Get all unique tags
   */
  getAllTags(): string[] {
    const tags = new Set<string>();
    this.notes.forEach(note => {
      note.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  /**
   * Get all unique authors
   */
  getAllAuthors(): string[] {
    const authors = new Set<string>();
    this.notes.forEach(note => authors.add(note.author));
    return Array.from(authors).sort();
  }
}

export default GraphBuilder;
