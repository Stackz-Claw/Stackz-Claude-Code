/**
 * PinchTab Browser Agent Service
 * HTTP API-based browser automation using Chrome DevTools Protocol
 * Docs: https://github.com/pinchtab/pinchtab
 */

const http = require('http')
const { URL } = require('url')

// PinchTab server configuration
const PINCHTAB_HOST = process.env.PINCHTAB_HOST || 'localhost'
const PINCHTAB_PORT = process.env.PINCHTAB_PORT || 9867
const BASE_URL = `http://${PINCHTAB_HOST}:${PINCHTAB_PORT}`

// Session management
const sessions = new Map()
let pinchTabAvailable = null

/**
 * Make HTTP request to PinchTab server
 */
function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL)

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {}
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed)
          } else {
            reject(new Error(parsed.error || `HTTP ${res.statusCode}`))
          }
        } catch (e) {
          resolve(data) // Return raw text if not JSON
        }
      })
    })

    req.on('error', reject)

    if (body) {
      req.write(JSON.stringify(body))
    }

    req.end()
  })
}

/**
 * Check if PinchTab server is available
 */
async function isAvailable() {
  if (pinchTabAvailable !== null) {
    return pinchTabAvailable
  }

  try {
    await request('GET', '/health')
    pinchTabAvailable = true
    return true
  } catch (e) {
    pinchTabAvailable = false
    return false
  }
}

/**
 * Launch a new browser instance
 */
async function launchInstance(profile = 'default', headless = true) {
  const instanceId = `inst_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`

  try {
    const result = await request('POST', '/instances/launch', {
      profile,
      headless,
      args: ['--disable-blink-features=AutomationControlled']
    })

    const session = {
      instanceId: result.instance_id || instanceId,
      profile,
      headless,
      created: new Date().toISOString(),
      tabs: [],
      activeTab: null
    }

    sessions.set(session.instanceId, session)
    return session
  } catch (error) {
    console.error('[PinchTab] Launch error:', error.message)
    throw error
  }
}

/**
 * Open a URL in a new tab
 */
async function openTab(instanceId, url) {
  const session = sessions.get(instanceId)
  if (!session) {
    throw new Error('Instance not found')
  }

  try {
    const result = await request('POST', `/instances/${instanceId}/tabs/open`, {
      url
    })

    const tabId = result.tab_id || `tab_${Date.now()}`
    session.tabs.push({ tabId, url, created: new Date().toISOString() })
    session.activeTab = tabId

    return { tabId, url, instanceId }
  } catch (error) {
    console.error('[PinchTab] Open tab error:', error.message)
    throw error
  }
}

/**
 * Get accessibility snapshot (token-efficient ~800 tokens per page)
 */
async function getSnapshot(instanceId, tabId = null) {
  const session = sessions.get(instanceId)
  if (!session) {
    throw new Error('Instance not found')
  }

  const targetTab = tabId || session.activeTab
  if (!targetTab) {
    throw new Error('No active tab')
  }

  try {
    const result = await request('POST', `/tabs/${targetTab}/snapshot`, {
      mode: 'accessibility' // Token-efficient mode
    })

    return {
      snapshot: result.snapshot || result.accessibility_tree || result,
      tabId: targetTab,
      instanceId,
      tokenEstimate: result.token_estimate
    }
  } catch (error) {
    console.error('[PinchTab] Snapshot error:', error.message)
    throw error
  }
}

/**
 * Get text content only (most token-efficient)
 */
async function getText(instanceId, tabId = null) {
  const session = sessions.get(instanceId)
  if (!session) {
    throw new Error('Instance not found')
  }

  const targetTab = tabId || session.activeTab
  if (!targetTab) {
    throw new Error('No active tab')
  }

  try {
    const result = await request('GET', `/tabs/${targetTab}/text`)
    return { text: result.text || result, tabId: targetTab }
  } catch (error) {
    // Fallback to snapshot
    const snapshot = await getSnapshot(instanceId, targetTab)
    return { text: snapshot.snapshot, tabId: targetTab }
  }
}

/**
 * Click an element by selector or role
 */
async function click(instanceId, selector, tabId = null) {
  const session = sessions.get(instanceId)
  if (!session) {
    throw new Error('Instance not found')
  }

  const targetTab = tabId || session.activeTab
  if (!targetTab) {
    throw new Error('No active tab')
  }

  try {
    const result = await request('POST', `/tabs/${targetTab}/action`, {
      action: 'click',
      selector
    })

    return { success: true, selector, tabId: targetTab }
  } catch (error) {
    console.error('[PinchTab] Click error:', error.message)
    throw error
  }
}

/**
 * Fill an input field
 */
async function fill(instanceId, selector, value, tabId = null) {
  const session = sessions.get(instanceId)
  if (!session) {
    throw new Error('Instance not found')
  }

  const targetTab = tabId || session.activeTab
  if (!targetTab) {
    throw new Error('No active tab')
  }

  try {
    const result = await request('POST', `/tabs/${targetTab}/action`, {
      action: 'fill',
      selector,
      value
    })

    return { success: true, selector, value, tabId: targetTab }
  } catch (error) {
    console.error('[PinchTab] Fill error:', error.message)
    throw error
  }
}

/**
 * Type text
 */
async function type(instanceId, text, tabId = null) {
  const session = sessions.get(instanceId)
  if (!session) {
    throw new Error('Instance not found')
  }

  const targetTab = tabId || session.activeTab
  if (!targetTab) {
    throw new Error('No active tab')
  }

  try {
    const result = await request('POST', `/tabs/${targetTab}/action`, {
      action: 'type',
      text
    })

    return { success: true, text, tabId: targetTab }
  } catch (error) {
    console.error('[PinchTab] Type error:', error.message)
    throw error
  }
}

