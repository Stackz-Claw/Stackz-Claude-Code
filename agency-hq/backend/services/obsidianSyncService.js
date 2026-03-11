const fs = require('fs')
const path = require('path')

const VAULT_PATH = '/Users/jaleeljenkins/Documents/Agents'
const SOUL_VAULT_SUBFOLDER = 'Agency HQ/Agents'

/**
 * Parse YAML frontmatter from markdown content
 * @param {string} content - Full markdown content with optional frontmatter
 * @returns {Object} { frontmatter: Object, body: string }
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) {
    return { frontmatter: {}, body: content }
  }

  const frontmatterStr = match[1]
  const body = match[2]

  const frontmatter = {}
  frontmatterStr.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':')
    if (colonIdx > -1) {
      const key = line.substring(0, colonIdx).trim()
      let value = line.substring(colonIdx + 1).trim()

      // Handle array values
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim())
      }

      frontmatter[key] = value
    }
  })

  return { frontmatter, body }
}

/**
 * Convert frontmatter object back to YAML string
 * @param {Object} frontmatter - Parsed frontmatter object
 * @returns {string} YAML string
 */
function stringifyFrontmatter(frontmatter) {
  const lines = []
  Object.entries(frontmatter).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.join(', ')}]`)
    } else {
      lines.push(`${key}: ${value}`)
    }
  })
  return lines.join('\n')
}

/**
 * Get the Obsidian vault path for a specific agent's soul file
 * @param {string} agentId - Agent identifier
 * @returns {string} Full path to vault soul file
 */
function getVaultSoulPath(agentId) {
  return path.join(VAULT_PATH, SOUL_VAULT_SUBFOLDER, agentId, 'soul.md')
}

/**
 * Ensure the agent folder exists in the vault
 * @param {string} agentId - Agent identifier
 */
function ensureVaultFolder(agentId) {
  const agentFolder = path.join(VAULT_PATH, SOUL_VAULT_SUBFOLDER, agentId)
  if (!fs.existsSync(agentFolder)) {
    fs.mkdirSync(agentFolder, { recursive: true })
  }
}

/**
 * Read soul file from local disk
 * @param {string} agentId - Agent identifier
 * @returns {Object|null} { frontmatter, body, raw } or null if not found
 */
function readLocalSoul(agentId) {
  const soulPath = path.join(__dirname, '..', 'souls', `${agentId}.md`)

  if (!fs.existsSync(soulPath)) {
    return null
  }

  const raw = fs.readFileSync(soulPath, 'utf-8')
  const { frontmatter, body } = parseFrontmatter(raw)

  return { frontmatter, body, raw }
}

/**
 * Write soul file to local disk
 * @param {string} agentId - Agent identifier
 * @param {Object} data - { frontmatter, body }
 */
function writeLocalSoul(agentId, data) {
  const soulPath = path.join(__dirname, '..', 'souls', `${agentId}.md`)
  const frontmatterStr = stringifyFrontmatter(data.frontmatter)
  const raw = `---\n${frontmatterStr}\n---\n${data.body}`

  fs.writeFileSync(soulPath, raw, 'utf-8')
}

/**
 * Read soul file from Obsidian vault
 * @param {string} agentId - Agent identifier
 * @returns {Object|null} { frontmatter, body, raw, modifiedAt } or null if not found
 */
function readVaultSoul(agentId) {
  const vaultPath = getVaultSoulPath(agentId)

  if (!fs.existsSync(vaultPath)) {
    return null
  }

  const stats = fs.statSync(vaultPath)
  const raw = fs.readFileSync(vaultPath, 'utf-8')
  const { frontmatter, body } = parseFrontmatter(raw)

  return {
    frontmatter,
    body,
    raw,
    modifiedAt: stats.mtime
  }
}

/**
 * Write soul file to Obsidian vault
 * @param {string} agentId - Agent identifier
 * @param {Object} data - { frontmatter, body }
 */
function writeVaultSoul(agentId, data) {
  ensureVaultFolder(agentId)
  const vaultPath = getVaultSoulPath(agentId)
  const frontmatterStr = stringifyFrontmatter(data.frontmatter)
  const raw = `---\n${frontmatterStr}\n---\n${data.body}`

  fs.writeFileSync(vaultPath, raw, 'utf-8')
}

/**
 * Sync all local soul files to Obsidian vault
 * Called on server startup
 * @returns {Object} Summary of sync results
 */
function syncAllToVault() {
  const soulsDir = path.join(__dirname, '..', 'souls')
  const results = { synced: [], skipped: [], errors: [] }

  if (!fs.existsSync(soulsDir)) {
    return results
  }

  const files = fs.readdirSync(soulsDir).filter(f => f.endsWith('.md'))

  files.forEach(file => {
    const agentId = file.replace('.md', '')
    try {
      const localSoul = readLocalSoul(agentId)
      if (localSoul) {
        writeVaultSoul(agentId, {
          frontmatter: localSoul.frontmatter,
          body: localSoul.body
        })
        results.synced.push(agentId)
      } else {
        results.skipped.push(agentId)
      }
    } catch (error) {
      results.errors.push({ agentId, error: error.message })
    }
  })

  return results
}

/**
 * Check which source (local or vault) has the newer version
 * @param {string} agentId - Agent identifier
 * @returns {'local' | 'vault' | 'equal' | 'missing'}
 */
function compareSoulVersions(agentId) {
  const localPath = path.join(__dirname, '..', 'souls', `${agentId}.md`)
  const vaultPath = getVaultSoulPath(agentId)

  const localExists = fs.existsSync(localPath)
  const vaultExists = fs.existsSync(vaultPath)

  if (!localExists && !vaultExists) {
    return 'missing'
  }

  if (!localExists) {
    return 'vault'
  }

  if (!vaultExists) {
    return 'local'
  }

  const localStats = fs.statSync(localPath)
  const vaultStats = fs.statSync(vaultPath)

  if (localStats.mtime > vaultStats.mtime) {
    return 'local'
  } else if (vaultStats.mtime > localStats.mtime) {
    return 'vault'
  }

  return 'equal'
}

/**
 * Pull soul from vault and overwrite local
 * @param {string} agentId - Agent identifier
 * @returns {Object} The pulled soul data
 */
function pullFromVault(agentId) {
  const vaultSoul = readVaultSoul(agentId)

  if (!vaultSoul) {
    throw new Error(`No soul file found in vault for agent: ${agentId}`)
  }

  writeLocalSoul(agentId, {
    frontmatter: vaultSoul.frontmatter,
    body: vaultSoul.body
  })

  return {
    frontmatter: vaultSoul.frontmatter,
    body: vaultSoul.body,
    raw: vaultSoul.raw
  }
}

module.exports = {
  parseFrontmatter,
  stringifyFrontmatter,
  readLocalSoul,
  writeLocalSoul,
  readVaultSoul,
  writeVaultSoul,
  syncAllToVault,
  compareSoulVersions,
  pullFromVault,
  getVaultSoulPath
}