/**
 * Stackz Bot — Telegram bot for revenue & business alerts
 * Personality: high energy, money-focused, celebrates loud
 */

const TelegramBot = require('node-telegram-bot-api')
const { logAgentThought } = require('../middleware/zettelkastenMiddleware')

let bot = null
let io = null

function init(socketIo) {
  const token = process.env.STACKZ_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  io = socketIo

  if (!token || token === 'your_stackz_bot_token_here') {
    console.log('[StackzBot] Token not set — Telegram integration disabled. See .env.example')
    return null
  }

  try {
    bot = new TelegramBot(token, { polling: true })
    console.log('[StackzBot] Online — polling mode active')

    // Log initialization to Zettelkasten
    logAgentThought(
      'stackz',
      'Initializing Stackz Telegram bot for revenue monitoring and alerts',
      'Bot initialized successfully',
      'Telegram bot startup'
    )

    // Handle incoming messages
    bot.on('message', (msg) => {
      const text = msg.text
      if (!text) return

      // Log incoming message
      logAgentThought(
        'stackz',
        `Received Telegram message: ${text.substring(0, 100)}...`,
        'Processing message for potential actions',
        'Telegram message handling'
      )

      if (io) {
        io.emit('chat:message', {
          id: `tg_stackz_${Date.now()}`,
          agentId: 'stackz',
          text: `[Via Telegram] ${text}`,
          timestamp: new Date().toISOString(),
          type: 'telegram',
        })
      }
    })

    // Handle inline callbacks
    bot.on('callback_query', (query) => {
      const [action, approvalId] = query.data.split(':')

      // Log callback action
      logAgentThought(
        'stackz',
        `Received callback query: ${action} for approval ${approvalId}`,
        `Executing action: ${action}`,
        'Telegram callback handling'
      )

      if (io) {
        io.emit('approval:action', { id: approvalId, action, note: 'Actioned via Telegram' })
      }

      bot.answerCallbackQuery(query.id, {
        text: action === 'approved' ? '💰 APPROVED. LET\'S GO.' : '🚫 Rejected.',
      })
    })

    scheduleDailyBriefing(chatId)
    return bot
  } catch (err) {
    console.error('[StackzBot] Init error:', err.message)

    // Log error to Zettelkasten
    logAgentThought(
      'stackz',
      'Failed to initialize Stackz Telegram bot',
      `Error occurred: ${err.message}`,
      'Telegram bot initialization error'
    )

    return null
  }
}

function scheduleDailyBriefing(chatId) {
  if (!chatId || chatId === 'your_chat_id_here') return
  setTimeout(() => sendDailyBriefing(chatId), 7000)
}

async function sendDailyBriefing(chatId) {
  if (!bot || !chatId) return
  try {
    await bot.sendMessage(chatId,
      `*GOOD MORNING — Stackz reporting* 📊\n\n` +
      `Revenue today: ALREADY UP 4% from yesterday\n` +
      `Weekly target: 107% hit ✓ WE'RE UP\n` +
      `Active streams: 4 all green\n` +
      `MoM growth: +18.4% 🚀\n\n` +
      `4 approvals waiting. Let's get it.`,
      { parse_mode: 'Markdown' }
    )
  } catch (err) {
    console.error('[StackzBot] Send error:', err.message)
  }
}

async function sendMilestoneAlert(chatId, message) {
  if (!bot || !chatId) return
  try {
    await bot.sendMessage(chatId,
      `🚨 *MILESTONE ALERT — Stackz*\n\n${message}`,
      { parse_mode: 'Markdown' }
    )
  } catch (err) {
    console.error('[StackzBot] Milestone error:', err.message)
  }
}

async function sendApprovalRequest(chatId, approval) {
  if (!bot || !chatId) return
  try {
    await bot.sendMessage(
      chatId,
      `*STACKZ NEEDS A CALL — Approval Required* 💰\n\n` +
      `${approval.title}\n\n` +
      `${approval.description}\n\n` +
      `📈 Impact: ${approval.estimatedImpact}\n` +
      `🎯 Confidence: ${approval.confidence}%\n` +
      `Risk: ${approval.riskLevel.toUpperCase()}`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '💰 APPROVE IT', callback_data: `approved:${approval.id}` },
            { text: '✕ Not Now', callback_data: `rejected:${approval.id}` },
          ]],
        },
      }
    )
  } catch (err) {
    console.error('[StackzBot] sendApprovalRequest error:', err.message)
  }
}

module.exports = { init, sendApprovalRequest, sendMilestoneAlert }
