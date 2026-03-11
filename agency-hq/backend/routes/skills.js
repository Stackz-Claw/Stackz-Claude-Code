const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { getDb } = require('../db/database')
const { runParallelEval, determineWinner } = require('../services/claudeEval')

// Paths
const AGENT_SKILLS_DIR = path.join(__dirname, '../../.agent/skills')
const OBSIDIAN_VAULT_PATH = '/Users/jaleeljenkins/Documents/Agents'

/**
 * Load skill content from .agent/skills/<skillPath>/SKILL.md
 * Also extracts agent tags from the YAML frontmatter
 */
function loadSkill(skillPath) {
  const skillFile = path.join(AGENT_SKILLS_DIR, skillPath, 'SKILL.md')

  if (!fs.existsSync(skillFile)) {
    throw new Error(`Skill not found: ${skillPath}`)
  }

  const content = fs.readFileSync(skillFile, 'utf-8')

  // Parse YAML frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  let skillContent = content
  let agents = []

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1]
    skillContent = content.slice(frontmatterMatch[0].length).trim()

    // Extract agents array from frontmatter
    const agentsMatch = frontmatter.match(/agents:\s*\[(.*?)\]/)
    if (agentsMatch) {
      agents = agentsMatch[1].split(',').map(a => a.trim()).filter(Boolean)
    }
  }

  return { content: skillContent, agents }
}

/**
 * POST /api/skills/eval
 * Run a skill evaluation comparing with vs without skill
 */
