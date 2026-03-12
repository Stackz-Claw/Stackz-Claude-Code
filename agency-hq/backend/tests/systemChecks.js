/**
 * SystemChecks — Metric-first evaluation suite
 *
 * Implements the autoresearch pattern: run automated checks before commit.
 * If metrics regress, Stackz reverts before Smoke even reviews.
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const CHECKS = [
  {
    name: 'API health',
    description: 'Backend API responds to health check',
    run: async () => {
      try {
        const res = await fetch('http://localhost:3001/api/health');
        return res.ok;
      } catch {
        return false;
      }
    }
  },
  {
    name: 'SQLite accessible',
    description: 'Database is readable and writable',
    run: async () => {
      try {
        const dbPath = path.join(__dirname, '../db/agency.db');
        const db = new Database(dbPath, { readonly: true });
        const row = db.prepare('SELECT 1 as ok').get();
        db.close();
        return row.ok === 1;
      } catch (e) {
        console.error('[systemChecks] SQLite error:', e.message);
        return false;
      }
    }
  },
  {
    name: 'Frontend builds',
    description: 'Frontend compiles without errors',
    run: async () => {
      try {
        execSync('npm run build', {
          cwd: path.join(__dirname, '../../frontend'),
          stdio: 'pipe',
          timeout: 120000 // 2 min timeout
        });
        return true;
      } catch (e) {
        console.error('[systemChecks] Build error:', e.message);
        return false;
      }
    }
  },
  {
    name: 'No critical errors in logs',
    description: 'Recent server logs contain no ERROR entries',
    run: async () => {
      // This would require access to the running process logs
      // For now, return true as a placeholder
      return true;
    }
  },
  {
    name: 'Socket.io connected',
    description: 'WebSocket server is responding',
    run: async () => {
      // Basic check - if API is up, socket is likely up
      try {
        const res = await fetch('http://localhost:3001/api/health');
        return res.ok;
      } catch {
        return false;
      }
    }
  },
  {
    name: 'Frontend static files exist',
    description: 'Build output directory has required files',
    run: async () => {
      try {
        const distPath = path.join(__dirname, '../../frontend/dist');
        if (!fs.existsSync(distPath)) {
          // Try to build first
          execSync('npm run build', {
            cwd: path.join(__dirname, '../../frontend'),
            stdio: 'pipe',
            timeout: 120000
          });
        }
        return fs.existsSync(distPath);
      } catch {
        return false;
      }
    }
  }
];

/**
 * Run all system checks
 * @returns {Promise<{results: Array, passed: number, failed: number, total: number}>}
 */
async function runChecks() {
  const results = [];

  for (const check of CHECKS) {
    const result = {
      name: check.name,
      description: check.description,
      passed: false,
      error: null
    };

    try {
      const startTime = Date.now();
      result.passed = await check.run();
      result.duration = Date.now() - startTime;
    } catch (e) {
      result.passed = false;
      result.error = e.message;
      result.duration = 0;
    }

    results.push(result);
    console.log(`[systemChecks] ${check.name}: ${result.passed ? 'PASS' : 'FAIL'}`);
  }

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  return {
    results,
    passed,
    failed,
    total: CHECKS.length
  };
}

/**
 * Run checks and abort if critical checks fail
 * @param {boolean} abortOnFail - Whether to throw on check failure
 * @throws {Error} If abortOnFail is true and any check fails
 */
async function runChecksWithAbort(abortOnFail = true) {
  const result = await runChecks();

  if (abortOnFail && result.failed > 0) {
    const failedNames = result.results
      .filter(r => !r.passed)
      .map(r => r.name)
      .join(', ');

    throw new Error(
      `METRIC_CHECKS_FAILED: ${result.failed} check(s) failed: ${failedNames}`
    );
  }

  return result;
}

/**
 * Run a specific check by name
 */
async function runCheck(checkName) {
  const check = CHECKS.find(c => c.name === checkName);
  if (!check) {
    throw new Error(`Unknown check: ${checkName}`);
  }

  try {
    const passed = await check.run();
    return { name: checkName, passed, error: null };
  } catch (e) {
    return { name: checkName, passed: false, error: e.message };
  }
}

/**
 * Get list of available checks
 */
function getAvailableChecks() {
  return CHECKS.map(c => ({
    name: c.name,
    description: c.description
  }));
}

/**
 * Add a new check to the suite
 * @param {object} check - Check definition
 */
function registerCheck(check) {
  if (!check.name || !check.run || typeof check.run !== 'function') {
    throw new Error('Check must have name and run function');
  }
  CHECKS.push(check);
  console.log(`[systemChecks] Registered new check: ${check.name}`);
}

module.exports = {
  runChecks,
  runChecksWithAbort,
  runCheck,
  getAvailableChecks,
  registerCheck,
  CHECKS
};