const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

// Obsidian vault path
const OBSIDIAN_VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH || '/Users/jaleeljenkins/Documents/Agency HQ'

// Helper: parse frontmatter
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
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }
    frontmatter[key] = value
  }

  return frontmatter
}

// GET /api/vault/recent - Recently modified files (last 48h)
router.get('/recent', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    const cutoff = Date.now() - (48 * 60 * 60 * 1000) // 48 hours ago

    const recentFiles = []

    function scanDir(dir, basePath = '') {
      if (!fs.existsSync(dir)) return

      const items = fs.readdirSync(dir, { withFileTypes: true })

      for (const item of items) {
        if (item.name.startsWith('.')) continue

        const fullPath = path.join(dir, item.name)
        const relativePath = path.join(basePath, item.name)

        if (item.isDirectory()) {
          scanDir(fullPath, relativePath)
        } else if (item.name.endsWith('.md')) {
          const stat = fs.statSync(fullPath)
          if (stat.mtimeMs > cutoff) {
            // Try to determine which agent last modified this
            const content = fs.readFileSync(fullPath, 'utf-8').slice(0, 500)
            const frontmatter = parseFrontmatter(content)

            let agent = frontmatter.agent || frontmatter.author || null

            // Check for agent signatures in content
            if (!agent) {
              if (content.includes('**Stackz**') || content.includes('**stackz**')) {
                agent = 'stackz'
              } else if (content.includes('**Smoke**') || content.includes('**smoke**')) {
                agent = 'smoke'
              } else if (content.includes('**Cashflow**') || content.includes('**cashflow**')) {
                agent = 'cashflow'
              } else if (content.includes('**Forge**') || content.includes('**forge**')) {
                agent = 'forge'
              }
            }

            recentFiles.push({
              title: frontmatter.title || item.name.replace('.md', ''),
              path: relativePath.replace('.md', ''),
              modified_at: stat.mtime.toISOString(),
              agent,
              obsidian_link: `obsidian://open?vault=Agency%20HQ&file=${encodeURIComponent(relativePath.replace('.md', ''))}`,
            })
          }
        }
      }
    }

    scanDir(OBSIDIAN_VAULT_PATH)

    // Sort by modified date, newest first
    recentFiles.sort((a, b) => new Date(b.modified_at) - new Date(a.modified_at))

    res.json(recentFiles.slice(0, limit))
  } catch (error) {
    console.error('Error getting recent files:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/vault/folder - List folder contents
router.get('/folder', (req, res) => {
  try {
    const folderPath = req.query.path || ''
    const dir = path.join(OBSIDIAN_VAULT_PATH, folderPath)

    if (!fs.existsSync(dir)) {
      return res.status(404).json({ error: 'Folder not found' })
    }

    const items = fs.readdirSync(dir, { withFileTypes: true })
    const result = []

    for (const item of items) {
      if (item.name.startsWith('.')) continue

      const itemPath = path.join(dir, item.name)
      const relativePath = path.join(folderPath, item.name)
      const stat = fs.statSync(itemPath)

      result.push({
        name: item.name,
        path: relativePath,
        type: item.isDirectory() ? 'folder' : 'file',
        modified: stat.mtime.toISOString(),
        size: stat.size,
      })
    }

    // Sort: folders first, then files, alphabetically
    result.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
      return a.name.localeCompare(b.name)
    })

    res.json(result)
  } catch (error) {
    console.error('Error listing folder:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/vault/file - Read file contents
router.get('/file', (req, res) => {
  try {
    const filePath = req.query.path
    if (!filePath) {
      return res.status(400).json({ error: 'path is required' })
    }

    const fullPath = path.join(OBSIDIAN_VAULT_PATH, `${filePath}.md`)

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    const content = fs.readFileSync(fullPath, 'utf-8')
    const frontmatter = parseFrontmatter(content)

    // Parse markdown content (simple version)
    const body = content.replace(/^---[\s\S]*?---\n*/, '')

    res.json({
      path: filePath,
      frontmatter,
      content: body,
      raw: content,
      obsidian_link: `obsidian://open?vault=Agency%20HQ&file=${encodeURIComponent(filePath)}`,
    })
  } catch (error) {
    console.error('Error reading file:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/vault/search - Search vault
router.get('/search', (req, res) => {
  try {
    const query = req.query.q
    if (!query) {
      return res.status(400).json({ error: 'q (query) is required' })
    }

    const results = []
    const queryLower = query.toLowerCase()

    function searchDir(dir, depth = 0) {
      if (depth > 5) return // Limit depth to prevent too deep recursion
      if (!fs.existsSync(dir)) return

      const items = fs.readdirSync(dir, { withFileTypes: true })

      for (const item of items) {
        if (item.name.startsWith('.')) continue
        if (item.name === 'node_modules') continue

        const fullPath = path.join(dir, item.name)

        if (item.isDirectory()) {
          searchDir(fullPath, depth + 1)
        } else if (item.name.endsWith('.md')) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8')
            const contentLower = content.toLowerCase()

            if (contentLower.includes(queryLower)) {
              const relativePath = path.relative(OBSIDIAN_VAULT_PATH, fullPath).replace('.md', '')
              const frontmatter = parseFrontmatter(content)

              // Extract excerpt around the match
              const idx = contentLower.indexOf(queryLower)
              const start = Math.max(0, idx - 50)
              const end = Math.min(content.length, idx + query.length + 50)
              let excerpt = content.slice(start, end).replace(/\n/g, ' ')

              if (start > 0) excerpt = '...' + excerpt
              if (end < content.length) excerpt = excerpt + '...'

              results.push({
                title: frontmatter.title || item.name.replace('.md', ''),
                path: relativePath,
                excerpt,
                obsidian_link: `obsidian://open?vault=Agency%20HQ&file=${encodeURIComponent(relativePath)}`,
              })
            }
          } catch (e) {
            // Skip files that can't be read
          }
        }
      }
    }

    searchDir(OBSIDIAN_VAULT_PATH)

    // Limit results
    res.json(results.slice(0, 50))
  } catch (error) {
    console.error('Error searching vault:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/vault/tree - Get folder tree structure
router.get('/tree', (req, res) => {
  try {
    const result = []

    function buildTree(dir, basePath = '', depth = 0) {
      if (depth > 4) return // Limit depth
      if (!fs.existsSync(dir)) return

      const items = fs.readdirSync(dir, { withFileTypes: true })
        .filter(i => !i.name.startsWith('.'))

      for (const item of items) {
        const itemPath = path.join(dir, item.name)
        const relativePath = path.join(basePath, item.name)

        if (item.isDirectory()) {
          const children = []
          buildTree(itemPath, relativePath, depth + 1).forEach(c => children.push(c))
          result.push({
            name: item.name,
            path: relativePath,
            type: 'folder',
            children,
          })
        } else if (item.name.endsWith('.md')) {
          result.push({
            name: item.name.replace('.md', ''),
            path: relativePath.replace('.md', ''),
            type: 'file',
          })
        }
      }

      return result
    }

    buildTree(OBSIDIAN_VAULT_PATH)
    res.json(result)
  } catch (error) {
    console.error('Error getting vault tree:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router