const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

// Obsidian vault paths
const OBSIDIAN_VAULT_PATH = '/Users/jaleeljenkins/Documents/Agents'
const ZETTELKASTEN_BASE = path.join(OBSIDIAN_VAULT_PATH, 'Agency HQ/Zettelkasten')

// Helper: scan a directory for notes with frontmatter (optimized version)
function scanNotes(dir, typeFilter = null, options = {}) {
  const notes = []
  const { limit = 0, batch = false, batchSize = 100 } = options

  if (!fs.existsSync(dir)) {
    return notes
  }

  function walk(directory, currentBatch = []) {
    const files = fs.readdirSync(directory)
    let batchCount = 0

    for (const file of files) {
      if (limit > 0 && notes.length >= limit) break

      if (!file.endsWith('.md')) continue

      const filePath = path.join(directory, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        walk(filePath, currentBatch)
        continue
      }

      try {
        // For performance, only read frontmatter initially
        const content = fs.readFileSync(filePath, 'utf-8')
        const frontmatter = parseFrontmatter(content)

        if (typeFilter && frontmatter.type !== typeFilter) {
          continue
        }

        const relativePath = path.relative(ZETTELKASTEN_BASE, filePath)

        // Extract title (first heading or filename)
        const titleMatch = content.match(/^##?\s+(.+)$/m)
        const title = titleMatch ? titleMatch[1] : file.replace('.md', '')

        const note = {
          path: relativePath,
          obsidianPath: filePath,
          filename: file,
          title,
          type: frontmatter.type || 'unknown',
          agent: frontmatter.agent || 'unknown',
          tags: frontmatter.tags || [],
          created_at: frontmatter.created_at || frontmatter.captured_at || stat.mtime.toISOString(),
          frontmatter
        }

        // Only do expensive link counting when needed
        if (!batch || batchCount < batchSize) {
          // Count outbound links only when necessary
          const linkMatches = content.match(/\[\[ZK-[^\]]+\]\]/g) || []
          note.link_count = linkMatches.length
          note.outbound_links = [...new Set(linkMatches.map(m => m.replace(/[\[\]]/g, '')))]

          if (batch) {
            currentBatch.push(note)
            batchCount++

            if (batchCount >= batchSize) {
              notes.push(...currentBatch)
              currentBatch.length = 0
              batchCount = 0
            }
          } else {
            notes.push(note)
          }
        } else {
          notes.push(note)
        }
      } catch (e) {
        // Skip malformed files
        console.warn(`Skipping malformed file: ${filePath}`, e.message)
      }
    }

    // Add remaining batch items
    if (batch && currentBatch.length > 0) {
      notes.push(...currentBatch)
    }
  }

  walk(dir, [])
  return notes
}

// Helper: scan directory for file paths only (for performance)
function scanPaths(dir, typeFilter = null, limit = 0) {
  const paths = []

  if (!fs.existsSync(dir)) {
    return paths
  }

  function walk(directory) {
    if (limit > 0 && paths.length >= limit) return

    const files = fs.readdirSync(directory)

    for (const file of files) {
      if (limit > 0 && paths.length >= limit) break

      if (!file.endsWith('.md')) continue

      const filePath = path.join(directory, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        walk(filePath)
        continue
      }

      try {
        // Just check the file for filtering, don't read content yet
        if (typeFilter) {
          const content = fs.readFileSync(filePath, 'utf-8')
          const frontmatter = parseFrontmatter(content)
          if (frontmatter.type !== typeFilter) {
            continue
          }
        }

        paths.push(filePath)
      } catch (e) {
        // Skip malformed files
        console.warn(`Skipping malformed file during path scan: ${filePath}`, e.message)
      }
    }
  }

  walk(dir)
  return paths
}

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

