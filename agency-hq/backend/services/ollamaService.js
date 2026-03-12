/**
 * Ollama Service - Self-Optimization Inference Engine
 * Powers all 5 self-optimization workflows
 */

const Database = require('better-sqlite3');

// Get fetch - native in Node 21+, or use node-fetch package
const nodeMajorVersion = parseInt(process.version.slice(1).split('.')[0]);
const fetch = nodeMajorVersion >= 21 ? globalThis.fetch : require('node-fetch');

// Ensure ollama_calls table exists
let db;
try {
  db = new Database('./db/agency.db');
  db.exec(`
    CREATE TABLE IF NOT EXISTS ollama_calls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent TEXT NOT NULL,
      model TEXT NOT NULL,
      tokens_in INTEGER DEFAULT 0,
      tokens_out INTEGER DEFAULT 0,
      latency_ms INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
} catch (e) {
  console.warn('[OllamaService] Database not available:', e.message);
}

const DEFAULT_BASE_URL = process.env.OLLAMA_BASE_URL || 'https://ollama.com/api';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'qwen3:32b';
const FAST_MODEL = 'mistral-small3.2';
const CONTEXT_LARGE = 65536;
const CONTEXT_FAST = 32768;

class OllamaService {
  constructor() {
    this.apiKey = process.env.OLLAMA_API_KEY;
    this.baseUrl = process.env.OLLAMA_BASE_URL || DEFAULT_BASE_URL;
    this.model = process.env.OLLAMA_MODEL || DEFAULT_MODEL;
  }

  /**
   * Main think() method - uses default model with large context
   */
  async think(systemPrompt, userPrompt, opts = {}) {
    return this._call(
      systemPrompt,
      userPrompt,
      {
        model: opts.model || this.model,
        num_ctx: opts.num_ctx || CONTEXT_LARGE,
        ...opts
      }
    );
  }

  /**
   * Fast think() for quick tasks - uses smaller model, smaller context
   */
  async thinkFast(prompt, opts = {}) {
    return this._call(
      'You are a helpful assistant.',
      prompt,
      {
        model: opts.model || FAST_MODEL,
        num_ctx: opts.num_ctx || CONTEXT_FAST,
        ...opts
      }
    );
  }

  /**
   * Internal call method with retry logic
   */
  async _call(systemPrompt, userPrompt, options) {
    const startTime = Date.now();
    const { model, num_ctx, ...restOptions } = options;

    const payload = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: false,
      options: {
        num_ctx,
        ...restOptions
      }
    };

    let attempts = 0;
    const maxAttempts = 3;
    const baseDelay = 5000;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${this.baseUrl}/chat`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const latency = Date.now() - startTime;

        if (response.status === 429 || response.status >= 500) {
          attempts++;
          if (attempts >= maxAttempts) {
            throw new Error(`Ollama API error after ${maxAttempts} attempts: ${response.status}`);
          }
          const delay = baseDelay * attempts;
          console.log(`[OllamaService] Rate limited. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Ollama API error: ${response.status} - ${error}`);
        }

        const data = await response.json();

        // Log to SQLite
        this._logCall(model, data, latency);

        return data.message.content;

      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw error;
        }
        const delay = baseDelay * attempts;
        console.log(`[OllamaService] Error: ${error.message}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Log each call to SQLite
   */
  _logCall(model, data, latency) {
    if (!db) return;

    try {
      const tokensIn = data.prompt_eval_count || 0;
      const tokensOut = data.eval_count || 0;

      const stmt = db.prepare(`
        INSERT INTO ollama_calls (agent, model, tokens_in, tokens_out, latency_ms)
        VALUES (?, ?, ?, ?, ?)
      `);

      stmt.run('stackz', model, tokensIn, tokensOut, latency);
    } catch (error) {
      console.error('[OllamaService] Failed to log call:', error.message);
    }
  }

  /**
   * Check if Ollama API is available
   */
  async checkHealth() {
    try {
      const start = Date.now();
      const response = await fetch(`${this.baseUrl}/tags`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      const latency = Date.now() - start;
      return {
        healthy: response.ok,
        latency,
        models: response.ok ? await response.json() : null
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        latency: null
      };
    }
  }
}

// Export singleton
module.exports = new OllamaService();
module.exports.OllamaService = OllamaService;