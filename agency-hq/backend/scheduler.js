/**
 * Stackz Workflow Scheduler
 * Runs all scheduled workflows on cron schedule
 *
 * Each job triggers a Claude Code session that reads the workflow file and executes it.
 * All inference routes through Ollama API - no Anthropic credits consumed.
 */

const cron = require('node-cron');
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// === Configuration ===
const CLAUDE_BIN = 'claude'; // Assumes Claude Code is in PATH
const PROJECT_DIR = '/Users/jaleeljenkins/Desktop/Stackz/agency-hq';
const SELF_BUILD_PROMPT = `Run the SELF_BUILD workflow. Load GOAL.md and COMPLETION_MATRIX.md first. Focus on the highest-priority incomplete component.`;
const SELF_OPTIMIZE_PROMPT = `Run the SELF_OPTIMIZATION workflow. Analyze performance, identify inefficiencies, and generate improvement proposals for approval.`;
const MORNING_BRAINSTORM_PROMPT = `Run the MORNING_BRAINSTORM workflow. Generate 3 new profitable business ideas through structured brainstorming.`;
const WEEKLY_REPORT_PROMPT = `Run the WEEKLY_REPORT workflow. Generate comprehensive weekly report with key metrics and insights.`;
const SEMANTIC_SNAPSHOT_PROMPT = `Run the SEMANTIC_SNAPSHOT workflow. Capture current state and generate semantic snapshot for historical tracking.`;

// === Helper Functions ===

