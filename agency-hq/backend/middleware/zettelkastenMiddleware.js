/**
 * Zettelkasten Agent Middleware
 * Middleware for agents to automatically store context in the Zettelkasten system
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

// Create a fleeting note
function createFleetingNote(agent, team, content, context = '', tags = []) {
  try {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours

    // Create a slug from the content
    const slug = content.slice(0, 30).toLowerCase().replace(/[^a-z0-9]/g, '-')
    const filename = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}-${String(now.getMinutes()).padStart(2,'0')}-${agent}-${slug}.md`

    const fleetingDir = path.join(ZETTELKASTEN_BASE, 'Fleeting', agent)
    if (!fs.existsSync(fleetingDir)) {
      fs.mkdirSync(fleetingDir, { recursive: true })
    }

    // Format tags properly
    const formattedTags = Array.isArray(tags) ? `[${tags.map(t => `"${t}"`).join(', ')}]` : '[]'

    const frontmatter = `---
type: fleeting
agent: ${agent}
team: ${team || 'unknown'}
captured_at: ${now.toISOString()}
expires_at: ${expiresAt.toISOString()}
status: raw
promote_to: pending
context: ${context || ''}
tags: ${formattedTags}
---
${content}`

    const filePath = path.join(fleetingDir, filename)
    fs.writeFileSync(filePath, frontmatter)

    return {
      success: true,
      path: `Fleeting/${agent}/${filename}`,
      obsidian_link: `obsidian://open?vault=Agents&file=${encodeURIComponent('Agency HQ/Zettelkasten/Fleeting/' + agent + '/' + filename)}`
    }
  } catch (error) {
    return { error: error.message }
  }
}

// Create a permanent note
function createPermanentNote(agent, team, title, content, tags = [], linkedNotes = []) {
  try {
    const now = new Date()

    // Generate note ID
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
    const counter = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const agentPrefix = agent.substring(0, 10).toLowerCase().replace(/[^a-z0-9]/g, '')
    const titleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30)
    const noteId = `ZK-${dateStr}-${counter}-${agentPrefix}-${titleSlug}`.replace(/-+/g, '-').replace(/^-|-$/g, '')

    const filename = `${noteId}.md`
    const permanentDir = path.join(ZETTELKASTEN_BASE, 'Permanent')

    if (!fs.existsSync(permanentDir)) {
      fs.mkdirSync(permanentDir, { recursive: true })
    }

    // Format tags properly
    const formattedTags = Array.isArray(tags) ? `[${tags.map(t => `"${t}"`).join(', ')}]` : '[]'

    // Format linked notes
    const linkedNotesSection = linkedNotes.length > 0 ?
      `\n**Connections:**\n${linkedNotes.map(note => `- [[${note}]]`).join('\n')}` : ''

    const frontmatter = `---
type: permanent
id: ${noteId}
agent: ${agent}
team: ${team || 'unknown'}
created_at: ${now.toISOString()}
last_refined_at: ${now.toISOString()}
tags: ${formattedTags}
status: active
---

## ${title}

${content}${linkedNotesSection}
`

    const filePath = path.join(permanentDir, filename)
    fs.writeFileSync(filePath, frontmatter)

    return {
      success: true,
      id: noteId,
      path: `Permanent/${filename}`,
      obsidian_link: `obsidian://open?vault=Agents&file=${encodeURIComponent('Agency HQ/Zettelkasten/Permanent/' + filename)}`
    }
  } catch (error) {
    return { error: error.message }
  }
}

// Log workflow execution context
function logWorkflowContext(workflowId, phase, context, outcome, agent = 'system') {
  const content = `Workflow: ${workflowId}
Phase: ${phase}
Outcome: ${outcome}

Context:
${typeof context === 'object' ? JSON.stringify(context, null, 2) : context}`

  return createFleetingNote(agent, 'Workflows', content, `Workflow execution: ${workflowId}`, ['workflow', 'execution', workflowId])
}

// Log agent decision-making process
function logAgentThought(agent, thoughtProcess, decision, context = '') {
  const content = `Thought Process:
${thoughtProcess}

Decision: ${decision}

Context: ${context}`

  return createFleetingNote(agent, 'Agents', content, 'Agent decision-making', ['agent', 'thinking', 'decision'])
}

// Log system insights
function logSystemInsight(title, insight, evidence, implications, tags = []) {
  const content = `# ${title}

## Insight
${insight}

## Evidence
${evidence}

## Implications
${implications}`

  // Add system tags
  const allTags = [...tags, 'system', 'insight']

  return createPermanentNote('system', 'Infrastructure', title, content, allTags)
}

module.exports = {
  createFleetingNote,
  createPermanentNote,
  logWorkflowContext,
  logAgentThought,
  logSystemInsight
}