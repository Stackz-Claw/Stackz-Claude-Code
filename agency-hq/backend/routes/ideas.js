const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

// Obsidian vault paths
const OBSIDIAN_VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH || '/Users/jaleeljenkins/Documents/Agency HQ'
const IDEAS_DIR = path.join(OBSIDIAN_VAULT_PATH, 'Ideas')

// Helper: parse frontmatter from markdown
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const frontmatter = {}
  const lines = match[1].split('\n')

  for (const line of lines) {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length) {
      let value = valueParts.join(':').trim()
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1)
      }
      frontmatter[key.trim()] = value
    }
  }

  return frontmatter
}

// Helper: extract last message from thread
function extractLastMessage(content) {
  const threadMatch = content.match(/##\s+Thread\s*\n([\s\S]*?)(?=\n##|\n---|\Z)/i)
  if (!threadMatch) return null

  const messages = threadMatch[1].split(/\n---\s*\n/)
  if (messages.length === 0) return null

  const lastMsg = messages[messages.length - 1].trim()
  const speakerMatch = lastMsg.match(/^\*\*(\w+)\*\*/)
  const speaker = speakerMatch ? speakerMatch[1] : 'Unknown'
  const preview = lastMsg.replace(/^\*\*\w+\*\*[—\s]*/, '').slice(0, 100)

  return { speaker, preview }
}

// GET /api/ideas - List all idea threads
router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(IDEAS_DIR)) {
      return res.json([])
    }

    const files = fs.readdirSync(IDEAS_DIR).filter(f => f.endsWith('.md'))
    const ideas = []

    for (const file of files) {
      const filePath = path.join(IDEAS_DIR, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const frontmatter = parseFrontmatter(content)

      // Skip completed/deferred ideas by default
      if (frontmatter.status === 'completed' || frontmatter.status === 'deferred') {
        continue
      }

      const lastMessage = extractLastMessage(content)
      const vaultPath = `Ideas/${file.replace('.md', '')}`

      ideas.push({
        id: file.replace('.md', ''),
        title: frontmatter.title || file.replace('.md', ''),
        status: frontmatter.status || 'open',
        priority: frontmatter.priority || 'normal',
        created_at: frontmatter.created || null,
        last_updated: frontmatter.last_updated || null,
        last_speaker: lastMessage?.speaker || null,
        last_message_preview: lastMessage?.preview || null,
        obsidian_link: `obsidian://open?vault=Agency%20HQ&file=${encodeURIComponent(vaultPath)}`,
        reply_needed_from_jaleel: frontmatter.reply_needed === 'true',
      })
    }

    // Sort by last_updated, newest first
    ideas.sort((a, b) => {
      if (!a.last_updated) return 1
      if (!b.last_updated) return -1
      return new Date(b.last_updated) - new Date(a.last_updated)
    })

    res.json(ideas)
  } catch (error) {
    console.error('Error listing ideas:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/ideas/:id - Get full idea content
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const filePath = path.join(IDEAS_DIR, `${id}.md`)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Idea not found' })
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    const frontmatter = parseFrontmatter(content)
    const vaultPath = `Ideas/${id}`

    // Extract the full thread
    const threadMatch = content.match(/##\s+Thread\s*\n([\s\S]*?)(?=\n##|\n---|\Z)/i)
    const thread = threadMatch ? threadMatch[1] : ''

    res.json({
      id,
      title: frontmatter.title || id,
      status: frontmatter.status || 'open',
      priority: frontmatter.priority || 'normal',
      created: frontmatter.created,
      last_updated: frontmatter.last_updated,
      content: content.replace(/^---[\s\S]*?---\n*/, ''),
      thread,
      obsidian_link: `obsidian://open?vault=Agency%20HQ&file=${encodeURIComponent(vaultPath)}`,
    })
  } catch (error) {
    console.error('Error getting idea:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/ideas/:id/reply - Add a reply to an idea thread
router.post('/:id/reply', (req, res) => {
  try {
    const { id } = req.params
    const { message, speaker = 'Jaleel' } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const filePath = path.join(IDEAS_DIR, `${id}.md`)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Idea not found' })
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    const timestamp = new Date().toISOString()
    const reply = `\n---\n**${speaker}** — ${timestamp}\n\n${message}\n`

    // Check if Thread section exists
    let newContent
    if (content.includes('## Thread')) {
      newContent = content.replace(
        /##\s+Thread\s*\n/,
        `## Thread\n${reply}`
      )
    } else {
      // Add Thread section before any trailing --- or end of file
      newContent = content.replace(
        /(\n---(\n|$)|\Z)/,
        `\n## Thread\n${reply}\n$1`
      )
    }

    // Update last_updated in frontmatter
    const frontmatterMatch = newContent.match(/^---\n([\s\S]*?)\n---/)
    if (frontmatterMatch) {
      let frontmatter = frontmatterMatch[1]
      if (!frontmatter.includes('last_updated:')) {
        frontmatter += `\nlast_updated: ${timestamp}`
        newContent = newContent.replace(frontmatterMatch[0], `---\n${frontmatter}\n---`)
      } else {
        newContent = newContent.replace(
          /last_updated:.*/,
          `last_updated: ${timestamp}`
        )
      }
    }

    fs.writeFileSync(filePath, newContent, 'utf-8')

    // Emit socket event
    const io = req.app.get('io')
    if (io) {
      io.emit('ideas:reply', {
        note_id: id,
        speaker,
        preview: message.slice(0, 100),
        timestamp,
      })
    }

    res.json({ success: true, timestamp })
  } catch (error) {
    console.error('Error replying to idea:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/ideas - Create a new idea
router.post('/', (req, res) => {
  try {
    const { title, message, speaker = 'Jaleel' } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const id = `${timestamp}-${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
    const filename = `${id}.md`

    const content = `---
title: ${title}
status: open
priority: normal
created: ${new Date().toISOString()}
last_updated: ${new Date().toISOString()}
reply_needed: false
---

# ${title}

## Thread
**${speaker}** — ${new Date().toISOString()}

${message || 'Starting a new idea thread.'}

`

    if (!fs.existsSync(IDEAS_DIR)) {
      fs.mkdirSync(IDEAS_DIR, { recursive: true })
    }

    fs.writeFileSync(path.join(IDEAS_DIR, filename), content, 'utf-8')

    const io = req.app.get('io')
    if (io) {
      io.emit('ideas:created', { id, title })
    }

    res.json({ success: true, id, title })
  } catch (error) {
    console.error('Error creating idea:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router