// GET /api/zettelkasten/stats - Returns total notes, weekly additions, most connected note, newest note, emerging cluster
router.get('/stats', (req, res) => {
  try {
    const permanentDir = path.join(ZETTELKASTEN_BASE, 'Permanent')
    const fleetingDir = path.join(ZETTELKASTEN_BASE, 'Fleeting')
    const literatureDir = path.join(ZETTELKASTEN_BASE, 'Literature')
    const indexDir = path.join(ZETTELKASTEN_BASE, 'Index')

    const permanentNotes = scanNotes(permanentDir, 'permanent')
    const fleetingNotes = scanNotes(fleetingDir, 'fleeting')
    const literatureNotes = scanNotes(literatureDir, 'literature')
    const mocs = scanNotes(indexDir, 'index')

    // Calculate notes added this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const notesThisWeek = permanentNotes.filter(n => new Date(n.created_at) >= oneWeekAgo)

    // Find most connected note (by inbound links - we need to scan for this)
    const linkCounts = {}
    for (const note of permanentNotes) {
      for (const link of note.outbound_links) {
        linkCounts[link] = (linkCounts[link] || 0) + 1
      }
    }

    let mostConnectedNote = null
    let maxLinks = 0

    for (const note of permanentNotes) {
      // Count inbound links (notes that link TO this note)
      const inboundCount = Object.entries(linkCounts).filter(([_, count]) => count > 0).length
      if (inboundCount > maxLinks) {
        maxLinks = inboundCount
        mostConnectedNote = {
          id: note.frontmatter?.id || note.filename,
          title: note.title,
          link_count: inboundCount
        }
      }
    }

    // Find newest note
    const sortedByDate = [...permanentNotes].sort((a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
    )
    const newestNote = sortedByDate[0] ? {
      id: sortedByDate[0].frontmatter?.id || sortedByDate[0].filename,
      agent: sortedByDate[0].agent,
      title: sortedByDate[0].title,
      created_at: sortedByDate[0].created_at,
      obsidian_link: `obsidian://open?vault=Agents&file=${encodeURIComponent(sortedByDate[0].path)}`
    } : null

    // Find emerging cluster (tag with highest velocity this week)
    const tagCounts = {}
    for (const note of notesThisWeek) {
      for (const tag of note.tags) {
        if (Array.isArray(tag)) {
          tag.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1)
        } else {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        }
      }
    }

    let emergingCluster = null
    let maxTagCount = 0

    for (const [tag, count] of Object.entries(tagCounts)) {
      if (count > maxTagCount) {
        maxTagCount = count
        emergingCluster = { tag, note_count: count }
      }
    }

    res.json({
      total_permanent_notes: permanentNotes.length,
      total_literature_notes: literatureNotes.length,
      total_fleeting_pending: fleetingNotes.length,
      total_mocs: mocs.length,
      notes_added_this_week: notesThisWeek.length,
      most_connected_note: mostConnectedNote,
      newest_note: newestNote,
      emerging_cluster: emergingCluster
    })

  } catch (error) {
    console.error('Zettelkasten stats error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/zettelkasten/recent?limit=10 - Returns recent permanent notes
router.get('/recent', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    const permanentDir = path.join(ZETTELKASTEN_BASE, 'Permanent')
    const notes = scanNotes(permanentDir, 'permanent')

    // Sort by created_at descending
    const sorted = notes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    const recent = sorted.slice(0, limit).map(n => ({
      id: n.frontmatter?.id || n.filename,
      agent: n.agent,
      title: n.title,
      tags: n.tags,
      link_count: n.link_count,
      created_at: n.created_at,
      obsidian_link: `obsidian://open?vault=Agents&file=${encodeURIComponent(n.path)}`
    }))

    res.json({ notes: recent })

  } catch (error) {
    console.error('Zettelkasten recent error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/zettelkasten/search?q=<query> - Search permanent notes
router.get('/search', (req, res) => {
  try {
    const query = (req.query.q || '').toLowerCase()

    if (!query) {
      return res.status(400).json({ error: 'Query parameter q is required' })
    }

    const permanentDir = path.join(ZETTELKASTEN_BASE, 'Permanent')
    const notes = scanNotes(permanentDir)

    // Filter by query in title, tags, or content
    const matching = notes.filter(n => {
      const titleMatch = n.title.toLowerCase().includes(query)
      const tagMatch = n.tags.some(t =>
        (Array.isArray(t) ? t : [t]).some(t => t.toLowerCase().includes(query))
      )
      const agentMatch = n.agent.toLowerCase().includes(query)

      return titleMatch || tagMatch || agentMatch
    })

    const results = matching.map(n => ({
      id: n.frontmatter?.id || n.filename,
      agent: n.agent,
      title: n.title,
      type: n.type,
      tags: n.tags,
      link_count: n.link_count,
      created_at: n.created_at,
      obsidian_link: `obsidian://open?vault=Agents&file=${encodeURIComponent(n.path)}`
    }))

    res.json({ query, count: results.length, results })

  } catch (error) {
    console.error('Zettelkasten search error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/zettelkasten/note/:id - Returns full note by ZK-ID
router.get('/note/:id', (req, res) => {
  try {
    const { id } = req.params
    const permanentDir = path.join(ZETTELKASTEN_BASE, 'Permanent')

    // Search for the note
    const notes = scanNotes(permanentDir)
    const note = notes.find(n =>
      n.filename.includes(id) ||
      n.frontmatter?.id === id
    )

    if (!note) {
      return res.status(404).json({ error: 'Note not found' })
    }

    // Read full content
    const content = fs.readFileSync(note.obsidianPath, 'utf-8')

    res.json({
      id: note.frontmatter?.id || note.filename,
      path: note.path,
      title: note.title,
      type: note.type,
      agent: note.agent,
      team: note.frontmatter?.team,
      tags: note.tags,
      created_at: note.created_at,
      last_refined_at: note.frontmatter?.last_refined_at,
      linked_notes: note.frontmatter?.linked_notes || [],
      status: note.frontmatter?.status || 'active',
      content,
      obsidian_link: `obsidian://open?vault=Agents&file=${encodeURIComponent(note.path)}`
    })

  } catch (error) {
    console.error('Zettelkasten note error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/zettelkasten/mocs - Returns all MOC index notes
router.get('/mocs', (req, res) => {
  try {
    const indexDir = path.join(ZETTELKASTEN_BASE, 'Index')

    if (!fs.existsSync(indexDir)) {
      return res.json({ mocs: [] })
    }

    const mocs = scanNotes(indexDir, 'index')

    const result = mocs.map(m => ({
      id: m.filename.replace('.md', ''),
      theme: m.frontmatter?.theme || m.title,
      maturity: m.frontmatter?.maturity || 'emerging',
      note_count: m.frontmatter?.note_count || 0,
      created_by: m.frontmatter?.created_by || m.agent,
      created_at: m.frontmatter?.created_at,
      last_updated: m.frontmatter?.last_updated,
      obsidian_link: `obsidian://open?vault=Agents&file=${encodeURIComponent(m.path)}`
    }))

    res.json({ mocs: result })

  } catch (error) {
    console.error('Zettelkasten MOCs error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/zettelkasten/weekly-digest - Returns current weekly digest
router.get('/weekly-digest', (req, res) => {
  try {
    const indexDir = path.join(ZETTELKASTEN_BASE, '_index')
    const digestPath = path.join(indexDir, 'weekly-digest.md')

    if (!fs.existsSync(digestPath)) {
      return res.json({ digest: null, message: 'No weekly digest available yet' })
    }

    const content = fs.readFileSync(digestPath, 'utf-8')
    const stats = fs.statSync(digestPath)

    res.json({
      content,
      last_updated: stats.mtime.toISOString(),
      obsidian_link: `obsidian://open?vault=Agents&file=Agency%20HQ/Zettelkasten/_index/weekly-digest.md`
    })

  } catch (error) {
    console.error('Zettelkasten weekly digest error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/zettelkasten/agents - Returns agent contribution stats
router.get('/agents', (req, res) => {
  try {
    const permanentDir = path.join(ZETTELKASTEN_BASE, 'Permanent')
    const literatureDir = path.join(ZETTELKASTEN_BASE, 'Literature')

    const permanentNotes = scanNotes(permanentDir, 'permanent')
    const literatureNotes = scanNotes(literatureDir, 'literature')

    // Count by agent
    const agentStats = {}

    for (const note of [...permanentNotes, ...literatureNotes]) {
      const agent = note.agent || 'unknown'
      if (!agentStats[agent]) {
        agentStats[agent] = {
          permanent_notes: 0,
          literature_notes: 0,
          total: 0
        }
      }

      if (note.type === 'permanent') {
        agentStats[agent].permanent_notes++
      } else if (note.type === 'literature') {
        agentStats[agent].literature_notes++
      }
      agentStats[agent].total++
    }

    res.json({ agents: agentStats })

  } catch (error) {
    console.error('Zettelkasten agents error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/zettelkasten/fleeting - Create a fleeting note
router.post('/fleeting', (req, res) => {
  try {
    const { agent, team, content, context } = req.body

    if (!agent || !content) {
      return res.status(400).json({ error: 'agent and content are required' })
    }

    const now = new Date()
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours

    const slug = content.slice(0, 30).toLowerCase().replace(/[^a-z0-9]/g, '-')
    const filename = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}-${String(now.getMinutes()).padStart(2,'0')}-${agent}-${slug}.md`

    const fleetingDir = path.join(ZETTELKASTEN_BASE, 'Fleeting', agent)
    if (!fs.existsSync(fleetingDir)) {
      fs.mkdirSync(fleetingDir, { recursive: true })
    }

    const frontmatter = `---
type: fleeting
agent: ${agent}
team: ${team || 'unknown'}
captured_at: ${now.toISOString()}
expires_at: ${expiresAt.toISOString()}
status: raw
promote_to: pending
context: ${context || ''}
---

${content}`

    const filePath = path.join(fleetingDir, filename)
    fs.writeFileSync(filePath, frontmatter)

    res.json({
      success: true,
      path: `Fleeting/${agent}/${filename}`,
      obsidian_link: `obsidian://open?vault=Agents&file=${encodeURIComponent('Agency HQ/Zettelkasten/Fleeting/' + agent + '/' + filename)}`
    })

  } catch (error) {
    console.error('Zettelkasten fleeting error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/zettelkasten/fleeting - List pending fleeting notes
router.get('/fleeting', (req, res) => {
  try {
    const fleetingDir = path.join(ZETTELKASTEN_BASE, 'Fleeting')
    const notes = scanNotes(fleetingDir, 'fleeting')

    res.json({ fleeting_notes: notes })

  } catch (error) {
    console.error('Zettelkasten fleeting list error:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/zettelkasten/fleeting/:path - Delete a fleeting note
router.delete('/fleeting/*', (req, res) => {
  try {
    // Get the path after /fleeting/
    const notePath = req.params[0]
    const fullPath = path.join(ZETTELKASTEN_BASE, 'Fleeting', notePath)

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Note not found' })
    }

    fs.unlinkSync(fullPath)

    res.json({ success: true, deleted: notePath })

  } catch (error) {
    console.error('Zettelkasten delete error:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router