const fs = require('fs')
const path = require('path')
const obsidianSync = require('./obsidianSyncService')

let watcher = null
let io = null

/**
 * Initialize the soul file watcher
 * @param {Object} socketIo - Socket.io instance for emitting events
 */
function initSoulWatcher(socketIo) {
  io = socketIo
  const soulsDir = path.join(__dirname, '..', 'souls')

  // Ensure directory exists
  if (!fs.existsSync(soulsDir)) {
    fs.mkdirSync(soulsDir, { recursive: true })
  }

  // Sync all soul files to vault on startup
  console.log('[SoulWatcher] Syncing soul files to Obsidian vault...')
  const syncResults = obsidianSync.syncAllToVault()
  console.log(`[SoulWatcher] Synced ${syncResults.synced.length} soul files to vault`)

  if (syncResults.errors.length > 0) {
    console.error('[SoulWatcher] Sync errors:', syncResults.errors)
  }

  // Set up file watcher
  watcher = fs.watch(soulsDir, { persistent: true }, (eventType, filename) => {
    if (!filename || !filename.endsWith('.md')) {
      return
    }

    const agentId = filename.replace('.md', '')
    console.log(`[SoulWatcher] Detected ${eventType} on ${filename}`)

    handleSoulChange(agentId)
  })

  console.log('[SoulWatcher] Watching for soul file changes...')
}

/**
 * Handle soul file change event
 * @param {string} agentId - Agent identifier
 */
function handleSoulChange(agentId) {
  // Debounce: wait a bit for file to finish writing
  setTimeout(() => {
    try {
      const localSoul = obsidianSync.readLocalSoul(agentId)

      if (!localSoul) {
        console.log(`[SoulWatcher] Soul file deleted for ${agentId}`)
        return
      }

      // Write to vault
      obsidianSync.writeVaultSoul(agentId, {
        frontmatter: localSoul.frontmatter,
        body: localSoul.body
      })

      console.log(`[SoulWatcher] Synced ${agentId} soul to vault`)

      // Emit socket event for frontend to update
      if (io) {
        io.emit('agent:soul-updated', {
          agentId,
          frontmatter: localSoul.frontmatter,
          body: localSoul.body,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error(`[SoulWatcher] Error syncing soul for ${agentId}:`, error)
    }
  }, 100)
}

/**
 * Stop the soul file watcher
 */
function stopSoulWatcher() {
  if (watcher) {
    watcher.close()
    watcher = null
    console.log('[SoulWatcher] Stopped watching soul files')
  }
}

/**
 * Get the watcher status
 */
function getWatcherStatus() {
  return {
    active: watcher !== null,
    watchDir: path.join(__dirname, '..', 'souls')
  }
}

module.exports = {
  initSoulWatcher,
  stopSoulWatcher,
  getWatcherStatus
}