/**
 * Zettelkasten Processor Service
 * Handles efficient processing of fleeting notes into permanent knowledge
 */

const fs = require('fs')
const path = require('path')

// Obsidian vault paths
const OBSIDIAN_VAULT_PATH = '/Users/jaleeljenkins/Documents/Agents'
const ZETTELKASTEN_BASE = path.join(OBSIDIAN_VAULT_PATH, 'Agency HQ/Zettelkasten')

// Helper: parse YAML frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const frontmatter = {}
  const lines = match[1].split('\n')

  for (const line of lines) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue

    const key = line.slice(0, colonIdx).trim()
    let value = line.slice(colonIdx + 1).trim()

    // Handle arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''))
    }

    frontmatter[key] = value
  }

  return frontmatter
}

// Helper: check if a fleeting note has expired
function isExpired(frontmatter) {
  if (!frontmatter.expires_at) return false
  const expireDate = new Date(frontmatter.expires_at)
  return expireDate < new Date()
}

// Helper: generate permanent note ID
function generatePermanentNoteId(agent, title) {
  const now = new Date()
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const counter = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  const agentPrefix = agent.substring(0, 10).toLowerCase().replace(/[^a-z0-9]/g, '')

  // Create a slug from the title
  const titleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30)

  return `ZK-${dateStr}-${counter}-${agentPrefix}-${titleSlug}`.replace(/-+/g, '-').replace(/^-|-$/g, '')
}

// Process a single fleeting note into a permanent note
function processFleetingNote(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const frontmatter = parseFrontmatter(content)

    // Check if note has expired
    if (!isExpired(frontmatter)) {
      return { skipped: true, reason: 'Not expired yet' }
    }

    // Extract the main content (after frontmatter)
    const contentParts = content.split('---')
    const mainContent = contentParts.length >= 3 ? contentParts[2].trim() : ''

    if (!mainContent) {
      return { skipped: true, reason: 'No content' }
    }

    // Generate permanent note ID and filename
    const agent = frontmatter.agent || 'unknown'
    const title = mainContent.split('\n')[0].substring(0, 50) || 'Untitled Insight'
    const noteId = generatePermanentNoteId(agent, title)
    const permanentFilename = `${noteId}.md`
    const permanentPath = path.join(ZETTELKASTEN_BASE, 'Permanent', permanentFilename)

    // Create permanent note content
    const now = new Date().toISOString()
    const permanentContent = `---
type: permanent
id: ${noteId}
agent: ${agent}
team: ${frontmatter.team || 'unknown'}
created_at: ${now}
last_refined_at: ${now}
tags: [processed-from-fleeting]
source_fleeting: ${path.basename(filePath)}
status: active
---
# ${title}

${mainContent}

**Processed from fleeting note:** [[${path.basename(filePath, '.md')}]]
`

    // Ensure directory exists
    const dir = path.dirname(permanentPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Write permanent note
    fs.writeFileSync(permanentPath, permanentContent)

    // Optionally archive the fleeting note
    const archiveDir = path.join(ZETTELKASTEN_BASE, 'Archive', 'Fleeting')
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true })
    }

    const archivedPath = path.join(archiveDir, path.basename(filePath))
    fs.renameSync(filePath, archivedPath)

    return {
      success: true,
      permanentNoteId: noteId,
      archivedOriginal: archivedPath
    }
  } catch (error) {
    return { error: error.message }
  }
}

// Batch process fleeting notes
async function processFleetingNotes(batchSize = 10) {
  const results = {
    processed: 0,
    skipped: 0,
    errors: 0,
    details: []
  }

  try {
    const fleetingBaseDir = path.join(ZETTELKASTEN_BASE, 'Fleeting')

    if (!fs.existsSync(fleetingBaseDir)) {
      return results
    }

    // Get all agent directories
    const agentDirs = fs.readdirSync(fleetingBaseDir)
      .filter(item => fs.statSync(path.join(fleetingBaseDir, item)).isDirectory())

    // Process notes from each agent
    for (const agentDir of agentDirs) {
      const agentPath = path.join(fleetingBaseDir, agentDir)
      const files = fs.readdirSync(agentPath)
        .filter(file => file.endsWith('.md'))
        .map(file => path.join(agentPath, file))

      // Process up to batchSize notes
      let processedCount = 0
      for (const filePath of files) {
        if (processedCount >= batchSize) break

        const result = processFleetingNote(filePath)
        results.details.push({
          file: filePath,
          agent: agentDir,
          ...result
        })

        if (result.success) {
          results.processed++
          processedCount++
        } else if (result.skipped) {
          results.skipped++
        } else if (result.error) {
          results.errors++
        }
      }
    }
  } catch (error) {
    results.error = error.message
  }

  return results
}

// Detect clusters of related notes
function detectClusters() {
  // TODO: Implement clustering logic based on tags, content similarity, etc.
  return {
    clusters: [],
    suggestions: []
  }
}

// Update master index
function updateMasterIndex() {
  // TODO: Update the master index with new permanent notes
  return {
    updated: true,
    indexFile: path.join(ZETTELKASTEN_BASE, '_index', 'master-index.md')
  }
}

// Generate weekly digest
function generateWeeklyDigest() {
  // TODO: Generate weekly digest of new insights
  const now = new Date()
  const digestPath = path.join(ZETTELKASTEN_BASE, '_index', 'weekly-digest.md')

  const content = `---
type: digest
period: weekly
generated_at: ${now.toISOString()}
---
# Weekly Knowledge Digest - Week of ${now.toISOString().split('T')[0]}

## New Insights
- Placeholder for new insights this week

## Top Clusters
- Placeholder for detected clusters

## Agent Contributions
- Placeholder for agent contributions
`

  // Ensure directory exists
  const dir = path.dirname(digestPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(digestPath, content)

  return {
    generated: true,
    path: digestPath
  }
}

module.exports = {
  processFleetingNotes,
  detectClusters,
  updateMasterIndex,
  generateWeeklyDigest
}