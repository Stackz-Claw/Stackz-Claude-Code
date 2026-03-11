/**
 * Browser Agent API Routes
 * REST API for controlling the headless browser
 */

const express = require('express')
const router = express.Router()
const browserAgent = require('../services/browserAgent')

// GET /api/browser/status - Check if browser is available
router.get('/status', (req, res) => {
  res.json({
    installed: browserAgent.isInstalled(),
    sessions: browserAgent.getAllSessions().map(s => ({
      sessionId: s.sessionId,
      agentId: s.agentId,
      isOpen: s.isOpen,
      currentUrl: s.currentUrl,
      created: s.created
    }))
  })
})

// POST /api/browser/session - Create a new browser session
router.post('/session', async (req, res) => {
  try {
    const { agentId, options } = req.body

    if (!agentId) {
      return res.status(400).json({ error: 'agentId is required' })
    }

    if (!browserAgent.isInstalled()) {
      return res.status(503).json({
        error: 'Browser not installed',
        install: 'Run: agent-browser install'
      })
    }

    const result = await browserAgent.initSession(agentId, options)
    res.status(201).json(result)
  } catch (error) {
    console.error('[BrowserAPI] Session error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/open - Open a URL
router.post('/open', async (req, res) => {
  try {
    const { sessionId, url } = req.body

    if (!url) {
      return res.status(400).json({ error: 'url is required' })
    }

    // Create session if not provided
    let actualSessionId = sessionId
    if (!actualSessionId) {
      const session = await browserAgent.initSession('api')
      actualSessionId = session.sessionId
    }

    const result = await browserAgent.open(actualSessionId, url)
    browserAgent.logToTimeline('opened', { url, sessionId: actualSessionId })
    res.json(result)
  } catch (error) {
    console.error('[BrowserAPI] Open error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/snapshot - Get accessibility snapshot
router.post('/snapshot', async (req, res) => {
  try {
    const { sessionId } = req.body
    const result = await browserAgent.snapshot(sessionId || 'default')
    res.json(result)
  } catch (error) {
    console.error('[BrowserAPI] Snapshot error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/click - Click an element
router.post('/click', async (req, res) => {
  try {
    const { sessionId, element } = req.body

    if (!element) {
      return res.status(400).json({ error: 'element reference is required' })
    }

    const result = await browserAgent.click(sessionId || 'default', element)
    browserAgent.logToTimeline('clicked', { element, sessionId })
    res.json(result)
  } catch (error) {
    console.error('[BrowserAPI] Click error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/fill - Fill an input
router.post('/fill', async (req, res) => {
  try {
    const { sessionId, element, value } = req.body

    if (!element || value === undefined) {
      return res.status(400).json({ error: 'element and value are required' })
    }

    const result = await browserAgent.fill(sessionId || 'default', element, value)
    browserAgent.logToTimeline('filled', { element, sessionId })
    res.json(result)
  } catch (error) {
    console.error('[BrowserAPI] Fill error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/type - Type text
router.post('/type', async (req, res) => {
  try {
    const { sessionId, text } = req.body

    if (!text) {
      return res.status(400).json({ error: 'text is required' })
    }

    const result = await browserAgent.type(sessionId || 'default', text)
    res.json(result)
  } catch (error) {
    console.error('[BrowserAPI] Type error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/press - Press a key
router.post('/press', async (req, res) => {
  try {
    const { sessionId, key } = req.body

    if (!key) {
      return res.status(400).json({ error: 'key is required' })
    }

    const result = await browserAgent.press(sessionId || 'default', key)
    res.json(result)
  } catch (error) {
    console.error('[BrowserAPI] Press error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/scroll - Scroll the page
router.post('/scroll', async (req, res) => {
  try {
    const { sessionId, direction, amount } = req.body

    const result = await browserAgent.scroll(
      sessionId || 'default',
      direction || 'down',
      amount || 300
    )
    res.json(result)
  } catch (error) {
    console.error('[BrowserAPI] Scroll error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/screenshot - Take a screenshot
router.post('/screenshot', async (req, res) => {
  try {
    const { sessionId, filename } = req.body

    const result = await browserAgent.screenshot(sessionId || 'default', filename)
    browserAgent.logToTimeline('screenshot', { sessionId })
    res.json(result)
  } catch (error) {
    console.error('[BrowserAPI] Screenshot error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/close - Close the browser
router.post('/close', async (req, res) => {
  try {
    const { sessionId } = req.body

    const result = await browserAgent.close(sessionId || 'default')
    browserAgent.logToTimeline('closed', { sessionId })
    res.json(result)
  } catch (error) {
    console.error('[BrowserAPI] Close error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/execute - Execute multi-step task
router.post('/execute', async (req, res) => {
  try {
    const { sessionId, steps } = req.body

    if (!steps || !Array.isArray(steps)) {
      return res.status(400).json({ error: 'steps array is required' })
    }

    const actualSessionId = sessionId || 'task'

    // Initialize session if needed
    if (!browserAgent.getSession(actualSessionId)) {
      await browserAgent.initSession('task')
    }

    const results = await browserAgent.executeTask(actualSessionId, steps)
    browserAgent.logToTimeline('executed_task', { steps: steps.length, sessionId: actualSessionId })

    res.json({
      sessionId: actualSessionId,
      completed: results.filter(r => r.success).length,
      total: results.length,
      results
    })
  } catch (error) {
    console.error('[BrowserAPI] Execute error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/browser/session/:id - Get session info
router.get('/session/:id', (req, res) => {
  const session = browserAgent.getSession(req.params.id)

  if (!session) {
    return res.status(404).json({ error: 'Session not found' })
  }

  res.json(session)
})

module.exports = router