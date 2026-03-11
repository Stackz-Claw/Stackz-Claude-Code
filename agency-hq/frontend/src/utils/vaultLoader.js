import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Path to Obsidian vault - adjust this to your vault location
const VAULT_PATH = path.join(process.env.HOME || '/Users/jaleeljenkins', 'Documents', 'Agents')

// Parse markdown table to array of objects
function parseMarkdownTable(markdown) {
  const lines = markdown.trim().split('\n')
  if (lines.length < 3) return []

  // Get headers
  const headers = lines[1].split('|').map(h => h.trim()).filter(h => h)

  // Parse data rows
  const data = []
  for (let i = 2; i < lines.length; i++) {
    const row = lines[i].split('|').map(cell => cell.trim()).filter(cell => cell)
    if (row.length === headers.length) {
      const obj = {}
      headers.forEach((header, idx) => {
        obj[header.toLowerCase().replace(/ /g, '_')] = row[idx]
      })
      data.push(obj)
    }
  }

  return data
}

// Load Active Ventures from Obsidian vault
export function loadActiveVentures() {
  const venturesPath = path.join(VAULT_PATH, 'Stackz', 'Ventures', 'Active Ventures.md')

  try {
    if (!fs.existsSync(venturesPath)) {
      console.warn('Active Ventures file not found:', venturesPath)
      return { active: [], recentlyEvaluated: [], killed: [] }
    }

    const content = fs.readFileSync(venturesPath, 'utf-8')

    // Parse Active Ventures section
    const activeMatch = content.match(/## Active Ventures[\s\S]*?\|[^|]+\|([^|]+)\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|/)
    const activeSection = activeMatch ? content.substring(content.indexOf('## Active Ventures'), content.indexOf('## Recently Evaluated')) : ''

    // Parse Recently Evaluated section
    const recentMatch = content.match(/## Recently Evaluated[\s\S]*?\|[^|]+\|([^|]+)\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|/)
    const recentSection = recentMatch ? content.substring(content.indexOf('## Recently Evaluated'), content.indexOf('## Killed')) : ''

    // Parse Killed section
    const killedMatch = content.match(/## Killed[\s\S]*?\|[^|]+\|([^|]+)\|[^|]+\|[^|]+\|[^|]+\|/)
    const killedSection = killedMatch ? content.substring(content.indexOf('## Killed'), content.indexOf('## Competitor')) : ''

    const active = parseMarkdownTable(activeSection)
    const recentlyEvaluated = parseMarkdownTable(recentSection)
    const killed = parseMarkdownTable(killedSection)

    return { active, recentlyEvaluated, killed }
  } catch (error) {
    console.error('Error loading Active Ventures:', error)
    return { active: [], recentlyEvaluated: [], killed: [] }
  }
}

// Load full idea evaluation from venture file
export function loadVentureDetails(ideaId) {
  // Convert idea_2026_0310_agentic_clothing to idea_2026_0310_agentic_clothing.md
  const filename = `${ideaId}.md`
  const venturePath = path.join(VAULT_PATH, 'Stackz', 'Ventures', filename)

  try {
    if (!fs.existsSync(venturePath)) {
      // Try Sessions folder
      const sessionPath = path.join(VAULT_PATH, 'Radar', 'Sessions', filename)
      if (fs.existsSync(sessionPath)) {
        return fs.readFileSync(sessionPath, 'utf-8')
      }
      return null
    }

    return fs.readFileSync(venturePath, 'utf-8')
  } catch (error) {
    console.error('Error loading venture details:', error)
    return null
  }
}

// Load ideas from Radar Sessions
export function loadRadarSessions() {
  const sessionsPath = path.join(VAULT_PATH, 'Radar', 'Sessions')

  try {
    if (!fs.existsSync(sessionsPath)) {
      return []
    }

    const files = fs.readdirSync(sessionsPath).filter(f => f.endsWith('.md'))
    const sessions = []

    for (const file of files) {
      const content = fs.readFileSync(path.join(sessionsPath, file), 'utf-8')
      sessions.push({
        id: file.replace('.md', ''),
        name: file.replace('.md', '').replace(/_/g, ' '),
        content,
        // Extract key info from content
        dateMatch: content.match(/Date:\s*(.*)/),
        statusMatch: content.match(/Status:\s*(APPROVED|REJECTED|TABLED)/i),
      })
    }

    return sessions.sort((a, b) => b.id.localeCompare(a.id))
  } catch (error) {
    console.error('Error loading Radar Sessions:', error)
    return []
  }
}

// Convert ventures data to approval format
export function venturesToApprovals(ventures) {
  const approvals = []

  for (const venture of ventures) {
    if (venture.idea_id) {
      approvals.push({
        id: venture.idea_id,
        title: venture.name || venture.idea_id,
        description: `Score: ${venture.score}/10 | Verdict: ${venture.verdict} | ${venture.notes || ''}`,
        status: venture.verdict?.toLowerCase() === 'approved' ? 'pending' : 'rejected',
        team: 'startup',
        agentId: 'radar',
        riskLevel: 'medium',
        estimatedImpact: 'TBD',
        cost: 'TBD',
        confidence: parseInt(venture.score) * 10 || 75,
        createdAt: venture.date ? new Date(venture.date).toISOString() : new Date().toISOString(),
      })
    }
  }

  return approvals
}