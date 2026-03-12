/**
 * SystemScoreService — Keep/Discard experiment loop (Improvement Ratchet)
 *
 * Implements the autoresearch pattern: after every experiment, check metrics.
 * If improved: keep and update baseline. If worse: flag for review.
 * Creates a ratchet — the system can only get better, never worse.
 */

const fs = require('fs');
const path = require('path');

const BASELINE_FILE = path.join(__dirname, '../../docs/Self-Build/baseline-metrics.json');
const EXPERIMENT_LOG = path.join(__dirname, '../../docs/Self-Build/experiment-log.md');

// Default baseline metrics
const DEFAULT_BASELINE = {
  timestamp: null,
  metrics: {
    build_pass_rate: 0.0,
    selfop_completion_rate: 0.0,
    avg_cycle_time_min: 0.0,
    open_completion_matrix_items: 99,
    smoke_block_rate: 0.0,
    zettelkasten_notes: 0,
    test_pass_rate: 0.0
  }
};

/**
 * Read the baseline metrics from file
 */
async function readBaseline() {
  try {
    if (fs.existsSync(BASELINE_FILE)) {
      const data = fs.readFileSync(BASELINE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('[SystemScore] Error reading baseline:', e.message);
  }
  return { ...DEFAULT_BASELINE };
}

/**
 * Write the baseline metrics to file
 */
async function writeBaseline(baseline) {
  baseline.timestamp = new Date().toISOString();
  fs.writeFileSync(BASELINE_FILE, JSON.stringify(baseline, null, 2));
  console.log(`[SystemScore] Baseline updated: build_pass_rate=${baseline.metrics.build_pass_rate}%`);
}

/**
 * Collect current metrics from the system
 */
async function collectCurrentMetrics() {
  const metrics = {
    build_pass_rate: 0.0,
    selfop_completion_rate: 0.0,
    avg_cycle_time_min: 0.0,
    open_completion_matrix_items: 99,
    smoke_block_rate: 0.0,
    zettelkasten_notes: 0,
    test_pass_rate: 0.0
  };

  try {
    // Try to read completion matrix to count open items
    const matrixPath = path.join(__dirname, '../../docs/Self-Build/COMPLETION_MATRIX.md');
    if (fs.existsSync(matrixPath)) {
      const content = fs.readFileSync(matrixPath, 'utf8');
      const todoMatches = content.match(/\|.*TODO.*\|/g);
      if (todoMatches) {
        metrics.open_completion_matrix_items = todoMatches.length;
      }
    }
  } catch (e) {
    console.error('[SystemScore] Error reading completion matrix:', e.message);
  }

  // TODO: Query SQLite for actual metrics
  // - build_pass_rate: from selfbuild_experiments table
  // - selfop_completion_rate: from selfop_sessions table
  // - avg_cycle_time_min: from selfop_sessions table
  // - smoke_block_rate: from smoke_reviews table
  // - zettelkasten_notes: count permanent notes
  // - test_pass_rate: from system_checks table

  return metrics;
}

/**
 * Calculate if new metrics represent an improvement
 */
function isImprovement(newMetrics, baseline) {
  let improved = false;
  const deltas = {};

  // Metrics where higher is better
  const higherBetter = ['build_pass_rate', 'selfop_completion_rate', 'zettelkasten_notes', 'test_pass_rate'];

  // Metrics where lower is better
  const lowerBetter = ['avg_cycle_time_min', 'open_completion_matrix_items', 'smoke_block_rate'];

  for (const key of higherBetter) {
    if (newMetrics[key] > baseline.metrics[key]) {
      deltas[key] = '+' + (newMetrics[key] - baseline.metrics[key]).toFixed(2);
      improved = true;
    } else {
      deltas[key] = (newMetrics[key] - baseline.metrics[key]).toFixed(2);
    }
  }

  for (const key of lowerBetter) {
    if (newMetrics[key] < baseline.metrics[key]) {
      deltas[key] = (baseline.metrics[key] - newMetrics[key]).toFixed(2) + ' (lower is better)';
      improved = true;
    } else {
      deltas[key] = (newMetrics[key] - baseline.metrics[key]).toFixed(2);
    }
  }

  return { improved, deltas };
}

/**
 * Log an experiment result
 */
async function logExperiment({ result, commitHash, delta, sessionType = 'SELF_BUILD', notes = '' }) {
  const date = new Date().toISOString().split('T')[0];

  let logContent = '';
  if (fs.existsSync(EXPERIMENT_LOG)) {
    logContent = fs.readFileSync(EXPERIMENT_LOG, 'utf8');
  } else {
    logContent = '# Experiment Log\n\n';
    logContent += '| Date | Session | Verdict | Build Pass Rate | Cycle Time | Notes |\n';
    logContent += '|------|---------|---------|-----------------|------------|-------|\n';
  }

  const deltaStr = typeof delta === 'object' ? JSON.stringify(delta) : delta;
  const row = `| ${date} | ${sessionType} | ${result} | - | - | ${notes || deltaStr} |\n`;

  // Append before the last closing newline if exists
  if (logContent.endsWith('\n')) {
    logContent = logContent.trimEnd() + '\n' + row;
  } else {
    logContent += row;
  }

  fs.writeFileSync(EXPERIMENT_LOG, logContent);
  console.log(`[SystemScore] Experiment logged: ${result} - ${commitHash}`);
}

/**
 * Score the current session and decide whether to keep or flag
 * @param {string} sessionType - SELF_BUILD or SELF-OP
 * @param {string} commitHash - Git commit hash
 * @param {object} checkResults - Results from systemChecks
 */
async function scoreAndDecide(sessionType, commitHash, checkResults = null) {
  const newMetrics = await collectCurrentMetrics();
  const baseline = await readBaseline();
  const { improved, deltas } = isImprovement(newMetrics, baseline);

  // If there are failed system checks, always flag
  const checksPassed = checkResults?.passed ?? true;
  const checksFailed = checkResults?.failed ?? 0;

  if (!checksPassed) {
    await logExperiment({
      result: 'CHECK_FAIL',
      commitHash,
      delta: deltas,
      sessionType,
      notes: `Checks failed: ${checkResults?.failed} failed`
    });
    return {
      verdict: 'FLAG',
      reason: 'system_checks_failed',
      message: 'System checks failed. Rolling back change.'
    };
  }

  if (improved) {
    await writeBaseline({ ...baseline, metrics: newMetrics });
    await logExperiment({
      result: 'KEPT',
      commitHash,
      delta: deltas,
      sessionType
    });
    return {
      verdict: 'KEEP',
      message: 'Metrics improved. Baseline updated.'
    };
  } else {
    await logExperiment({
      result: 'FLAGGED',
      commitHash,
      delta: deltas,
      sessionType,
      notes: 'Metrics did not improve'
    });
    return {
      verdict: 'FLAG',
      reason: 'no_improvement',
      message: 'Metrics did not improve. Smoke to review.'
    };
  }
}

/**
 * Initialize baseline file if it doesn't exist
 */
async function initializeBaseline() {
  if (!fs.existsSync(BASELINE_FILE)) {
    const baseline = { ...DEFAULT_BASELINE };
    baseline.timestamp = new Date().toISOString();
    await writeBaseline(baseline);
    console.log('[SystemScore] Baseline initialized');
  }
}

/**
 * Get current score status for UI
 */
async function getScoreStatus() {
  const baseline = await readBaseline();
  const current = await collectCurrentMetrics();
  const { improved, deltas } = isImprovement(current, baseline);

  return {
    baseline: baseline.metrics,
    current,
    deltas,
    trend: improved ? 'up' : 'down',
    lastUpdate: baseline.timestamp
  };
}

module.exports = {
  TimeBudgetService,
  parseTimeBudget,
  readBaseline,
  writeBaseline,
  collectCurrentMetrics,
  isImprovement,
  logExperiment,
  scoreAndDecide,
  initializeBaseline,
  getScoreStatus
};