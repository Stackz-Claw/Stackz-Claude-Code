const express = require('express')
const router = express.Router()
const obsidianSync = require('../services/obsidianSyncService')

/**
 * GET /api/agents/:id/soul
 * Get soul file - reads from local disk and checks Obsidian for newer version
 */
router.get('/:id/soul', (req, res) => {
  const { id } = req.params

  try {
    const localSoul = obsidianSync.readLocalSoul(id)
    const vaultSoul = obsidianSync.readVaultSoul(id)
    const versionStatus = obsidianSync.compareSoulVersions(id)

    if (!localSoul && !vaultSoul) {
      return res.status(404).json({ error: `No soul file found for agent: ${id}` })
    }

    // If vault is newer, prefer vault content
    let soul
    if (versionStatus === 'vault' && vaultSoul) {
      soul = {
        frontmatter: vaultSoul.frontmatter,
        body: vaultSoul.body,
        raw: vaultSoul.raw,
        source: 'vault'
      }
    } else if (localSoul) {
      soul = {
        frontmatter: localSoul.frontmatter,
        body: localSoul.body,
        raw: localSoul.raw,
        source: 'local'
      }
    } else {
      soul = {
        frontmatter: vaultSoul.frontmatter,
        body: vaultSoul.body,
        raw: vaultSoul.raw,
        source: 'vault'
      }
    }

    res.json({
      agentId: id,
      versionStatus,
      ...soul
    })
  } catch (error) {
    console.error(`[SoulAPI] Error getting soul for ${id}:`, error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * PUT /api/agents/:id/soul
 * Update soul file - saves to local disk and syncs to Obsidian
 */
router.put('/:id/soul', (req, res) => {
  const { id } = req.params
  const { frontmatter, body } = req.body

  if (!frontmatter && !body) {
    return res.status(400).json({ error: 'Must provide frontmatter or body' })
  }

  try {
    // Get existing to preserve fields
    const existing = obsidianSync.readLocalSoul(id) || { frontmatter: {}, body: '' }

    const updated = {
      frontmatter: { ...existing.frontmatter, ...frontmatter },
      body: body || existing.body
    }

    // Write to local disk
    obsidianSync.writeLocalSoul(id, updated)

    // Sync to vault
    obsidianSync.writeVaultSoul(id, updated)

    // Emit socket event
    const io = req.app.get('io')
    if (io) {
      io.emit('agent:soul-updated', {
        agentId: id,
        frontmatter: updated.frontmatter,
        body: updated.body,
        timestamp: new Date().toISOString()
      })
    }

    res.json({
      success: true,
      agentId: id,
      versionStatus: 'local',
      frontmatter: updated.frontmatter,
      body: updated.body
    })
  } catch (error) {
    console.error(`[SoulAPI] Error updating soul for ${id}:`, error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/agents/:id/soul/pull-from-obsidian
 * Pull soul from Obsidian vault, overwriting local file
 */
router.post('/:id/soul/pull-from-obsidian', (req, res) => {
  const { id } = req.params

  try {
    const pulledSoul = obsidianSync.pullFromVault(id)

    // Emit socket event for frontend update
    const io = req.app.get('io')
    if (io) {
      io.emit('agent:soul-updated', {
        agentId: id,
        frontmatter: pulledSoul.frontmatter,
        body: pulledSoul.body,
        timestamp: new Date().toISOString()
      })
    }

    res.json({
      success: true,
      agentId: id,
      source: 'vault',
      frontmatter: pulledSoul.frontmatter,
      body: pulledSoul.body
    })
  } catch (error) {
    console.error(`[SoulAPI] Error pulling soul for ${id}:`, error)
    res.status(404).json({ error: error.message })
  }
})

/**
 * GET /api/agents/:id/soul/status
 * Get sync status between local and vault
 */
router.get('/:id/soul/status', (req, res) => {
  const { id } = req.params

  try {
    const versionStatus = obsidianSync.compareSoulVersions(id)
    const localSoul = obsidianSync.readLocalSoul(id)
    const vaultSoul = obsidianSync.readVaultSoul(id)

    res.json({
      agentId: id,
      versionStatus,
      hasLocal: !!localSoul,
      hasVault: !!vaultSoul,
      localPath: `/backend/souls/${id}.md`,
      vaultPath: obsidianSync.getVaultSoulPath(id)
    })
  } catch (error) {
    console.error(`[SoulAPI] Error getting status for ${id}:`, error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/agents/:id/soul/push-to-obsidian
 * Force push local soul to vault
 */
router.post('/:id/soul/push-to-obsidian', (req, res) => {
  const { id } = req.params

  try {
    const localSoul = obsidianSync.readLocalSoul(id)

    if (!localSoul) {
      return res.status(404).json({ error: `No local soul file found for agent: ${id}` })
    }

    obsidianSync.writeVaultSoul(id, {
      frontmatter: localSoul.frontmatter,
      body: localSoul.body
    })

    res.json({
      success: true,
      agentId: id,
      action: 'pushed to vault'
    })
  } catch (error) {
    console.error(`[SoulAPI] Error pushing soul for ${id}:`, error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router