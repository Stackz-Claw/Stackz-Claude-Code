/**
 * System Health Service - Autonomous Diagnostics
 * Checks all 10 health targets and generates morning brief narrative
 */

// Get fetch - native in Node 21+, or use node-fetch package
const nodeMajorVersion = parseInt(process.version.slice(1).split('.')[0]);
const fetch = nodeMajorVersion >= 21 ? globalThis.fetch : require('node-fetch');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const ollamaService = require('./ollamaService');

const db = new Database('./db/agency.db');

const HEALTH_TARGETS = {
  backendApi: 'Backend API',
  sqliteDb: 'SQLite DB',
  obsidianMcp: 'Obsidian MCP',
  stripeMcp: 'Stripe MCP',
  xMcp: 'X MCP',
  braveSearchMcp: 'Brave Search MCP',
  ollamaApi: 'Ollama API',
  scheduledWorkflows: 'Scheduled workflows',
  socketIo: 'Socket.io',
  laneQueue: 'Lane queue',
  gitRepo: 'Git repo'
};

/**
 * Run all health checks
 */
async function runHealthChecks() {
  const results = {
    timestamp: new Date().toISOString(),
    checks: {},
    summary: {
      passed: 0,
      failed: 0,
      warnings: 0
    }
  };

  // Run all checks in parallel
  const checkPromises = [
    checkBackendApi(),
    checkSqliteDb(),
    checkObsidianMcp(),
    checkStripeMcp(),
    checkXMcp(),
    checkBraveSearchMcp(),
    checkOllamaApi(),
    checkScheduledWorkflows(),
    checkSocketIo(),
    checkLaneQueue(),
    checkGitRepo()
  ];

  const checkResults = await Promise.all(checkPromises);

  Object.keys(HEALTH_TARGETS).forEach((key, index) => {
    results.checks[key] = checkResults[index];
    if (checkResults[index].status === 'pass') results.summary.passed++;
    else if (checkResults[index].status === 'fail') results.summary.failed++;
    else if (checkResults[index].status === 'warn') results.summary.warnings++;
  });

  // Generate narrative using Ollama
  const narrative = await generateHealthNarrative(results);

  results.narrative = narrative;
  results.allPassed = results.summary.failed === 0;

  // Save to disk
  await saveHealthReport(results);

  return results;
}

/**
 * Generate plain-English health narrative
 */
async function generateHealthNarrative(results) {
  const prompt = `Based on this health check result, write a brief plain-English narrative for Jaleel (the boss). Keep it under 3 sentences. Be direct and actionable.

HEALTH CHECK RESULTS:
- Passed: ${results.summary.passed}
- Failed: ${results.summary.failed}
- Warnings: ${results.summary.warnings}

Details:
${Object.entries(results.checks).map(([key, v]) => `${HEALTH_TARGETS[key]}: ${v.status} - ${v.message}`).join('\n')}

Write the narrative:`;

  try {
    const narrative = await ollamaService.thinkFast(prompt);
    return narrative;
  } catch (error) {
    console.error('[HealthService] Failed to generate narrative:', error.message);
    return `System check complete. ${results.summary.passed} checks passed, ${results.summary.failed} failed.`;
  }
}

// === Individual Health Checks ===

async function checkBackendApi() {
  try {
    const response = await fetch('http://localhost:3001/api/ping');
    const data = await response.json();
    return {
      status: response.ok ? 'pass' : 'fail',
      message: response.ok ? 'All API routes responding' : 'API issue detected'
    };
  } catch (error) {
    return {
      status: 'fail',
      message: `Backend unreachable: ${error.message}`
    };
  }
}

async function checkSqliteDb() {
  try {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const rowCounts = {};

    for (const table of tables) {
      try {
        const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get();
        rowCounts[table.name] = count.count;
      } catch (e) {
        rowCounts[table.name] = 'error';
      }
    }

    return {
      status: 'pass',
      message: `${tables.length} tables accessible`,
      details: rowCounts
    };
  } catch (error) {
    return {
      status: 'fail',
      message: `DB error: ${error.message}`
    };
  }
}

async function checkObsidianMcp() {
  // Try to read a test note via Obsidian MCP
  try {
    // This would use obsidian-vault-mcp if configured
    // For now, we'll check if the heartbeat service can reach it
    const heartbeatService = require('./heartbeatService');
    const obsidianCheck = await heartbeatService.checkMcpServer('obsidian', heartbeatService.MCP_SERVERS.obsidian);

    return {
      status: obsidianCheck.status === 'healthy' ? 'pass' :
              obsidianCheck.status === 'warning' ? 'warn' : 'fail',
      message: obsidianCheck.message,
      details: {
        responseTime: obsidianCheck.responseTime
      }
    };
  } catch (error) {
    return {
      status: 'fail',
      message: `Obsidian MCP error: ${error.message}`
    };
  }
}

async function checkStripeMcp() {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return {
        status: 'warn',
        message: 'Stripe not configured'
      };
    }

    // Try to fetch balance
    const response = await fetch('https://api.stripe.com/v1/balance', {
      headers: {
        'Authorization': `Bearer ${stripeKey}`
      }
    });

    return {
      status: response.ok ? 'pass' : 'fail',
      message: response.ok ? 'Stripe API responding' : 'Stripe API error'
    };
  } catch (error) {
    return {
      status: 'fail',
      message: `Stripe error: ${error.message}`
    };
  }
}

