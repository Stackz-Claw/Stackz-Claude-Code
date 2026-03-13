#!/usr/bin/env node

/**
 * Zettelkasten Workflow Processor
 * Dedicated script for processing fleeting notes into permanent knowledge
 */

const path = require('path')
const { processFleetingNotes, detectClusters, updateMasterIndex, generateWeeklyDigest } = require('./zettelkastenProcessor')

async function runZettelkastenWorkflow() {
  console.log('🚀 Starting Zettelkasten Workflow...')
  const startTime = new Date()

  try {
    // Phase 1: Process Expired Fleeting Notes
    console.log('\n Phase 1: Processing Expired Fleeting Notes...')
    const processResult = await processFleetingNotes(20) // Process up to 20 notes

    console.log(`   Processed: ${processResult.processed}`)
    console.log(`   Skipped: ${processResult.skipped}`)
    console.log(`   Errors: ${processResult.errors}`)

    if (processResult.error) {
      console.error(`   Error: ${processResult.error}`)
    }

    // Phase 2: Detect Clusters
    console.log('\n Phase 2: Detecting Knowledge Clusters...')
    const clusterResult = detectClusters()
    console.log(`   Detected ${clusterResult.clusters.length} clusters`)
    console.log(`   Generated ${clusterResult.suggestions.length} suggestions`)

    // Phase 3: Update Master Index
    console.log('\n Phase 3: Updating Master Index...')
    const indexResult = updateMasterIndex()
    console.log(`   Index updated: ${indexResult.updated}`)

    // Phase 4: Generate Weekly Digest (if Sunday)
    const today = new Date()
    if (today.getDay() === 0) { // Sunday
      console.log('\n Phase 4: Generating Weekly Digest...')
      const digestResult = generateWeeklyDigest()
      console.log(`   Digest generated: ${digestResult.generated}`)
    }

    const endTime = new Date()
    const duration = (endTime - startTime) / 1000 // seconds

    console.log(`\n✅ Zettelkasten Workflow Completed in ${duration.toFixed(2)} seconds`)

    // Log summary to file
    const fs = require('fs')
    const logDir = path.join(__dirname, '../logs')
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }

    const logFile = path.join(logDir, `zettelkasten-${startTime.toISOString().split('T')[0]}.log`)
    const logContent = `
Zettelkasten Workflow Summary
=============================
Start Time: ${startTime.toISOString()}
End Time: ${endTime.toISOString()}
Duration: ${duration.toFixed(2)} seconds

Results:
- Processed fleeting notes: ${processResult.processed}
- Skipped notes: ${processResult.skipped}
- Errors: ${processResult.errors}

Clusters detected: ${clusterResult.clusters.length}
Index updated: ${indexResult.updated}
`

    fs.appendFileSync(logFile, logContent)
    console.log(`\n📝 Log saved to: ${logFile}`)

  } catch (error) {
    console.error('❌ Zettelkasten Workflow Failed:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  runZettelkastenWorkflow()
}

module.exports = { runZettelkastenWorkflow }