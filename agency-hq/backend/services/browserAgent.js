/**
 * Browser Agent Service
 * Wrapper around agent-browser CLI for AI agent automation
 */

const { spawn, execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

// Browser session management
const sessions = new Map()

/**
 * Check if agent-browser is installed
 */
function isInstalled() {
  try {
    execSync('which agent-browser', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

/**
 * Initialize browser for an agent
 */
async function initSession(agentId, options = {}) {
  const sessionId = `session_${agentId}_${Date.now()}`

  sessions.set(sessionId, {
    agentId,
    created: new Date().toISOString(),
    isOpen: false,
    currentUrl: null,
    history: []
  })

  return { sessionId, status: 'ready' }
}

/**
 * Open a URL in the browser
 */
async function open(sessionId, url) {
  const session = sessions.get(sessionId)
  if (!session) {
    throw new Error('Session not found')
  }

  // Use the CLI to open URL
  try {
    execSync(`agent-browser open ${url}`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    })

    session.isOpen = true
    session.currentUrl = url
    session.history.push({ action: 'open', url, timestamp: new Date().toISOString() })

    return { success: true, url, sessionId }
  } catch (error) {
    console.error('[BrowserAgent] Open error:', error.message)
    throw new Error(`Failed to open ${url}: ${error.message}`)
  }
}

/**
 * Get accessibility snapshot
 */
async function snapshot(sessionId) {
  try {
    const output = execSync('agent-browser snapshot', {
      cwd: path.join(__dirname, '..'),
      encoding: 'utf-8'
    })

    return { snapshot: output, sessionId }
  } catch (error) {
    console.error('[BrowserAgent] Snapshot error:', error.message)
    throw new Error(`Failed to get snapshot: ${error.message}`)
  }
}

/**
 * Click on element by reference (e.g., @e2)
 */
async function click(sessionId, elementRef) {
  try {
    execSync(`agent-browser click ${elementRef}`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    })

    const session = sessions.get(sessionId)
    if (session) {
      session.history.push({ action: 'click', element: elementRef, timestamp: new Date().toISOString() })
    }

    return { success: true, action: 'click', element: elementRef, sessionId }
  } catch (error) {
    console.error('[BrowserAgent] Click error:', error.message)
    throw new Error(`Failed to click ${elementRef}: ${error.message}`)
  }
}

/**
 * Fill input field
 */
async function fill(sessionId, elementRef, value) {
  try {
    execSync(`agent-browser fill ${elementRef} "${value}"`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    })

    const session = sessions.get(sessionId)
    if (session) {
      session.history.push({ action: 'fill', element: elementRef, value, timestamp: new Date().toISOString() })
    }

    return { success: true, action: 'fill', element: elementRef, value, sessionId }
  } catch (error) {
    console.error('[BrowserAgent] Fill error:', error.message)
    throw new Error(`Failed to fill ${elementRef}: ${error.message}`)
  }
}

/**
 * Type text
 */
async function type(sessionId, text) {
  try {
    execSync(`agent-browser type "${text}"`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    })

    const session = sessions.get(sessionId)
    if (session) {
      session.history.push({ action: 'type', text, timestamp: new Date().toISOString() })
    }

    return { success: true, action: 'type', text, sessionId }
  } catch (error) {
    console.error('[BrowserAgent] Type error:', error.message)
    throw new Error(`Failed to type: ${error.message}`)
  }
}

/**
 * Press a key
 */
async function press(sessionId, key) {
  try {
    execSync(`agent-browser press ${key}`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    })

    const session = sessions.get(sessionId)
    if (session) {
      session.history.push({ action: 'press', key, timestamp: new Date().toISOString() })
    }

    return { success: true, action: 'press', key, sessionId }
  } catch (error) {
    console.error('[BrowserAgent] Press error:', error.message)
    throw new Error(`Failed to press ${key}: ${error.message}`)
  }
}

/**
 * Scroll the page
 */
async function scroll(sessionId, direction = 'down', amount = 300) {
  try {
    execSync(`agent-browser scroll ${direction} ${amount}`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    })

    const session = sessions.get(sessionId)
    if (session) {
      session.history.push({ action: 'scroll', direction, amount, timestamp: new Date().toISOString() })
    }

    return { success: true, action: 'scroll', direction, amount, sessionId }
  } catch (error) {
    console.error('[BrowserAgent] Scroll error:', error.message)
    throw new Error(`Failed to scroll: ${error.message}`)
  }
}

/**
 * Take a screenshot
 */
async function screenshot(sessionId, filename = null) {
  const outputPath = filename || `screenshot_${Date.now()}.png`

  try {
    execSync(`agent-browser screenshot ${outputPath}`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    })

    const fullPath = path.join(__dirname, '..', outputPath)

    // Read the screenshot
    const screenshot = fs.readFileSync(fullPath)
    const base64 = screenshot.toString('base64')

    // Clean up file
    fs.unlinkSync(fullPath)

    return { success: true, screenshot: base64, sessionId }
  } catch (error) {
    console.error('[BrowserAgent] Screenshot error:', error.message)
    throw new Error(`Failed to take screenshot: ${error.message}`)
  }
}

/**
 * Close the browser
 */
async function close(sessionId) {
  try {
    execSync('agent-browser close', {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    })

    const session = sessions.get(sessionId)
    if (session) {
      session.isOpen = false
      session.history.push({ action: 'close', timestamp: new Date().toISOString() })
    }

    return { success: true, sessionId }
  } catch (error) {
    console.error('[BrowserAgent] Close error:', error.message)
    throw new Error(`Failed to close: ${error.message}`)
  }
}

/**
 * Get session info
 */
function getSession(sessionId) {
  return sessions.get(sessionId)
}

/**
 * Get all sessions
 */
function getAllSessions() {
  return Array.from(sessions.entries()).map(([id, session]) => ({
    sessionId: id,
    ...session
  }))
}

/**
 * Execute a multi-step browser task
 */
async function executeTask(sessionId, steps) {
  const results = []

  for (const step of steps) {
    try {
      let result
      switch (step.action) {
        case 'open':
          result = await open(sessionId, step.url)
          break
        case 'click':
          result = await click(sessionId, step.element)
          break
        case 'fill':
          result = await fill(sessionId, step.element, step.value)
          break
        case 'type':
          result = await type(sessionId, step.text)
          break
        case 'press':
          result = await press(sessionId, step.key)
          break
        case 'scroll':
          result = await scroll(sessionId, step.direction, step.amount)
          break
        case 'screenshot':
          result = await screenshot(sessionId)
          break
        case 'snapshot':
          result = await snapshot(sessionId)
          break
        default:
          throw new Error(`Unknown action: ${step.action}`)
      }

      results.push({ step: step.action, success: true, result })

      // Add delay between steps if specified
      if (step.delay) {
        await new Promise(r => setTimeout(r, step.delay))
      }
    } catch (error) {
      results.push({ step: step.action, success: false, error: error.message })
      // Continue with remaining steps or stop
      if (!step.continueOnError) {
        break
      }
    }
  }

  return results
}

/**
 * Log browser action to timeline
 */
function logToTimeline(action, details) {
  const timelineLogger = require('./timelineLogger')
  timelineLogger.logEvent(
    'browser_action',
    `[Browser] Agent ${action}`,
    details
  )
}

module.exports = {
  isInstalled,
  initSession,
  open,
  snapshot,
  click,
  fill,
  type,
  press,
  scroll,
  screenshot,
  close,
  getSession,
  getAllSessions,
  executeTask,
  logToTimeline
}