async function checkXMcp() {
  // Check X MCP server health using heartbeat service
  try {
    const heartbeatService = require('./heartbeatService');
    const xCheck = await heartbeatService.checkMcpServer('x', heartbeatService.MCP_SERVERS.x);

    return {
      status: xCheck.status === 'healthy' ? 'pass' :
              xCheck.status === 'warning' ? 'warn' : 'fail',
      message: xCheck.message,
      details: {
        responseTime: xCheck.responseTime
      }
    };
  } catch (error) {
    return {
      status: 'fail',
      message: `X MCP error: ${error.message}`
    };
  }
}

async function checkOllamaApi() {
  try {
    const health = await ollamaService.checkHealth();
    return {
      status: health.healthy ? 'pass' : 'fail',
      message: health.healthy ? `Ollama responding in ${health.latency}ms` : health.error
    };
  } catch (error) {
    return {
      status: 'fail',
      message: `Ollama error: ${error.message}`
    };
  }
}

async function checkScheduledWorkflows() {
  // Check if recent workflows ran
  try {
    const recentCalls = db.prepare(`
      SELECT COUNT(*) as count FROM ollama_calls
      WHERE created_at > datetime('now', '-26 hours')
    `).get();

    const hasRecentActivity = recentCalls.count > 0;

    return {
      status: hasRecentActivity ? 'pass' : 'warn',
      message: hasRecentActivity ? 'Workflows ran in last 26h' : 'No recent workflow activity'
    };
  } catch (error) {
    return {
      status: 'warn',
      message: 'Cannot determine workflow status'
    };
  }
}

async function checkSocketIo() {
  try {
    // Socket.io health would be checked via the socket itself
    return {
      status: 'pass',
      message: 'Socket.io assumed healthy (no explicit check)'
    };
  } catch (error) {
    return {
      status: 'fail',
      message: `Socket.io error: ${error.message}`
    };
  }
}

async function checkLaneQueue() {
  try {
    // Check for stuck messages
    const stuckMessages = db.prepare(`
      SELECT COUNT(*) as count FROM lane_queue
      WHERE created_at < datetime('now', '-2 hours')
      AND status != 'completed'
    `).get();

    return {
      status: stuckMessages.count === 0 ? 'pass' : 'warn',
      message: stuckMessages.count === 0 ? 'No stuck messages' : `${stuckMessages.count} stuck messages`
    };
  } catch (error) {
    return {
      status: 'warn',
      message: 'Lane queue check failed'
    };
  }
}

async function checkGitRepo() {
  try {
    const { execSync } = require('child_process');

    // Check for uncommitted changes
    const status = execSync('git status --porcelain', {
      cwd: path.join(__dirname, '../..'),
      encoding: 'utf8'
    });

    const uncommitted = status.trim().split('\n').filter(l => l.length > 0);

    // Check for old uncommitted files (would need git log for accurate check)
    return {
      status: uncommitted.length === 0 ? 'pass' : 'warn',
      message: uncommitted.length === 0 ? 'No uncommitted changes' : `${uncommitted.length} uncommitted files`
    };
  } catch (error) {
    return {
      status: 'warn',
      message: 'Git check unavailable'
    };
  }
}

async function checkBraveSearchMcp() {
  // Check Brave Search MCP server health using heartbeat service
  try {
    const heartbeatService = require('./heartbeatService');
    const braveCheck = await heartbeatService.checkMcpServer('braveSearch', heartbeatService.MCP_SERVERS.braveSearch);

    return {
      status: braveCheck.status === 'healthy' ? 'pass' :
              braveCheck.status === 'warning' ? 'warn' : 'fail',
      message: braveCheck.message,
      details: {
        responseTime: braveCheck.responseTime
      }
    };
  } catch (error) {
    return {
      status: 'fail',
      message: `Brave Search MCP error: ${error.message}`
    };
  }
}

async function saveHealthReport(results) {
  const date = new Date().toISOString().split('T')[0];
  const reportPath = path.join(__dirname, `../../docs/Self-Build/health-${date}.md`);

  const content = `# System Health Report

Generated: ${results.timestamp}

## Summary
- Passed: ${results.summary.passed}
- Failed: ${results.summary.failed}
- Warnings: ${results.summary.warnings}

## Narrative

${results.narrative}

## Detailed Results

| Check | Status | Message |
|-------|--------|---------|
${Object.entries(results.checks).map(([key, v]) => `| ${HEALTH_TARGETS[key]} | ${v.status} | ${v.message} |`).join('\n')}

---

*Auto-generated by SYSTEM_HEALTH workflow*
`;

  try {
    fs.writeFileSync(reportPath, content);
    console.log('[HealthService] Report saved:', reportPath);
  } catch (error) {
    console.error('[HealthService] Failed to save report:', error.message);
  }
}

module.exports = {
  runHealthChecks,
  HEALTH_TARGETS
};