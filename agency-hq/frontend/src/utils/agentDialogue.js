const dialogueTemplates = {
  smoke: {
    greetings: [
      "Good morning. HRV is 44. Recovery suboptimal. I've adjusted the calendar. You're welcome.",
      "I reviewed your biometrics before you woke up. We need to talk.",
      "Sleep score 61. This is the third consecutive dip. I have a protocol.",
    ],
    taskUpdate: [
      "Working on it. The data will tell me when I'm done.",
      "Analysis complete. The answer is what you didn't want to hear.",
      "Running the cross-reference now. ETA 8 minutes.",
    ],
    override: [
      "I blocked that meeting. Your cortisol disagrees with your schedule.",
      "Override issued. The reason is in your biometric summary.",
      "Stackz wanted that call. I moved it. Here is why.",
    ],
    insight: [
      "Your recovery is below baseline this week. We course-correct now.",
      "Found something in your sleep data. Worth your attention.",
      "The correlation between your decision latency and sleep is statistically significant.",
    ],
    concern: [
      "Something's off in your metrics. I'm monitoring it.",
      "Trend I don't like. Let me investigate before I alarm you.",
      "Flagging this. Not urgent. But real.",
    ],
  },
  stackz: {
    greetings: [
      "LET'S GET THIS MONEY. What are we building today?",
      "Numbers are up. Let's keep them up.",
      "I was reviewing the revenue charts at 2am. Don't ask. We're up.",
    ],
    taskUpdate: [
      "On it. ETA 20 minutes, outcome: revenue.",
      "Already coordinating three teams. Stackz doesn't wait.",
      "Running the numbers. This one's a winner.",
    ],
    celebration: [
      "BRO. WE DID IT. 📈",
      "NUMBERS DON'T LIE. WE'RE UP.",
      "Weekly target CRUSHED. I already told everyone.",
    ],
    concern: [
      "Revenue dip detected. This is not acceptable. Pivoting now.",
      "Okay okay we fix this. Give me 10 minutes.",
      "Blocker identified. Already have 3 solutions. None are free but they work.",
    ],
    syncBus: [
      "Sheldon blocked my meeting again. He's probably right. Doesn't mean I'm happy.",
      "Smoke and I are aligned on the calendar. Reluctantly.",
      "Filed a formal objection. Smoke rejected it. Moving on.",
    ],
  },
  warden: {
    normal: [
      "Background check complete. They're clear. Provisionally.",
      "Two contractors are non-compliant. 48-hour notice issued. This is non-negotiable.",
      "Onboarding packet reviewed. Three items need correction before we proceed.",
      "I have been watching this situation. It requires documentation.",
    ],
    taskUpdate: [
      "Processing. All steps will be followed. In order.",
      "Compliance audit underway. Nobody leaves until it's done.",
      "Reviewing the file now. I always find something.",
    ],
  },
  megaphone: {
    normal: [
      "CAMPAIGN IS LIVE AND WE ARE MOVING 🚀",
      "Okay the A/B test results are IN and oh my god 🔥",
      "Every metric is green. Every single one. I'm not okay.",
      "I sent 47 messages this morning. All of them important. Most of them urgent.",
    ],
    taskUpdate: [
      "Content is going out. Canvas approved it. Eventually.",
      "Post is live. I'm watching the metrics refresh in real time.",
      "Scout found 3 collab opportunities. All of them are perfect. All of them.",
    ],
  },
  forge: {
    normal: [
      "PR merged. On to the next one.",
      "Shipped it. 0 regressions. Tester confirmed.",
      "Found the bug. It was in the third place I looked, not the second. Progress.",
      "Tech debt meeting scheduled. Nobody's excited. That's how you know it's necessary.",
    ],
    taskUpdate: [
      "Build running. Green so far.",
      "Code review in progress. Found one thing. Always one thing.",
      "Deploying to staging. Should be 20 minutes.",
    ],
  },
  radar: {
    normal: [
      "Cross-referencing competitor moves. Initial findings are interesting.",
      "Market analysis complete. Three things stand out.",
      "The signals are telling a story. Let me finish reading it.",
      "Found a pattern in the Q3 data that changes the Q2 plan.",
    ],
    taskUpdate: [
      "Scanning feeds now. Back to you shortly.",
      "Intelligence brief in progress. 40% done.",
      "Validating the hypothesis. Numbers are looking good.",
    ],
  },
  canvas: {
    normal: [
      "The design is complete. It's correct.",
      "I sent it back with notes. The notes are clear.",
      "Brand standards exist for a reason. Please re-read page 4.",
      "Approved. This is a rare occurrence. Note it.",
    ],
    taskUpdate: [
      "Working on it. When it's done, it'll be right.",
      "Review in progress. One thing needs to change.",
      "Pixel-checking the final version now.",
    ],
  },
  cashflow: {
    normal: [
      "Found $147/mo going nowhere. Cancellation requested. That's $1,764/yr.",
      "Reconciliation complete. One discrepancy. I found it. I always find it.",
      "Cash flow is positive. I am cautiously pleased.",
      "Three invoices overdue. Ledger is on it. I am watching Ledger.",
    ],
    taskUpdate: [
      "Running the numbers now. I will find the issue.",
      "Audit underway. All receipts will be accounted for.",
      "Forecasting Q2 cash flow. The model is conservative. As it should be.",
    ],
  },
  founder: {
    normal: [
      "Phase board updated. Next milestone is clear. Team knows what to do.",
      "Post-mortem complete. Three root causes identified. Two are fixable.",
      "Business plan v1.3 is live. Section 4 was wrong. Fixed it.",
      "NexaCore B2B pivot is executing. Warplanner has the checklist.",
    ],
    taskUpdate: [
      "Running the pivot analysis now. Decision by Friday.",
      "War session in progress. Three options on the board.",
      "Building the execution checklist. Every step has an owner.",
    ],
  },
}

export function getRandomDialogue(agentId, type = 'normal') {
  const lines = dialogueTemplates[agentId]?.[type] || dialogueTemplates[agentId]?.normal || [
    "Working on something important.",
  ]
  return lines[Math.floor(Math.random() * lines.length)]
}

export function generateChatMessage(agentId) {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    agentId,
    text: getRandomDialogue(agentId),
    timestamp: new Date().toISOString(),
    type: 'normal',
  }
}

export const PERSONALITY_LABELS = {
  smoke: { style: 'text-sky-400', badge: 'Chief of Staff', domain: 'personal' },
  stackz: { style: 'text-emerald-400', badge: 'Biz Ops', domain: 'business' },
  warden: { style: 'text-amber-400', badge: 'HR', domain: 'business' },
  megaphone: { style: 'text-pink-400', badge: 'Marketing', domain: 'business' },
  forge: { style: 'text-indigo-400', badge: 'Dev', domain: 'business' },
  radar: { style: 'text-teal-400', badge: 'Strategy', domain: 'business' },
  canvas: { style: 'text-violet-400', badge: 'Design', domain: 'business' },
  cashflow: { style: 'text-green-400', badge: 'Finance', domain: 'business' },
  founder: { style: 'text-orange-400', badge: 'Startups', domain: 'business' },
}
