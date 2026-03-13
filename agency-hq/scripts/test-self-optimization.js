#!/usr/bin/env node

/**
 * Test Script for Stackz Self-Optimization Workflow
 *
 * This script manually triggers the self-optimization workflow
 * to verify that it's properly configured in the scheduler.
 */

const { exec } = require('child_process');
const path = require('path');

// Configuration
const PROJECT_DIR = '/Users/jaleeljenkins/Desktop/Stackz/agency-hq';
const CLAUDE_BIN = 'claude';

// Self-optimization prompt
const SELF_OPTIMIZE_PROMPT = `Run the SELF_OPTIMIZATION workflow. Analyze performance, identify inefficiencies, and generate improvement proposals for approval.`;

console.log('🚀 Testing Stackz Self-Optimization Workflow...');
console.log('📂 Project Directory:', PROJECT_DIR);
console.log('');

// Run Claude session
const command = `${CLAUDE_BIN} --dangerously-skip-permissions --add-dir ${PROJECT_DIR} -p "${SELF_OPTIMIZE_PROMPT}"`;

console.log('🔧 Executing command:');
console.log(command);
console.log('');

exec(command, { cwd: PROJECT_DIR, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error executing self-optimization workflow:');
    console.error(error.message);
    return;
  }

  if (stderr) {
    console.error('⚠️ Standard Error:');
    console.error(stderr);
  }

  if (stdout) {
    console.log('✅ Standard Output:');
    console.log(stdout);
  }

  console.log('✅ Self-optimization workflow test completed successfully!');
});