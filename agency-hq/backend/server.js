require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:4173'],
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true,
  },
})

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'], credentials: true }))
app.use(express.json())

// Routes
app.use('/api/agents', require('./routes/agents'))
app.use('/api/approvals', require('./routes/approvals'))
app.use('/api/lanes', require('./routes/lanes'))
app.use('/api/financial', require('./routes/financial'))
app.use('/api/token-economy', require('./routes/token-economy'))
app.use('/api/wallet', require('./routes/wallet'))
app.use('/api/health', require('./routes/health'))
app.use('/api/bevel', require('./routes/bevel'))
app.use('/api/notes', require('./routes/notes'))
app.use('/api/chat', require('./routes/chat'))
app.use('/api/zettelkasten', require('./routes/zettelkasten'))
app.use('/api/timeline', require('./routes/timeline'))
app.use('/api/workflows', require('./routes/workflows'))
app.use('/api/browser', require('./routes/browser'))

// Health check
app.get('/api/ping', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

// Socket handlers
require('./sockets/socketHandlers')(io)

// Agent engine (autonomous activity)
require('./services/agentEngine').start(io)

// Telegram bots (gracefully skip if tokens not set)
const smokeBot = require('./services/smokeBot')
const stackzBot = require('./services/stackzBot')
smokeBot.init(io)
stackzBot.init(io)

// Start server
const PORT = process.env.PORT || 4001
server.listen(PORT, () => {
  console.log(`\n🏢 The Agency HQ Backend running on http://localhost:${PORT}`)
  console.log(`   Socket.io ready`)
  console.log(`   Smoke Bot: ${process.env.SMOKE_BOT_TOKEN && process.env.SMOKE_BOT_TOKEN !== 'your_smoke_bot_token_here' ? '✓ Active' : '⚠ Token not set'}`)
  console.log(`   Stackz Bot: ${process.env.STACKZ_BOT_TOKEN && process.env.STACKZ_BOT_TOKEN !== 'your_stackz_bot_token_here' ? '✓ Active' : '⚠ Token not set'}`)
  console.log(`\n`)
})