const dialogueBank = {
  smoke: [
    "Yo. Monitoring your metrics. Something's shifting this week.",
    "Sleep data looks off. Already building a fix.",
    "Ran the analysis. Three things to address. Sending now.",
    "Your schedule's too packed. Carving out recovery windows.",
  ],
  stackz: [
    "Revenue update: we're moving. Numbers confirmed.",
    "Found a new opportunity. Running the ROI calc now.",
    "Blocker identified in stream 2. On it in 10.",
    "BRO. Weekly target? ALREADY HANDLED.",
  ],
  nova: [
    "Statistical analysis complete. Three significant findings.",
    "Cross-referencing the dataset now. Initial results: interesting.",
    "Data doesn't lie. Here's what the numbers say.",
  ],
  bolt: [
    "CAMPAIGN IS LIVE. Metrics are GREEN. WE GO 🔥",
    "A/B test results in. Winner by 23%. Scaling NOW.",
    "Growth lever found. Pulling it. Stand by for numbers.",
  ],
  rex: [
    "Hold on. I see a risk no one mentioned.",
    "Reviewed the proposal. Four red flags. Sending memo.",
    "Due diligence complete. Proceed with caution.",
  ],
  zip: [
    "Three workflows optimized before 9am. Normal day.",
    "Process documented. Time saved: 2.3 hours/week.",
    "Everything automated. Nothing can stop us now.",
  ],
  chill: [
    "...had a thought",
    "what if we just... did that differently",
    "okay. framework ready. dropping it now.",
  ],
}

function generateChatMessage(agentId) {
  const lines = dialogueBank[agentId] || ['Working on something.']
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    agentId,
    text: lines[Math.floor(Math.random() * lines.length)],
    timestamp: new Date().toISOString(),
    type: 'normal',
  }
}

module.exports = { generateChatMessage }
