/**
 * SSE Server - Real-time event streaming for vault updates
 * Provides live updates when agents create/modify notes
 */

import * as http from 'http';
import { VaultEngine } from './vault-engine.js';
import { VaultEvent } from './types.js';
import { logger } from './logger.js';

export class SSEServer {
  private server: http.Server | null = null;
  private clients: Set<http.ServerResponse> = new Set();
  private vault: VaultEngine;
  private port: number;

  constructor(vault: VaultEngine, port: number = 8766) {
    this.vault = vault;
    this.port = port;
  }

  /**
   * Start the SSE server
   */
  start(): void {
    this.server = http.createServer((req, res) => {
      // Handle CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      // SSE endpoint
      if (req.url === '/vault/stream' || req.url === '/stream') {
        // Set SSE headers
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });

        // Add to client list
        this.clients.add(res);

        // Send initial connection message
        this.sendEvent(res, {
          type: 'connected',
          timestamp: new Date().toISOString()
        });

        // Send heartbeat every 30 seconds
        const heartbeat = setInterval(() => {
          if (res.writableEnded) {
            clearInterval(heartbeat);
            return;
          }
          try {
            res.write(': heartbeat\n\n');
          } catch (e) {
            clearInterval(heartbeat);
          }
        }, 30000);

        // Remove client on disconnect
        req.on('close', () => {
          this.clients.delete(res);
          clearInterval(heartbeat);
        });

        return;
      }

      // Health check endpoint
      if (req.url === '/vault/health' || req.url === '/health') {
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          status: 'ok',
          clients: this.clients.size
        }));
        return;
      }

      // 404 for other routes
      res.writeHead(404);
      res.end('Not Found');
    });

    this.server.listen(this.port, () => {
      logger.info(`SSE server listening on port ${this.port}`);
    });
  }

  /**
   * Broadcast an event to all connected clients
   */
  broadcast(event: VaultEvent): void {
    const data = `data: ${JSON.stringify(event)}\n\n`;

    for (const client of this.clients) {
      try {
        client.write(data);
      } catch (error) {
        logger.warn('Failed to send SSE event to client:', error);
        this.clients.delete(client);
      }
    }
  }

  /**
   * Send event to a specific response
   */
  private sendEvent(res: http.ServerResponse, event: VaultEvent): void {
    const data = `data: ${JSON.stringify(event)}\n\n`;
    try {
      res.write(data);
    } catch (error) {
      logger.warn('Failed to send SSE event:', error);
    }
  }

  /**
   * Stop the SSE server
   */
  stop(): void {
    if (this.server) {
      // Close all client connections
      for (const client of this.clients) {
        try {
          client.end();
        } catch (e) {
          // Ignore
        }
      }
      this.clients.clear();

      this.server.close();
      this.server = null;
      logger.info('SSE server stopped');
    }
  }

  /**
   * Get number of connected clients
   */
  getClientCount(): number {
    return this.clients.size;
  }
}

export default SSEServer;
