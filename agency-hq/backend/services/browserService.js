/**
 * Browser Automation Service
 * Wraps the agent-browser CLI for headless browser control
 */

const { spawn, execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Session storage
const sessions = new Map()

// Screenshot output directory
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'data', 'screenshots')
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
}

/**
 * Check if agent-browser is installed
 */
function checkInstalled() {
  try {
    execSync('agent-browser --version', { stdio: 'pipe' })
    return true
  } catch (e) {
    return false
  }
}

/**
 * Install Chromium for agent-browser
 */
async function installBrowser() {
  return new Promise((resolve, reject) => {
    const proc = spawn('agent-browser', ['install'], {
      shell: true,
      stdio: 'inherit'
    })
    proc.on('close', (code) => {
      if (code === 0) resolve(true)
      else reject(new Error(`Install failed with code ${code}`))
    })
  })
}

/**
 * Execute agent-browser command
 */
function runCommand(args, sessionId = null) {
  return new Promise((resolve, reject) => {
    // If we have a session, inject it
    const cmdArgs = sessionId ? ['--session', sessionId, ...args] : args

    console.log('[BrowserService] Running:', 'agent-browser', cmdArgs.join(' '))

    const proc = spawn('agent-browser', cmdArgs, {
      shell: true,
      stdio: 'pipe'
    })

    let stdout = ''
    let stderr = ''

    proc.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    proc.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, output: stdout, stderr })
      } else {
        resolve({ success: false, output: stdout, stderr, code })
      }
    })

    proc.on('error', (err) => {
      reject(err)
    })
  })
}

/**
 * Create a new browser session
 */
async function createSession(options = {}) {
  const sessionId = `session_${Date.now()}`

  sessions.set(sessionId, {
    id: sessionId,
    createdAt: new Date().toISOString(),
    url: null,
    ...options
  })

  return sessionId
}

/**
 * Open a URL in the browser
 */
async function openUrl(sessionId, url) {
  const result = await runCommand(['open', url], sessionId)

  if (sessions.has(sessionId)) {
    const session = sessions.get(sessionId)
    session.url = url
    sessions.set(sessionId, session)
  }

  return result
}

/**
 * Get page snapshot (accessibility tree)
 */
async function getSnapshot(sessionId) {
  const result = await runCommand(['snapshot'], sessionId)

  if (result.success) {
    try {
      // Parse the output as JSON if possible
      return JSON.parse(result.output)
    } catch {
      return result.output
    }
  }

  return result
}

/**
 * Click an element by reference (e.g., @e2)
 */
async function click(sessionId, elementRef) {
  return runCommand(['click', elementRef], sessionId)
}

/**
 * Type/fill input
 */
async function fill(sessionId, elementRef, text) {
  return runCommand(['fill', elementRef, text], sessionId)
}

/**
 * Type text (keyboard input)
 */
async function type(sessionId, text) {
  return runCommand(['type', text], sessionId)
}

/**
 * Press a key
 */
async function press(sessionId, key) {
  return runCommand(['press', key], sessionId)
}

/**
 * Scroll the page
 */
async function scroll(sessionId, direction = 'down', amount = 300) {
  return runCommand(['scroll', direction, String(amount)], sessionId)
}

/**
 * Take a screenshot
 */
async function screenshot(sessionId, filename = null) {
  const name = filename || `screenshot_${Date.now()}.png`
  const filepath = path.join(SCREENSHOTS_DIR, name)

  const result = await runCommand(['screenshot', filepath], sessionId)

  if (result.success) {
    return {
      ...result,
      filepath,
      url: `/api/browser/screenshots/${name}`
    }
  }

  return result
}

/**
 * Get current page URL
 */
function getSessionUrl(sessionId) {
  const session = sessions.get(sessionId)
  return session?.url || null
}

/**
 * Close a session
 */
async function closeSession(sessionId) {
  const result = await runCommand(['close'], sessionId)
  sessions.delete(sessionId)
  return result
}

/**
 * Close all sessions
 */
async function closeAll() {
  for (const sessionId of sessions.keys()) {
    await closeSession(sessionId)
  }
  return { success: true }
}

/**
 * List active sessions
 */
function listSessions() {
  return Array.from(sessions.entries()).map(([id, data]) => ({
    id,
    url: data.url,
    createdAt: data.createdAt
  }))
}

/**
 * Find elements on page
 */
async function find(sessionId, type, value) {
  // Types: role, text, label, placeholder, testId, css
  const validTypes = ['role', 'text', 'label', 'placeholder', 'testid', 'css']
  if (!validTypes.includes(type.toLowerCase())) {
    return { success: false, error: `Invalid find type: ${type}` }
  }
  return runCommand(['find', type, value], sessionId)
}

/**
 * Navigate back/forward
 */
async function navigate(sessionId, direction) {
  if (!['back', 'forward'].includes(direction)) {
    return { success: false, error: 'Direction must be back or forward' }
  }
  return runCommand([direction], sessionId)
}

/**
 * Get available screenshots
 */
function getScreenshots() {
  try {
    const files = fs.readdirSync(SCREENSHOTS_DIR)
    return files.map(f => ({
      name: f,
      path: path.join(SCREENSHOTS_DIR, f),
      url: `/api/browser/screenshots/${f}`,
      created: fs.statSync(path.join(SCREENSHOTS_DIR, f)).mtime
    }))
  } catch {
    return []
  }
}

module.exports = {
  checkInstalled,
  installBrowser,
  createSession,
  openUrl,
  getSnapshot,
  click,
  fill,
  type,
  press,
  scroll,
  screenshot,
  getSessionUrl,
  closeSession,
  closeAll,
  listSessions,
  find,
  navigate,
  getScreenshots,
  SCREENSHOTS_DIR
}