router.post('/eval', async (req, res) => {
  try {
    const { skillPath, agentId, testPrompts } = req.body

    if (!skillPath || !testPrompts || !Array.isArray(testPrompts)) {
      return res.status(400).json({ error: 'skillPath and testPrompts array required' })
    }

    // Load skill content
    const { content: skillContext, agents: skillAgents } = loadSkill(skillPath)

    // If agentId provided, verify it's in the skill's agent list
    if (agentId && skillAgents.length > 0 && !skillAgents.includes(agentId)) {
      return res.status(400).json({
        error: `Agent ${agentId} not authorized for this skill`,
        authorizedAgents: skillAgents
      })
    }

    // Run evaluation for each prompt
    const results = []
    for (const prompt of testPrompts) {
      const { withSkill, withoutSkill } = await runParallelEval(prompt, skillContext)
      const winner = determineWinner(withSkill, withoutSkill)

      results.push({
        prompt,
        withSkill,
        withoutSkill,
        winner
      })
    }

    // Aggregate results
    const withSkillWins = results.filter(r => r.winner === 'with_skill').length
    const withoutSkillWins = results.filter(r => r.winner === 'without_skill').length
    const ties = results.filter(r => r.winner === 'tie').length
    const overallWinner = withSkillWins > withoutSkillWins ? 'with_skill' :
                          withoutSkillWins > withSkillWins ? 'without_skill' : 'tie'

    // Extract skill name from path
    const skillName = skillPath.split('/').pop()

    // Save to database
    const db = getDb()
    const stmt = db.prepare(`
      INSERT INTO skill_eval_results
      (agent_id, skill_name, with_skill_output, without_skill_output, winner, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    const notes = JSON.stringify({
      promptResults: results,
      summary: { withSkillWins, withoutSkillWins, ties }
    })

    const result = stmt.run(
      agentId || null,
      skillName,
      JSON.stringify(results.map(r => r.withSkill)),
      JSON.stringify(results.map(r => r.withoutSkill)),
      overallWinner,
      notes
    )

    res.json({
      evalId: result.lastInsertRowid,
      skillName,
      agentId,
      results,
      summary: {
        withSkillWins,
        withoutSkillWins,
        ties,
        winner: overallWinner
      }
    })

  } catch (error) {
    console.error('Skill eval error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/skills/eval/export-to-obsidian
 * Export evaluation results to Obsidian vault
 */
router.post('/eval/export-to-obsidian', async (req, res) => {
  try {
    const { evalId } = req.body

    if (!evalId) {
      return res.status(400).json({ error: 'evalId required' })
    }

    const db = getDb()
    const evalRecord = db.prepare('SELECT * FROM skill_eval_results WHERE id = ?').get(evalId)

    if (!evalRecord) {
      return res.status(404).json({ error: 'Eval not found' })
    }

    // Parse stored data
    const results = evalRecord.notes ? JSON.parse(evalRecord.notes) : null
    const promptResults = results?.promptResults || []

    // Format markdown
    const date = new Date(evalRecord.tested_at).toISOString().split('T')[0]
    const mdContent = `# Skill Eval: ${evalRecord.skill_name}

**Agent:** ${evalRecord.agent_id || 'N/A'}
**Date:** ${evalRecord.tested_at}
**Winner:** ${evalRecord.winner}

## Summary
- With Skill Wins: ${results?.summary?.withSkillWins || 0}
- Without Skill Wins: ${results?.summary?.withoutSkillWins || 0}
- Ties: ${results?.summary?.ties || 0}

## Prompt Results
${promptResults.map((r, i) => `### Prompt ${i + 1}

**Prompt:** ${r.prompt.slice(0, 100)}...

**With Skill:**
${r.withSkill.slice(0, 500)}...

**Without Skill:**
${r.withoutSkill.slice(0, 500)}...

**Winner:** ${r.winner}

---`).join('\n')}

## Notes
${evalRecord.notes || ''}
`

    // Write to Obsidian vault
    const agentFolder = evalRecord.agent_id || 'general'
    const obsidianPath = path.join(
      OBSIDIAN_VAULT_PATH,
      'Agency HQ/Skill Evals',
      agentFolder
    )

    // Create directory if it doesn't exist
    if (!fs.existsSync(obsidianPath)) {
      fs.mkdirSync(obsidianPath, { recursive: true })
    }

    const fileName = `${evalRecord.skill_name}-${date}.md`
    const filePath = path.join(obsidianPath, fileName)

    fs.writeFileSync(filePath, mdContent)

    // Update database with the note path
    db.prepare('UPDATE skill_eval_results SET obsidian_note_path = ? WHERE id = ?')
      .run(filePath, evalId)

    res.json({
      success: true,
      obsidianNotePath: filePath,
      evalId
    })

  } catch (error) {
    console.error('Export error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/skills/eval/history/:agentId
 * Get evaluation history for an agent
 */
router.get('/eval/history/:agentId', (req, res) => {
  try {
    const { agentId } = req.params

    const db = getDb()

    // Get eval records from database
    const dbRecords = db.prepare(`
      SELECT * FROM skill_eval_results
      WHERE agent_id = ?
      ORDER BY tested_at DESC
    `).all(agentId)

    // Also scan Obsidian vault for manual notes
    const vaultPath = path.join(OBSIDIAN_VAULT_PATH, 'Agency HQ/Skill Evals', agentId)
    let vaultNotes = []

    if (fs.existsSync(vaultPath)) {
      const files = fs.readdirSync(vaultPath).filter(f => f.endsWith('.md'))
      vaultNotes = files.map(file => {
        const filePath = path.join(vaultPath, file)
        const stats = fs.statSync(filePath)
        return {
          path: filePath,
          name: file,
          modifiedAt: stats.mtime.toISOString()
        }
      })
    }

    // Merge and format results
    const history = [
      ...dbRecords.map(r => ({
        id: r.id,
        skillName: r.skill_name,
        testedAt: r.tested_at,
        winner: r.winner,
        obsidianNotePath: r.obsidian_note_path,
        source: 'database'
      })),
      ...vaultNotes.map(n => ({
        path: n.path,
        skillName: n.name.replace('.md', ''),
        testedAt: n.modifiedAt,
        source: 'vault'
      }))
    ].sort((a, b) => new Date(b.testedAt) - new Date(a.testedAt))

    res.json({ agentId, history })

  } catch (error) {
    console.error('History error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/skills/list
 * List all available skills from .agent/skills/
 */
router.get('/list', (req, res) => {
  try {
    if (!fs.existsSync(AGENT_SKILLS_DIR)) {
      return res.json({ skills: [] })
    }

    const skillDirs = fs.readdirSync(AGENT_SKILLS_DIR).filter(f => {
      const stat = fs.statSync(path.join(AGENT_SKILLS_DIR, f))
      return stat.isDirectory()
    })

    const skills = skillDirs.map(dir => {
      const skillFile = path.join(AGENT_SKILLS_DIR, dir, 'SKILL.md')
      let agents = []
      let description = ''
      let name = dir

      if (fs.existsSync(skillFile)) {
        const content = fs.readFileSync(skillFile, 'utf-8')
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)

        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1]

          const nameMatch = frontmatter.match(/name:\s*(.+)/)
          if (nameMatch) name = nameMatch[1].trim()

          const descMatch = frontmatter.match(/description:\s*(.+)/)
          if (descMatch) description = descMatch[1].trim()

          const agentsMatch = frontmatter.match(/agents:\s*\[(.*?)\]/)
          if (agentsMatch) {
            agents = agentsMatch[1].split(',').map(a => a.trim()).filter(Boolean)
          }
        }
      }

      return { path: dir, name, description, agents }
    })

    res.json({ skills })

  } catch (error) {
    console.error('List skills error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/skills/eval/stats/:agentId
 * Get aggregate skill statistics for an agent
 */
router.get('/eval/stats/:agentId', (req, res) => {
  try {
    const { agentId } = req.params

    const db = getDb()
    const stats = db.prepare(`
      SELECT
        skill_name,
        COUNT(*) as eval_count,
        SUM(CASE WHEN winner = 'with_skill' THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN winner = 'without_skill' THEN 1 ELSE 0 END) as losses,
        SUM(CASE WHEN winner = 'tie' THEN 1 ELSE 0 END) as ties
      FROM skill_eval_results
      WHERE agent_id = ?
      GROUP BY skill_name
    `).all(agentId)

    const withStats = stats.map(s => ({
      skillName: s.skill_name,
      evalCount: s.eval_count,
      wins: s.wins,
      losses: s.losses,
      ties: s.ties,
      winRate: s.eval_count > 0 ? Math.round((s.wins / s.eval_count) * 100) : 0
    }))

    res.json({ agentId, skills: withStats })

  } catch (error) {
    console.error('Stats error:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router