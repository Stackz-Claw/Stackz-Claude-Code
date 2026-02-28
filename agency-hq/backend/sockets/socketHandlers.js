const { getDb } = require('../db/database')

module.exports = function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`)

    // Join agent room
    socket.on('agent:join', (agentId) => {
      socket.join(`agent:${agentId}`)
    })

    // Boss sends message
    socket.on('boss:message', (text) => {
      const msg = {
        id: `msg_boss_${Date.now()}`,
        agentId: 'boss',
        text,
        timestamp: new Date().toISOString(),
        type: 'boss',
      }
      io.emit('chat:message', msg)
    })

    // Approval action from dashboard
    socket.on('approval:action', ({ id, action, note }) => {
      const db = getDb()
      db.prepare(`
        UPDATE approvals SET status = ?, note = ?, resolvedAt = datetime('now') WHERE id = ?
      `).run(action, note || '', id)
      io.emit('approval:updated', { id, action })
    })

    // Telegram reply routed back into dashboard
    socket.on('telegram:reply', ({ agentId, text }) => {
      const msg = {
        id: `msg_tg_${Date.now()}`,
        agentId,
        text: `[Telegram] ${text}`,
        timestamp: new Date().toISOString(),
        type: 'telegram',
      }
      io.emit('chat:message', msg)
    })

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`)
    })
  })
}
