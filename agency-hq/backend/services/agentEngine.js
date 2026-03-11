/**
 * Agent Engine — autonomous agent activity simulation
 * Runs on a tick loop, emits socket events for live dashboard updates
 */

const agentsData = require('../../mock-data/agents.json')
const { generateChatMessage } = require('./dialogueService')

let io
let agentTasks = {}

const TICK_INTERVAL = 30000  // 30s main loop

const TASK_POOL = {
  smoke: [
    'Analyzing biometric trends from this week',
    'Reviewing sleep optimization protocol',
    'Cross-referencing nutrition data',
    'Monitoring stress indicators',
    'Scheduling preventive health appointments',
  ],
  stackz: [
    'Running revenue projection models',
    'Analyzing competitor pricing',
    'Reviewing Q1 growth metrics',
    'Building upsell campaign',
    'Evaluating new revenue stream opportunity',
  ],
  nova: [
    'Cross-referencing 847 market data points',
    'Building statistical model',
    'Reviewing research findings',
    'Compiling competitive analysis report',
  ],
  bolt: [
    'Running A/B test analysis',
    'Optimizing ad creative performance',
    'Monitoring campaign metrics',
    'Building email sequence',
  ],
  rex: [
    'Reviewing risk assessment for new proposal',
    'Checking compliance requirements',
    'Running due diligence on partnership',
    'Flagging potential liability issues',
  ],
  zip: [
    'Automating repetitive workflow',
    'Documenting completed processes',
    'Optimizing task pipeline',
    'Building tracking dashboard',
  ],
  chill: [
    'Staring at ceiling... (breakthrough imminent)',
    'Napping... (strategically)',
    'Thinking about the big picture',
    'Vibing... but productively',
  ],
}

function getRandomTask(agentId) {
  const tasks = TASK_POOL[agentId] || ['Working on something important']
  return tasks[Math.floor(Math.random() * tasks.length)]
}

function tick() {
  if (!io) return

  // Pick a random agent and update their task
  const agents = agentsData.agents
  const agent = agents[Math.floor(Math.random() * agents.length)]
  const newTask = getRandomTask(agent.id, TASK_POOL)

  io.emit('agent:update', {
    agentId: agent.id,
    updates: {
      currentTask: newTask,
      energyLevel: Math.floor(Math.random() * 40 + 60),
    },
  })
}

module.exports = {
  start(socketIo) {
    io = socketIo
    setInterval(tick, TICK_INTERVAL)
    console.log('[AgentEngine] Started — tick every 30s')
  },
}
