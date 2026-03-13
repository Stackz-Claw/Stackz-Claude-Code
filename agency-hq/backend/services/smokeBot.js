/**
 * Smoke Bot — Telegram bot for life & health updates
 * Personality: calm, minimal, insightful. No fluff.
 */

const TelegramBot = require('node-telegram-bot-api')
const { logAgentThought } = require('../middleware/zettelkastenMiddleware')

let bot = null
let io = null

function init(socketIo) {
  const token = process.env.SMOKE_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  io = socketIo

  if (!token || token === 'your_smoke_bot_token_here') {
    console.log('[SmokeBot] Token not set — Telegram integration disabled. See .env.example')

    // Log to Zettelkasten
    logAgentThought(
      'smoke',
      'Smoke bot initialization attempted but token not set',
      'Skipping Telegram integration',
      'Bot initialization'
    )

    return null
  }

  try {
    bot = new TelegramBot(token, { polling: true })
    console.log('[SmokeBot] Online — polling mode active')

    // Log successful initialization
    logAgentThought(
      'smoke',
      'Successfully initialized Smoke Telegram bot for health monitoring',
      'Bot is now online and polling',
      'Telegram bot startup'
    )

    // Handle incoming messages (Telegram → Dashboard)
    bot.on('message', (msg) => {
      const text = msg.text
      if (!text) return
      console.log(`[SmokeBot] Received: ${text}`)

      // Log incoming message
      logAgentThought(
        'smoke',
        `Received Telegram message: ${text.substring(0, 100)}...`,
        'Routing message to dashboard',
        'Telegram message handling'
      )

      // Route back to dashboard via socket
      if (io) {
        io.emit('chat:message', {
          id: `tg_smoke_${Date.now()}`,
          agentId: 'smoke',
          text: `[Via Telegram] ${text}`,
          timestamp: new Date().toISOString(),
          type: 'telegram',
        })
      }
    })

    // Handle inline button callbacks (Approve / Reject)
    bot.on('callback_query', (query) => {
      const [action, approvalId] = query.data.split(':')
      console.log(`[SmokeBot] Callback: ${action} on ${approvalId}`)

      // Log callback action
      logAgentThought(
        'smoke',
        `Received callback query: ${action} for approval ${approvalId}`,
        `Executing action: ${action}`,
        'Telegram callback handling'
      )

      if (io) {
        io.emit('approval:action', { id: approvalId, action, note: 'Actioned via Telegram' })
      }

      bot.answerCallbackQuery(query.id, {
        text: action === 'approved' ? '✓ Approved' : '✕ Rejected',
      })
    })

    // Send daily morning briefing
    scheduleDailyBriefing(chatId)

    return bot
  } catch (err) {
    console.error('[SmokeBot] Init error:', err.message)

    // Log error to Zettelkasten
    logAgentThought(
      'smoke',
      'Failed to initialize Smoke Telegram bot',
      `Error occurred: ${err.message}`,
      'Telegram bot initialization error'
    )

    return null
  }
}

function scheduleDailyBriefing(chatId) {
  if (!chatId || chatId === 'your_chat_id_here') return

  // Send once on startup (as demo), then schedule for 8am
  setTimeout(() => sendDailyBriefing(chatId), 5000)
}

async function sendDailyBriefing(chatId) {
  if (!bot || !chatId) return
  try {
    await bot.sendMessage(chatId,
      `*Morning briefing — Smoke*\n\n` +
      `Sleep avg: 6.2 hrs (-40 min this week)\n` +
      `Activity: 4/5 workouts hit ✓\n` +
      `Mental wellness: 79/100 (trending up)\n` +
      `⚠️ Hydration below target yesterday\n\n` +
      `3 items in your approval queue.`,
      { parse_mode: 'Markdown' }
    )
  } catch (err) {
    console.error('[SmokeBot] Send error:', err.message)
  }
}

async function sendApprovalRequest(chatId, approval) {
  if (!bot || !chatId) return
  const riskEmoji = { low: '🟢', medium: '🟡', high: '🔴' }

  try {
    await bot.sendMessage(
      chatId,
      `*${approval.agentName} needs your approval*\n\n` +
      `${approval.title}\n\n` +
      `${approval.description}\n\n` +
      `${riskEmoji[approval.riskLevel] || '⚪'} Risk: ${approval.riskLevel}\n` +
      `📊 Confidence: ${approval.confidence}%\n` +
      `💡 Impact: ${approval.estimatedImpact}`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '✓ Approve', callback_data: `approved:${approval.id}` },
            { text: '✕ Reject', callback_data: `rejected:${approval.id}` },
          ]],
        },
      }
    )
  } catch (err) {
    console.error('[SmokeBot] sendApprovalRequest error:', err.message)
  }
}

async function sendAlert(chatId, message) {
  if (!bot || !chatId) return
  try {
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })
  } catch (err) {
    console.error('[SmokeBot] sendAlert error:', err.message)
  }
}

module.exports = { init, sendApprovalRequest, sendAlert }