function runClaudeSession(prompt, logFile) {
  return new Promise((resolve, reject) => {
    console.log(`[Scheduler] Starting Claude session: ${prompt.substring(0, 50)}...`);

    const logStream = fs.createWriteStream(logFile, { flags: 'a' });

    const child = spawn(CLAUDE_BIN, [
      '--dangerously-skip-permissions',
      '--add-dir', PROJECT_DIR,
      '-p', prompt
    ], {
      cwd: PROJECT_DIR,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    child.stdout.on('data', (data) => {
      logStream.write(data.toString());
      process.stdout.write(data);
    });

    child.stderr.on('data', (data) => {
      logStream.write(data.toString());
      process.stderr.write(data);
    });

    child.on('close', (code) => {
      logStream.end();
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Session exited with code ${code}`));
      }
    });

    child.on('error', (error) => {
      logStream.end();
      reject(error);
    });
  });
}

function logToFile(message) {
  const logFile = path.join(LOG_DIR, 'scheduler.log');
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

// === Cron Jobs ===

/**
 * SELF_BUILD - 2:00 AM daily
 * Master nightly engine - builds highest-priority incomplete component
 */
cron.schedule('0 2 * * *', async () => {
  logToFile('Starting SELF_BUILD...');
  const logFile = path.join(LOG_DIR, `self-build-${new Date().toISOString().split('T')[0]}.log`);

  try {
    await runClaudeSession(SELF_BUILD_PROMPT, logFile);
    logToFile('SELF_BUILD completed successfully');
  } catch (error) {
    logToFile(`SELF_BUILD failed: ${error.message}`);
  }
}, {
  timezone: 'America/Los_Angeles'
});

/**
 * ZETTELKASTEN - 3:00 AM daily
 * Process fleeting notes, detect clusters
 */
cron.schedule('0 3 * * *', async () => {
  logToFile('Starting ZETTELKASTEN...');
  const logFile = path.join(LOG_DIR, `zettelkasten-${new Date().toISOString().split('T')[0]}.log`);

  try {
    // Use the dedicated Zettelkasten processor instead of Claude session
    const { runZettelkastenWorkflow } = require('./scripts/run-zettelkasten-workflow');

    // Redirect stdout to log file
    const originalStdoutWrite = process.stdout.write;
    const originalStderrWrite = process.stderr.write;

    const logStream = require('fs').createWriteStream(logFile, { flags: 'a' });
    process.stdout.write = function(chunk, encoding, callback) {
      logStream.write(chunk, encoding, callback);
      return originalStdoutWrite.call(this, chunk, encoding, callback);
    };

    process.stderr.write = function(chunk, encoding, callback) {
      logStream.write(chunk, encoding, callback);
      return originalStderrWrite.call(this, chunk, encoding, callback);
    };

    await runZettelkastenWorkflow();

    // Restore stdout/stderr
    process.stdout.write = originalStdoutWrite;
    process.stderr.write = originalStderrWrite;
    logStream.end();

    logToFile('ZETTELKASTEN completed successfully');
  } catch (error) {
    logToFile(`ZETTELKASTEN failed: ${error.message}`);
  }
}, {
  timezone: 'America/Los_Angeles'
});

/**
 * SYSTEM_HEALTH - 6:00 AM daily
 * Full system diagnostics + morning brief
 */
cron.schedule('0 6 * * *', async () => {
  logToFile('Starting SYSTEM_HEALTH...');
  const prompt = `Run the SYSTEM_HEALTH workflow. Run all health checks and generate the morning brief.`;
  const logFile = path.join(LOG_DIR, `system-health-${new Date().toISOString().split('T')[0]}.log`);

  try {
    // Run health checks via the service directly (no need for Claude)
    const healthService = require('./services/healthService');
    const results = await healthService.runHealthChecks();
    logToFile(`SYSTEM_HEALTH: ${results.summary.passed} passed, ${results.summary.failed} failed`);
  } catch (error) {
    logToFile(`SYSTEM_HEALTH failed: ${error.message}`);
  }
}, {
  timezone: 'America/Los_Angeles'
});

/**
 * IMPROVEMENT_LOOP - 3:00 AM Sundays
 * Audit all workflows, apply improvements
 */
cron.schedule('0 3 * * 0', async () => {
  logToFile('Starting IMPROVEMENT_LOOP...');
  const prompt = `Run the IMPROVEMENT_LOOP workflow. Audit all workflows from this week and propose structural improvements.`;
  const logFile = path.join(LOG_DIR, `improvement-${new Date().toISOString().split('T')[0]}.log`);

  try {
    await runClaudeSession(prompt, logFile);
    logToFile('IMPROVEMENT_LOOP completed');
  } catch (error) {
    logToFile(`IMPROVEMENT_LOOP failed: ${error.message}`);
  }
}, {
  timezone: 'America/Los_Angeles'
});

/**
 * VAULT_ORGANIZER - 3:00 AM daily
 * Vault maintenance, orphan detection
 */
cron.schedule('0 3 * * *', async () => {
  logToFile('Starting VAULT_ORGANIZER...');
  const prompt = `Run the VAULT_ORGANIZER workflow. Clean up orphan notes and maintain vault structure.`;
  const logFile = path.join(LOG_DIR, `vault-organizer-${new Date().toISOString().split('T')[0]}.log`);

  try {
    await runClaudeSession(prompt, logFile);
    logToFile('VAULT_ORGANIZER completed');
  } catch (error) {
    logToFile(`VAULT_ORGANIZER failed: ${error.message}`);
  }
}, {
  timezone: 'America/Los_Angeles'
});

/**
 * SELF-OP Polling - Every 30 minutes
 * Checks for new tasking in SELF-OP.md
 */
cron.schedule('*/30 * * * *', async () => {
  // This would use obsidian-vault-mcp to read SELF-OP.md
  // For now, just log that it's running
  logToFile('SELF-OP poll: checking for new tasking...');

  // TODO: Implement actual SELF-OP polling via obsidian-vault-mcp
  // const file = await obsidianMcp.read('SELF-OP.md');
  // if (hasNewTasking(file)) { triggerSession(); }
}, {
  timezone: 'America/Los_Angeles'
});

/**
 * STACKZ SELF-OPTIMIZATION - 5:00 AM daily
 * Stackz analyzes performance, identifies inefficiencies, and proposes improvements
 */
cron.schedule('0 5 * * *', async () => {
  logToFile('Starting STACKZ SELF-OPTIMIZATION...');
  const logFile = path.join(LOG_DIR, `self-optimization-${new Date().toISOString().split('T')[0]}.log`);

  try {
    await runClaudeSession(SELF_OPTIMIZE_PROMPT, logFile);
    logToFile('STACKZ SELF-OPTIMIZATION completed successfully');
  } catch (error) {
    logToFile(`STACKZ SELF-OPTIMIZATION failed: ${error.message}`);
  }
}, {
  timezone: 'America/Los_Angeles'
});

/**
 * MORNING BRAINSTORM - 8:00 AM daily
 * Generate 3 new profitable business ideas
 */
cron.schedule('0 8 * * *', async () => {
  logToFile('Starting MORNING BRAINSTORM...');
  const logFile = path.join(LOG_DIR, `morning-brainstorm-${new Date().toISOString().split('T')[0]}.log`);

  try {
    await runClaudeSession(MORNING_BRAINSTORM_PROMPT, logFile);
    logToFile('MORNING BRAINSTORM completed');
  } catch (error) {
    logToFile(`MORNING BRAINSTORM failed: ${error.message}`);
  }
}, {
  timezone: 'America/Los_Angeles'
});

/**
 * WEEKLY REPORT - 9:00 AM Sundays
 * Generate comprehensive weekly report
 */
cron.schedule('0 9 * * 0', async () => {
  logToFile('Starting WEEKLY REPORT...');
  const logFile = path.join(LOG_DIR, `weekly-report-${new Date().toISOString().split('T')[0]}.log`);

  try {
    await runClaudeSession(WEEKLY_REPORT_PROMPT, logFile);
    logToFile('WEEKLY REPORT completed');
  } catch (error) {
    logToFile(`WEEKLY REPORT failed: ${error.message}`);
  }
}, {
  timezone: 'America/Los_Angeles'
});

/**
 * SEMANTIC SNAPSHOT - 9:00 PM daily
 * Capture current state for historical tracking
 */
cron.schedule('0 21 * * *', async () => {
  logToFile('Starting SEMANTIC SNAPSHOT...');
  const logFile = path.join(LOG_DIR, `semantic-snapshot-${new Date().toISOString().split('T')[0]}.log`);

  try {
    await runClaudeSession(SEMANTIC_SNAPSHOT_PROMPT, logFile);
    logToFile('SEMANTIC SNAPSHOT completed');
  } catch (error) {
    logToFile(`SEMANTIC SNAPSHOT failed: ${error.message}`);
  }
}, {
  timezone: 'America/Los_Angeles'
});

/**
 * Midnight Cleanup - Archive COMPLETED TODAY
 */
cron.schedule('0 0 * * *', async () => {
  logToFile('Running midnight cleanup...');
  // TODO: Clear COMPLETED TODAY section of SELF-OP.md
}, {
  timezone: 'America/Los_Angeles'
});

module.exports = {
  runClaudeSession,
  logToFile
};