/**
 * Press a key
 */
async function press(instanceId, key, tabId = null) {
  const session = sessions.get(instanceId)
  if (!session) {
    throw new Error('Instance not found')
  }

  const targetTab = tabId || session.activeTab
  if (!targetTab) {
    throw new Error('No active tab')
  }

  try {
    const result = await request('POST', `/tabs/${targetTab}/action`, {
      action: 'press',
      key
    })

    return { success: true, key, tabId: targetTab }
  } catch (error) {
    console.error('[PinchTab] Press error:', error.message)
    throw error
  }
}

/**
 * Scroll the page
 */
async function scroll(instanceId, direction = 'down', amount = 500, tabId = null) {
  const session = sessions.get(instanceId)
  if (!session) {
    throw new Error('Instance not found')
  }

  const targetTab = tabId || session.activeTab
  if (!targetTab) {
    throw new Error('No active tab')
  }

  const scrollAmount = direction === 'down' ? amount : -amount

  try {
    const result = await request('POST', `/tabs/${targetTab}/action`, {
      action: 'scroll',
      y: scrollAmount
    })

    return { success: true, direction, amount, tabId: targetTab }
  } catch (error) {
    console.error('[PinchTab] Scroll error:', error.message)
    throw error
  }
}

/**
 * Navigate back/forward
 */
async function navigate(instanceId, direction = 'back', tabId = null) {
  const session = sessions.get(instanceId)
  if (!session) {
    throw new Error('Instance not found')
  }

  const targetTab = tabId || session.activeTab
  if (!targetTab) {
    throw new Error('No active tab')
  }

  try {
    const result = await request('POST', `/tabs/${targetTab}/navigate`, {
      direction
    })

    return { success: true, direction, tabId: targetTab }
  } catch (error) {
    console.error('[PinchTab] Navigate error:', error.message)
    throw error
  }
}

/**
 * Take a screenshot
 */
async function screenshot(instanceId, tabId = null) {
  const session = sessions.get(instanceId)
  if (!session) {
    throw new Error('Instance not found')
  }

  const targetTab = tabId || session.activeTab
  if (!targetTab) {
    throw new Error('No active tab')
  }

  try {
    const result = await request('POST', `/tabs/${targetTab}/screenshot`, {
      format: 'base64'
    })

    return {
      screenshot: result.image || result.base64,
      format: result.format || 'png',
      tabId: targetTab
    }
  } catch (error) {
    console.error('[PinchTab] Screenshot error:', error.message)
    throw error
  }
}

/**
 * Close a tab
 */
async function closeTab(instanceId, tabId) {
  const session = sessions.get(instanceId)
  if (!session) {
    throw new Error('Instance not found')
  }

  try {
    await request('DELETE', `/tabs/${tabId}`)
    session.tabs = session.tabs.filter(t => t.tabId !== tabId)

    if (session.activeTab === tabId) {
      session.activeTab = session.tabs[0]?.tabId || null
    }

    return { success: true, tabId }
  } catch (error) {
    console.error('[PinchTab] Close tab error:', error.message)
    throw error
  }
}

/**
 * Close an instance
 */
async function closeInstance(instanceId) {
  try {
    await request('DELETE', `/instances/${instanceId}`)
    sessions.delete(instanceId)
    return { success: true, instanceId }
  } catch (error) {
    console.error('[PinchTab] Close instance error:', error.message)
    // Clean up locally anyway
    sessions.delete(instanceId)
    throw error
  }
}

/**
 * Get instance status
 */
function getInstance(instanceId) {
  return sessions.get(instanceId)
}

/**
 * List all instances
 */
function listInstances() {
  return Array.from(sessions.entries()).map(([id, session]) => ({
    instanceId: id,
    ...session
  }))
}

/**
 * Execute a multi-step task
 */
async function executeTask(instanceId, steps) {
  const results = []

  for (const step of steps) {
    try {
      let result
      switch (step.action) {
        case 'open':
        case 'nav':
        case 'navigate':
          const tabResult = await openTab(instanceId, step.url)
          result = { tabId: tabResult.tabId, url: step.url }
          break
        case 'snapshot':
        case 'snap':
          result = await getSnapshot(instanceId)
          break
        case 'text':
          result = await getText(instanceId)
          break
        case 'click':
          result = await click(instanceId, step.selector)
          break
        case 'fill':
          result = await fill(instanceId, step.selector, step.value)
          break
        case 'type':
          result = await type(instanceId, step.text)
          break
        case 'press':
          result = await press(instanceId, step.key)
          break
        case 'scroll':
          result = await scroll(instanceId, step.direction, step.amount)
          break
        case 'back':
        case 'forward':
          result = await navigate(instanceId, step.action)
          break
        case 'screenshot':
          result = await screenshot(instanceId)
          break
        default:
          throw new Error(`Unknown action: ${step.action}`)
      }

      results.push({ step: step.action, success: true, result })

      if (step.delay) {
        await new Promise(r => setTimeout(r, step.delay))
      }
    } catch (error) {
      results.push({ step: step.action, success: false, error: error.message })
      if (!step.continueOnError) break
    }
  }

  return results
}

/**
 * Log browser action to timeline
 */
function logToTimeline(action, details) {
  try {
    const timelineLogger = require('./timelineLogger')
    timelineLogger.logEvent('browser_action', `[PinchTab] ${action}`, details)
  } catch (e) {
    console.warn('[PinchTab] Timeline log failed:', e.message)
  }
}

module.exports = {
  isAvailable,
  launchInstance,
  openTab,
  getSnapshot,
  getText,
  click,
  fill,
  type,
  press,
  scroll,
  navigate,
  screenshot,
  closeTab,
  closeInstance,
  getInstance,
  listInstances,
  executeTask,
  logToTimeline
}