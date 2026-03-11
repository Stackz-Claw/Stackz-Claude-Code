/**
 * PinchTab Browser API Routes
 * HTTP API-based browser automation using Chrome DevTools Protocol
 */

const express = require('express')
const router = express.Router()
const pinchTabAgent = require('../services/pinchTabAgent')

// GET /api/browser/status - Check PinchTab availability and sessions
router.get('/status', async (req, res) => {
  try {
    const available = await pinchTabAgent.isAvailable()
    const sessions = pinchTabAgent.listInstances()

    res.json({
      installed: available,
      engine: 'pinchtab',
      sessions: sessions.map(s => ({
        instanceId: s.instanceId,
        profile: s.profile,
        headless: s.headless,
        isOpen: s.tabs?.length > 0,
        tabs: s.tabs?.length || 0,
        created: s.created
      }))
    })
  } catch (error) {
    console.error('[PinchTab] Status error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/launch - Launch a new browser instance
router.post('/launch', async (req, res) => {
  try {
    const { profile, headless } = req.body

    if (!(await pinchTabAgent.isAvailable())) {
      return res.status(503).json({
        error: 'PinchTab not available',
        install: 'Run: npx pinchtab (or curl -fsSL https://pinchtab.com/install.sh | bash)'
      })
    }

    const session = await pinchTabAgent.launchInstance(profile, headless !== false)
    res.status(201).json(session)
  } catch (error) {
    console.error('[PinchTab] Launch error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/nav - Navigate to URL
router.post('/nav', async (req, res) => {
  try {
    const { instanceId, url } = req.body

    if (!url) {
      return res.status(400).json({ error: 'url is required' })
    }

    let actualInstanceId = instanceId

    // Create instance if not provided
    if (!actualInstanceId) {
      const session = await pinchTabAgent.launchInstance()
      actualInstanceId = session.instanceId
    }

    const result = await pinchTabAgent.openTab(actualInstanceId, url)
    pinchTabAgent.logToTimeline('navigated', { url, instanceId: actualInstanceId })
    res.json(result)
  } catch (error) {
    console.error('[PinchTab] Nav error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/snapshot - Get accessibility snapshot
router.post('/snapshot', async (req, res) => {
  try {
    const { instanceId, tabId } = req.body

    const result = await pinchTabAgent.getSnapshot(instanceId, tabId)
    res.json(result)
  } catch (error) {
    console.error('[PinchTab] Snapshot error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/text - Get text content
router.post('/text', async (req, res) => {
  try {
    const { instanceId, tabId } = req.body

    const result = await pinchTabAgent.getText(instanceId, tabId)
    res.json(result)
  } catch (error) {
    console.error('[PinchTab] Text error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/click - Click element
router.post('/click', async (req, res) => {
  try {
    const { instanceId, selector, tabId } = req.body

    if (!selector) {
      return res.status(400).json({ error: 'selector is required' })
    }

    const result = await pinchTabAgent.click(instanceId, selector, tabId)
    pinchTabAgent.logToTimeline('clicked', { selector, instanceId })
    res.json(result)
  } catch (error) {
    console.error('[PinchTab] Click error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/fill - Fill input
router.post('/fill', async (req, res) => {
  try {
    const { instanceId, selector, value, tabId } = req.body

    if (!selector || value === undefined) {
      return res.status(400).json({ error: 'selector and value are required' })
    }

    const result = await pinchTabAgent.fill(instanceId, selector, value, tabId)
    pinchTabAgent.logToTimeline('filled', { selector, instanceId })
    res.json(result)
  } catch (error) {
    console.error('[PinchTab] Fill error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/type - Type text
router.post('/type', async (req, res) => {
  try {
    const { instanceId, text, tabId } = req.body

    if (!text) {
      return res.status(400).json({ error: 'text is required' })
    }

    const result = await pinchTabAgent.type(instanceId, text, tabId)
    res.json(result)
  } catch (error) {
    console.error('[PinchTab] Type error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/press - Press key
router.post('/press', async (req, res) => {
  try {
    const { instanceId, key, tabId } = req.body

    if (!key) {
      return res.status(400).json({ error: 'key is required' })
    }

    const result = await pinchTabAgent.press(instanceId, key, tabId)
    res.json(result)
  } catch (error) {
    console.error('[PinchTab] Press error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/scroll - Scroll
router.post('/scroll', async (req, res) => {
  try {
    const { instanceId, direction, amount, tabId } = req.body

    const result = await pinchTabAgent.scroll(
      instanceId,
      direction || 'down',
      amount || 500,
      tabId
    )
    res.json(result)
  } catch (error) {
    console.error('[PinchTab] Scroll error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/navigate - Back/Forward
router.post('/navigate', async (req, res) => {
  try {
    const { instanceId, direction, tabId } = req.body

    const result = await pinchTabAgent.navigate(instanceId, direction, tabId)
    res.json(result)
  } catch (error) {
    console.error('[PinchTab] Navigate error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/screenshot - Take screenshot
router.post('/screenshot', async (req, res) => {
  try {
    const { instanceId, tabId } = req.body

    const result = await pinchTabAgent.screenshot(instanceId, tabId)
    pinchTabAgent.logToTimeline('screenshot', { instanceId })
    res.json(result)
  } catch (error) {
    console.error('[PinchTab] Screenshot error:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/browser/tab/:tabId - Close tab
router.delete('/tab/:tabId', async (req, res) => {
  try {
    const { instanceId } = req.query
    const { tabId } = req.params

    const result = await pinchTabAgent.closeTab(instanceId, tabId)
    res.json(result)
  } catch (error) {
    console.error('[PinchTab] Close tab error:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/browser/instance/:instanceId - Close instance
router.delete('/instance/:instanceId', async (req, res) => {
  try {
    const { instanceId } = req.params

    const result = await pinchTabAgent.closeInstance(instanceId)
    pinchTabAgent.logToTimeline('closed_instance', { instanceId })
    res.json(result)
  } catch (error) {
    console.error('[PinchTab] Close instance error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/browser/execute - Execute multi-step task
router.post('/execute', async (req, res) => {
  try {
    const { instanceId, steps } = req.body

    if (!steps || !Array.isArray(steps)) {
      return res.status(400).json({ error: 'steps array is required' })
    }

    const actualInstanceId = instanceId || 'task'

    // Initialize instance if needed
    if (!pinchTabAgent.getInstance(actualInstanceId)) {
      await pinchTabAgent.launchInstance(actualInstanceId)
    }

    const results = await pinchTabAgent.executeTask(actualInstanceId, steps)
    pinchTabAgent.logToTimeline('executed_task', { steps: steps.length, instanceId: actualInstanceId })

    res.json({
      instanceId: actualInstanceId,
      completed: results.filter(r => r.success).length,
      total: results.length,
      results
    })
  } catch (error) {
    console.error('[PinchTab] Execute error:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router