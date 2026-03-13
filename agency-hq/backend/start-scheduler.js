#!/usr/bin/env node

/**
 * Stackz Workflow Scheduler Starter
 *
 * This script starts the workflow scheduler independently from the main server.
 * It's useful for testing and ensuring workflows run as scheduled.
 */

const path = require('path');

// Change to the backend directory
process.chdir(path.join(__dirname, '..'));

// Load and start the scheduler
try {
  console.log('🚀 Starting Stackz Workflow Scheduler...');
  console.log('📂 Working directory:', process.cwd());

  // Load the scheduler module
  const scheduler = require('./scheduler.js');

  console.log('✅ Stackz Workflow Scheduler started successfully!');
  console.log('📅 All scheduled workflows are now active.');
  console.log('📁 Check backend/logs/ for execution logs.');

  // Keep the process alive
  setInterval(() => {
    // Keep alive - scheduler handles its own cron jobs
  }, 60000);

} catch (error) {
  console.error('❌ Failed to start Stackz Workflow Scheduler:');
  console.error(error.message);
  process.exit(1);
}