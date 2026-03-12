/**
 * TimeBudgetService — Fixed time budget per experiment
 *
 * Implements the autoresearch pattern: every task gets a declared time budget.
 * This forces scope discipline and makes nightly cycles predictable.
 */

class TimeBudgetService {
  constructor(budgetMinutes, taskName = 'task') {
    this.budgetMinutes = budgetMinutes;
    this.taskName = taskName;
    this.deadline = Date.now() + budgetMinutes * 60 * 1000;
    this.startedAt = Date.now();
    this.checkpoints = [];
  }

  /**
   * Check if the budget has been exceeded
   */
  isExpired() {
    return Date.now() > this.deadline;
  }

  /**
   * Get remaining time in minutes
   */
  remainingMinutes() {
    return Math.max(0, (this.deadline - Date.now()) / 60000);
  }

  /**
   * Get elapsed time in minutes
   */
  elapsedMinutes() {
    return (Date.now() - this.startedAt) / 60000;
  }

  /**
   * Get elapsed time in seconds (for more precision)
   */
  elapsedSeconds() {
    return (Date.now() - this.startedAt) / 1000;
  }

  /**
   * Check if there's enough time remaining for a given subtask
   * @param {number} minMinutes - Minimum minutes needed
   * @returns {boolean}
   */
  hasTimeFor(minMinutes) {
    return this.remainingMinutes() >= minMinutes;
  }

  /**
   * Record a checkpoint at current time
   * @param {string} name - Checkpoint name
   */
  checkpoint(name) {
    this.checkpoints.push({
      name,
      timestamp: Date.now(),
      elapsedSeconds: this.elapsedSeconds()
    });
    return this;
  }

  /**
   * Check budget before starting a subtask - throws if exceeded
   * @param {string} taskName - Name of the subtask
   * @param {number} minRequired - Minimum minutes required (optional buffer)
   */
  checkpointOrAbort(taskName, minRequired = 1) {
    if (this.isExpired()) {
      throw new Error(
        `TIME_BUDGET_EXCEEDED: ${taskName || this.taskName} aborted after ` +
        `${this.elapsedMinutes().toFixed(1)} min. ` +
        `Partial work committed. Remainder queued for next cycle.`
      );
    }

    if (!this.hasTimeFor(minRequired)) {
      throw new Error(
        `TIME_BUDGET_LOW: ${taskName || this.taskName} requires ${minRequired}min ` +
        `but only ${this.remainingMinutes().toFixed(1)}min remain. ` +
        `Consider committing partial work.`
      );
    }

    this.checkpoint(taskName);
    return true;
  }

  /**
   * Get status object for logging
   */
  getStatus() {
    return {
      taskName: this.taskName,
      budgetMinutes: this.budgetMinutes,
      elapsedMinutes: this.elapsedMinutes(),
      remainingMinutes: this.remainingMinutes(),
      percentUsed: (this.elapsedMinutes() / this.budgetMinutes) * 100,
      isExpired: this.isExpired(),
      checkpoints: this.checkpoints
    };
  }

  /**
   * Create a child budget for a subtask
   * @param {number} minutes - Budget for subtask
   * @param {string} name - Subtask name
   * @returns {TimeBudgetService}
   */
  spawn(minutes, name) {
    return new TimeBudgetService(minutes, name);
  }
}

/**
 * Parse time budget from a task string
 * Format: "Task description\nBUDGET: 20min\n---"
 * @param {string} taskString
 * @returns {object} { task: string, budgetMinutes: number | null }
 */
function parseTimeBudget(taskString) {
  const budgetMatch = taskString.match(/BUDGET:\s*(\d+)\s*min/i);
  const budgetMinutes = budgetMatch ? parseInt(budgetMatch[1], 10) : null;

  // Remove budget line from task string
  const task = taskString
    .replace(/BUDGET:\s*\d+\s*min\s*\n?/gi, '')
    .replace(/^---\s*$/gm, '')
    .trim();

  return { task, budgetMinutes };
}

module.exports = {
  TimeBudgetService,
  parseTimeBudget
};