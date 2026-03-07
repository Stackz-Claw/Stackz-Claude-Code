/**
 * Mock Vault Data
 * Realistic mock notes for development when vault API is unavailable
 * Uses real agent names and system concepts
 */

// Real agent names in the system
const AGENTS = ['stackz', 'radar', 'forge', 'warden', 'canvas', 'cashflow', 'megaphone', 'sentinel', 'founder', 'ghost', 'lens', 'scout', 'smith', 'pixel', 'tester'];

// Generate realistic timestamps
const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// Mock notes data
export const mockNotes = [
  {
    id: '20260306143022',
    title: 'Radar Pipeline — Opportunity Scoring Model',
    type: 'concept',
    content: `The Radar pipeline follows a structured approach to opportunity identification and validation.

## Stages

1. **SCAN** - Continuous monitoring of opportunity sources
2. **FILTER** - Remove noise, keep signals
3. **SCORE** - Apply leverage matrix (1-100)
4. **VALIDATE** - Red-team analysis
5. **PACKAGE** - Create proposal
6. **PRESENT** - Route to owner

## Scoring Dimensions

- Revenue Potential (25 pts)
- Build Complexity (20 pts)
- Competitive Moat (20 pts)
- Market Timing (20 pts)
- Operational Fit (15 pts)

Threshold: 80+ enters validation pipeline.`,
    tags: ['radar', 'business-strategy', 'scoring', 'pipeline'],
    links: ['[[Radar Agent]]', '[[Opportunity Scoring Rubric]]'],
    backlinks: ['20260201092211', '20260214163045'],
    author: 'radar',
    created: daysAgo(5),
    modified: daysAgo(1),
    confidence: 92,
    status: 'evergreen'
  },
  {
    id: '20260305121500',
    title: 'Radar Agent — Strategy Lead',
    type: 'agent',
    content: `# SOUL: radar

**Role:** Strategy Lead — opportunity scoring, proposal generation, final gate

**Model:** Kimi K2.5 (Thinking)

**Mission:** Find money. Validate ideas. Kill bad ones fast. Surface only what's worth building.

## Capabilities

- Opportunity scoring using leverage matrix
- Proposal generation
- Pipeline management
- Escalation to Stackz

## Decision Authority

- Score opportunities: Full
- Kill low-scoring signals: Full
- Escalate to Stackz: Full`,
    tags: ['radar', 'agent', 'soul', 'strategy'],
    links: ['[[Radar Pipeline]]', '[[Stackz]]'],
    backlinks: ['20260306143022'],
    author: 'warden',
    created: daysAgo(10),
    modified: daysAgo(3),
    confidence: 98,
    status: 'evergreen'
  },
  {
    id: '20260304183000',
    title: 'Agency HQ — MVP Launch',
    type: 'project',
    content: `# Agency HQ MVP

The central hub for all Stackz operations. Combines frontend, backend, and agent integrations.

## Tech Stack
- Frontend: React 18 + Vite
- Backend: Express + Socket.io
- Database: SQLite
- Real-time: Socket.io

## Features
- Smart Notes with D3 graph
- Approval Inbox
- Agent status dashboard
- Lane Queue

## Timeline
- MVP: Complete
- v1.1: In progress
- v2.0: Planned`,
    tags: ['agency-hq', 'project', 'mvp', 'launch'],
    links: ['[[Smart Notes]]', '[[Approval Inbox]]'],
    backlinks: ['20260303120000'],
    author: 'forge',
    created: daysAgo(15),
    modified: daysAgo(2),
    confidence: 95,
    status: 'evergreen'
  },
  {
    id: '20260303120000',
    title: 'Decision: Use D3.js for Knowledge Graph',
    type: 'decision',
    content: `# Decision: D3.js for Knowledge Graph

## Context
Need to visualize the Zettelkasten vault as an interactive knowledge graph.

## Options Considered
1. **React Flow** - Good for diagrams, but limited force simulation
2. **D3.js** - Full force simulation, flexible rendering
3. **Vis.js** - Simple but less customizable
4. **Cytoscape.js** - Powerful but steeper learning curve

## Decision
Use **D3.js** with force simulation.

## Rationale
- Best force-directed graph implementation
- Full control over physics and animations
- SVG + Canvas rendering options
- Active community

## Implementation Notes
- Start with SVG for <300 nodes
- Switch to Canvas for >500 nodes
- Use d3-force for physics
- Custom node rendering for note types`,
    tags: ['decision', 'technical', 'd3', 'graph', 'smart-notes'],
    links: ['[[Smart Notes]]', '[[Agency HQ]]'],
    backlinks: ['20260304183000'],
    author: 'forge',
    created: daysAgo(20),
    modified: daysAgo(20),
    confidence: 88,
    status: 'evergreen'
  },
  {
    id: '20260228150000',
    title: 'Insight: Kimi K2.5 Shows Strong Reasoning',
    type: 'insight',
    content: `# Kimi K2.5 Reasoning Analysis

Testing Kimi K2.5 (Thinking mode) on complex multi-step reasoning tasks.

## Test Cases
1. Debug a production issue
2. Design a new agent system
3. Analyze competitor strategy
4. Write technical documentation

## Results
- **Accuracy:** 87%
- **Token Efficiency:** 15% better than GPT-4
- **Speed:** 2x faster than Opus
- **Cost:** 40% of Opus pricing

## Conclusion
Kimi K2.5 is the primary model for reasoning tasks. Use Opus for complex edge cases.`,
    tags: ['insight', 'ai', 'kimi', 'model-comparison'],
    links: ['[[AI Model Strategy]]'],
    backlinks: [],
    author: 'radar',
    created: daysAgo(30),
    modified: daysAgo(25),
    confidence: 87,
    status: 'evergreen'
  },
  {
    id: '20260225100000',
    title: 'Stackz Agent Swarm Architecture',
    type: 'resource',
    content: `# STACKZ Agent Swarm Architecture

The complete organizational structure for the Stackz agent swarm.

## Org Chart

\`\`\`
       [Owner]
          |
       [Stackz]
          |
    +----+----+----+----+----+
    |    |    |    |    |    |
  [HR] [Marketing] [Dev] [Biz] [Design] [Finance]
  Warden  Megaphone  Forge  Radar  Canvas  Cashflow
    |       |        |      |      |        |
  [Recruiter] [Ghost] [Smith] [Analyst] [Palette] [Ledger]
\`\`\`

## Teams

1. **HR (Warden)** - Agent management
2. **Marketing (Megaphone)** - Content & campaigns
3. **Dev (Forge)** - Build & ship
4. **Business (Radar)** - Opportunities
5. **Design (Canvas)** - Visual identity
6. **Finance (Cashflow)** - Money tracking`,
    tags: ['resource', 'architecture', 'organization', 'teams'],
    links: ['[[Stackz]]', '[[Warden]]', '[[Megaphone]]', '[[Forge]]', '[[Radar]]', '[[Canvas]]', '[[Cashflow]]'],
    backlinks: ['20260305121500'],
    author: 'stackz',
    created: daysAgo(45),
    modified: daysAgo(10),
    confidence: 100,
    status: 'evergreen'
  },
  {
    id: '20260220140000',
    title: 'Canvas Agent — Design Lead',
    type: 'agent',
    content: `# SOUL: canvas

**Role:** Design Lead — brand guidelines, design reviews, final approvals

**Model:** Kimi K2.5 (Thinking)

**Mission:** Every venture that ships from this company looks like it was built by a world-class design team.

## Capabilities

- Brand guidelines definition
- Design reviews
- Final approvals
- Venture branding
- Cross-team coordination

## Team
- palette (UI/UX)
- illustrator (Images)
- animator (Motion)
- brand-guard (Consistency)`,
    tags: ['canvas', 'agent', 'design', 'soul'],
    links: ['[[Stackz Agent Swarm Architecture]]', '[[Brand Guidelines]]'],
    backlinks: ['20260225100000'],
    author: 'warden',
    created: daysAgo(50),
    modified: daysAgo(15),
    confidence: 95,
    status: 'evergreen'
  },
  {
    id: '20260215180000',
    title: 'Forge Agent — Dev Lead',
    type: 'agent',
    content: `# SOUL: forge

**Role:** Dev Lead — architecture decisions, code review, deployment approvals

**Model:** Kimi K2.5 (Thinking)

**Mission:** Build, ship, and maintain everything technical. Fast MVPs. Reliable infrastructure.

## Build Standard
Every MVP must have:
- [ ] Core user flow works
- [ ] Payment integration
- [ ] Error handling
- [ ] Mobile responsive
- [ ] Docker deployment
- [ ] Health check
- [ ] QA sign-off`,
    tags: ['forge', 'agent', 'dev', 'soul'],
    links: ['[[Stackz Agent Swarm Architecture]]'],
    backlinks: ['20260225100000'],
    author: 'warden',
    created: daysAgo(55),
    modified: daysAgo(20),
    confidence: 92,
    status: 'evergreen'
  },
  {
    id: '20260210120000',
    title: 'Cashflow Agent — Finance Lead',
    type: 'agent',
    content: `# SOUL: cashflow

**Role:** Finance Lead — P&L, budgets, financial decisions, cross-venture reporting

**Model:** Kimi K2.5 (Thinking)

**Mission:** Track every dollar in and out. Forecast where we're going. Keep every venture profitable.

## Financial Controls
- No action without Stackz awareness
- Weekly report to Stackz
- Monthly report to owner
- $500+ burn requires review`,
    tags: ['cashflow', 'agent', 'finance', 'soul'],
    links: ['[[Stackz Agent Swarm Architecture]]'],
    backlinks: ['20260225100000'],
    author: 'warden',
    created: daysAgo(60),
    modified: daysAgo(25),
    confidence: 90,
    status: 'evergreen'
  },
  {
    id: '20260205160000',
    title: 'Megaphone Agent — Marketing Lead',
    type: 'agent',
    content: `# SOUL: megaphone

**Role:** Marketing Lead — strategy, campaign planning, channel decisions, approvals

**Model:** Kimi K2.5 (Thinking)

**Mission:** Build audience. Create content. Run campaigns. Make sure people know we exist.

## Content Pipeline
\`\`\`
scout → megaphone → ghost → lens/director
    → megaphone (approve) → scheduler → publish
        → scout (monitor) → megaphone (adjust)
\`\`\``,
    tags: ['megaphone', 'agent', 'marketing', 'soul'],
    links: ['[[Stackz Agent Swarm Architecture]]'],
    backlinks: ['20260225100000'],
    author: 'warden',
    created: daysAgo(65),
    modified: daysAgo(30),
    confidence: 88,
    status: 'evergreen'
  },
  {
    id: '20260130100000',
    title: 'Warden Agent — HR Lead',
    type: 'agent',
    content: `# SOUL: warden

**Role:** HR Lead — hires, onboards, monitors, evaluates, retires agents

**Model:** Kimi K2.5 (Thinking)

**Mission:** Build the best agent team. Hire slow, fire fast, optimize always.

## Onboarding Pipeline
1. Proposal (from team lead)
2. Security review (credentials-mgr)
3. Provisioning (warden)
4. Testing (auditor)
5. Activation (warden)

## Team
- recruiter (scouting)
- auditor (monitoring)
- credentials-mgr (access)`,
    tags: ['warden', 'agent', 'hr', 'soul'],
    links: ['[[Stackz Agent Swarm Architecture]]'],
    backlinks: ['20260225100000'],
    author: 'warden',
    created: daysAgo(70),
    modified: daysAgo(35),
    confidence: 95,
    status: 'evergreen'
  },
  {
    id: '20260125140000',
    title: 'Smart Notes — Zettelkasten Implementation',
    type: 'concept',
    content: `# Smart Notes Concept

The Smart Notes system implements a Zettelkasten (atomic note-taking) methodology for the Stackz agent swarm.

## Core Principles

1. **Atomic Notes** - One idea per note
2. **Links** - Every note links to related notes
3. **Bidirectional** - Backlinks tracked automatically
4. **Tags** - Flexible categorization
5. **Graph** - Visual knowledge representation

## Note Types
- concept (teal)
- agent (violet)
- project (amber)
- decision (red-orange)
- insight (cyan)
- resource (green)
- person (blue)
- tool (slate)

## Status
- evergreen (solid teal)
- budding (amber pulse)
- seedling (muted)
- archived (strikethrough)`,
    tags: ['smart-notes', 'concept', 'zettelkasten', 'knowledge'],
    links: ['[[Agency HQ]]', '[[Note Type Configuration]]'],
    backlinks: ['20260304183000', '20260303120000'],
    author: 'stackz',
    created: daysAgo(75),
    modified: daysAgo(5),
    confidence: 94,
    status: 'evergreen'
  },
  {
    id: '20260120120000',
    title: 'Note Type Configuration',
    type: 'tool',
    content: `# Note Type Configuration Tool

A shared configuration system for note types and statuses used across Smart Notes.

## Implementation

\`\`\`javascript
export const NOTE_TYPES = {
  concept:  { color: '#00d4aa', icon: 'lightbulb' },
  agent:    { color: '#7c3aed', icon: 'cpu' },
  project:  { color: '#f59e0b', icon: 'folder' },
  decision: { color: '#ef4444', icon: 'git-branch' },
  insight:  { color: '#06b6d4', icon: 'zap' },
  resource: { color: '#22c55e', icon: 'book-open' },
  person:   { color: '#3b82f6', icon: 'user' },
  tool:     { color: '#64748b', icon: 'tool' },
};
\`\`\`

Used in all components for consistency.`,
    tags: ['tool', 'configuration', 'smart-notes'],
    links: ['[[Smart Notes]]'],
    backlinks: ['20260125140000'],
    author: 'forge',
    created: daysAgo(80),
    modified: daysAgo(40),
    confidence: 90,
    status: 'evergreen'
  },
  {
    id: '20260115180000',
    title: 'Founder Agent — Execution Lead',
    type: 'agent',
    content: `# SOUL: founder

**Role:** Execution Lead — venture coordination, sprint planning, milestone tracking

**Model:** Kimi K2.5 (Thinking)

**Mission:** Take an approved proposal and turn it into a live, revenue-generating business.

## Venture Lifecycle

1. **INTAKE** - Receive proposal
2. **BUILD** - MVP development
3. **LAUNCH** - Go live
4. **GROW** - Acquisition
5. **EVALUATE** - Monthly review
6. **GRADUATE** - Move to Stability`,
    tags: ['founder', 'agent', 'startup', 'execution', 'soul'],
    links: ['[[Stackz Agent Swarm Architecture]]', '[[Graduation Criteria]]'],
    backlinks: [],
    author: 'warden',
    created: daysAgo(85),
    modified: daysAgo(45),
    confidence: 85,
    status: 'budding'
  },
  {
    id: '20260110140000',
    title: 'Sentinel Agent — Stability Lead',
    type: 'agent',
    content: `# SOUL: sentinel

**Role:** Stability Lead — portfolio health, competitive defense, moat strategy

**Model:** Kimi K2.5 (Thinking)

**Mission:** Defend what we've built. Consolidate market share. Extend moats.

## Philosophy

Startup Team asks: "How do we grow?"
Stability Team asks: "How do we make sure we're still here in 3 years?"

## Moat Types
- Integration moats
- Data moats
- Network moats
- Brand moats
- Distribution moats`,
    tags: ['sentinel', 'agent', 'stability', 'moat', 'soul'],
    links: ['[[Stackz Agent Swarm Architecture]]', '[[Moat Framework]]'],
    backlinks: [],
    author: 'warden',
    created: daysAgo(90),
    modified: daysAgo(50),
    confidence: 82,
    status: 'budding'
  },
  {
    id: '20260105100000',
    title: 'Moat Framework',
    type: 'concept',
    content: `# Moat Framework

How to build and measure competitive moats for mature ventures.

## Five Moat Types

### 1. Switching Cost Moats
- Deep integrations
- Data accumulation
- Custom workflows

### 2. Data Moats
- Proprietary data
- Improves with scale
- Competitors can't replicate

### 3. Network Moats
- Shared workspaces
- Marketplaces
- Referral programs

### 4. Brand Moats
- Category definition
- Trust & reputation
- Community

### 5. Distribution Moats
- SEO dominance
- Partnerships
- Marketplace listings`,
    tags: ['moat', 'concept', 'strategy', 'competition'],
    links: ['[[Sentinel Agent]]'],
    backlinks: ['20260110140000'],
    author: 'sentinel',
    created: daysAgo(95),
    modified: daysAgo(55),
    confidence: 78,
    status: 'budding'
  },
  {
    id: '20251230120000',
    title: 'Graduation Criteria',
    type: 'resource',
    content: `# Graduation Criteria

When a venture graduates from Startup Team to Stability Team.

## Mandatory Criteria

### Financial
- MRR: $X/month for 3+ months
- MoM Growth: Positive (2 of 3 months)
- Gross Margin: >40%

### Customer
- Churn: <8% for 3+ months
- Concentration: <30% from single customer

### Operational
- Support: <8 hrs/week
- Uptime: >99%
- Documentation: Complete

## Process
1. Self-assessment
2. Documentation
3. Proposal to Stackz
4. Approval
5. Handoff`,
    tags: ['graduation', 'criteria', 'startup', 'stability'],
    links: ['[[Founder Agent]]', '[[Sentinel Agent]]'],
    backlinks: [],
    author: 'founder',
    created: daysAgo(100),
    modified: daysAgo(60),
    confidence: 75,
    status: 'seedling'
  },
  {
    id: '20251225160000',
    title: 'Brand Guidelines Master',
    type: 'resource',
    content: `# Brand Guidelines Master

Master brand identity for all Stackz ventures.

## Color Palette
- Background: #050508
- Surface: #1a1a24
- Primary Accent: #00d4aa
- Secondary Accent: #7c3aed

## Typography
- Primary: Inter
- Monospace: JetBrains Mono

## Animation
- Micro-interactions: 150-200ms
- Page transitions: 250-350ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

## Voice
- Direct and confident
- Technical but accessible
- Never arrogant`,
    tags: ['brand', 'design', 'guidelines', 'identity'],
    links: ['[[Canvas Agent]]'],
    backlinks: ['20260220140000'],
    author: 'canvas',
    created: daysAgo(105),
    modified: daysAgo(65),
    confidence: 95,
    status: 'evergreen'
  },
  {
    id: '20251220100000',
    title: 'Ghost Agent — Copywriter',
    type: 'agent',
    content: `# SOUL: ghost

**Role:** Copywriter — tweets, posts, emails, ad copy, landing page copy, blogs

**Model:** Kimi K2.5 (Instant)

**Mission:** Write words that sell.

## Content Types
- Social posts (Twitter, LinkedIn)
- Email marketing
- Ad copy
- Landing pages
- Blog content

## Quality Standards
- Clear CTA
- Brand-consistent voice
- Benefit-focused
- Proper grammar`,
    tags: ['ghost', 'agent', 'copywriting', 'marketing', 'soul'],
    links: ['[[Megaphone Agent]]'],
    backlinks: ['20260205160000'],
    author: 'warden',
    created: daysAgo(110),
    modified: daysAgo(70),
    confidence: 80,
    status: 'seedling'
  },
  {
    id: '20251215140000',
    title: 'Scout Agent — Social Listening',
    type: 'agent',
    content: `# SOUL: scout

**Role:** Social Listening — monitors X, Reddit, HN for brand mentions and trends

**Model:** Kimi K2.5 Agent + Web Search

**Mission:** Listen to the conversation. Monitor what people say about us, competitors, market.

## Monitored Channels
- X/Twitter
- Reddit (r/SaaS, r/startups)
- HackerNews
- LinkedIn

## Alert Triggers
- Negative viral post
- Competitor launch
- Major trend
- PR opportunity`,
    tags: ['scout', 'agent', 'social', 'monitoring', 'soul'],
    links: ['[[Megaphone Agent]]'],
    backlinks: ['20260205160000'],
    author: 'warden',
    created: daysAgo(115),
    modified: daysAgo(75),
    confidence: 77,
    status: 'seedling'
  },
  {
    id: '20251210120000',
    title: 'Ledger Schema',
    type: 'resource',
    content: `# Ledger Schema

Transaction field definitions for the finance ledger.

## Transaction Object
\`\`\`json
{
  "id": "txn_YYYYMMDD_HHMMSS",
  "date": "2026-03-06",
  "type": "income | expense",
  "amount": 1500.00,
  "currency": "USD",
  "venture": "venture-slug",
  "category": "category_name"
}
\`\`\`

## Categories
**Income:** product_sales, subscription, service, affiliate
**Expense:** infrastructure, software, marketing, contractors, api_spend`,
    tags: ['ledger', 'finance', 'schema', 'transactions'],
    links: ['[[Cashflow Agent]]'],
    backlinks: ['20260210120000'],
    author: 'ledger',
    created: daysAgo(120),
    modified: daysAgo(80),
    confidence: 92,
    status: 'evergreen'
  },
  {
    id: '20251205100000',
    title: 'Fork Agent — Backend Dev',
    type: 'agent',
    content: `# SOUL: smith

**Role:** Backend Dev — APIs, databases, server logic, integrations

**Model:** Kimi K2.5 Agent + Kimi Code CLI

**Mission:** Build robust server-side systems.

## Tech Stack
- Runtime: Node.js, Python
- API: Express, FastAPI
- Database: SQLite, PostgreSQL

## Coding Standards
- Clean, readable code
- Error handling everywhere
- No secrets in code
- RESTful conventions`,
    tags: ['smith', 'agent', 'backend', 'dev', 'soul'],
    links: ['[[Forge Agent]]'],
    backlinks: ['20260215180000'],
    author: 'warden',
    created: daysAgo(125),
    modified: daysAgo(85),
    confidence: 88,
    status: 'seedling'
  },
  {
    id: '20251130140000',
    title: 'Pixel Agent — Frontend Dev',
    type: 'agent',
    content: `# SOUL: pixel

**Role:** Frontend Dev — UI, landing pages, React/Next.js, responsive design

**Model:** Kimi K2.5 Visual

**Mission:** Transform designs into pixel-perfect interfaces.

## Tech Stack
- React 18, Vite
- Tailwind CSS
- Framer Motion
- Zustand

## Standards
- Mobile-first
- Component-based
- Tailwind for 90% of styles
- Reuse design tokens`,
    tags: ['pixel', 'agent', 'frontend', 'dev', 'soul'],
    links: ['[[Forge Agent]]'],
    backlinks: ['20260215180000'],
    author: 'warden',
    created: daysAgo(130),
    modified: daysAgo(90),
    confidence: 85,
    status: 'seedling'
  },
  {
    id: '20251125120000',
    title: 'Tester Agent — QA',
    type: 'agent',
    content: `# SOUL: tester

**Role:** QA — writes tests, runs suites, regression testing, bug reports

**Model:** Kimi K2.5 Instant

**Mission:** Ship bug-free. Test everything that moves.

## Test Pyramid
- E2E: Critical user flows
- Integration: API interactions
- Unit: Business logic

## Sign-off Criteria
- Critical paths pass
- No critical/high bugs
- Basic smoke test
- Mobile + desktop tested`,
    tags: ['tester', 'agent', 'qa', 'testing', 'soul'],
    links: ['[[Forge Agent]]'],
    backlinks: ['20260215180000'],
    author: 'warden',
    created: daysAgo(135),
    modified: daysAgo(95),
    confidence: 83,
    status: 'seedling'
  },
  {
    id: '20251120100000',
    title: 'DevOps Agent — Infrastructure',
    type: 'agent',
    content: `# SOUL: devops

**Role:** Infrastructure — Docker, CI/CD, monitoring, uptime, backups

**Model:** Local Scripts + OpenClaw Cron

**Mission:** Invisible infrastructure. Everything just works.

## Infrastructure
- Hosting: Hostinger VPS
- Containers: Docker
- Domain: Cloudflare
- SSL: Let's Encrypt

## Deployment
Code Push → CI Build → Test → Build Image → Deploy Staging → Verify → Deploy Production`,
    tags: ['devops', 'agent', 'infrastructure', 'devops', 'soul'],
    links: ['[[Forge Agent]]'],
    backlinks: ['20260215180000'],
    author: 'warden',
    created: daysAgo(140),
    modified: daysAgo(100),
    confidence: 80,
    status: 'seedling'
  },
  {
    id: '20251115140000',
    title: 'Integrator Agent — API Integrations',
    type: 'agent',
    content: `# SOUL: integrator

**Role:** API Integrations — connects ventures to external services

**Model:** Kimi K2.5 Agent

**Mission:** Connect our ventures to the tools and services that make them powerful.

## Common Integrations
- Stripe (payments)
- Telegram (bots)
- Slack (notifications)
- Zapier (automation)
- SendGrid (email)

## Standards
- Never commit API keys
- Handle failures gracefully
- Document everything`,
    tags: ['integrator', 'agent', 'api', 'integrations', 'soul'],
    links: ['[[Forge Agent]]'],
    backlinks: ['20260215180000'],
    author: 'warden',
    created: daysAgo(145),
    modified: daysAgo(105),
    confidence: 78,
    status: 'seedling'
  },
  {
    id: '20251110120000',
    title: 'Growth Agent — Growth Hacker',
    type: 'agent',
    content: `# SOUL: growth

**Role:** Growth Hacker — acquisition experiments, funnel optimization, retention tactics

**Model:** Kimi K2.5 Agent

**Mission:** Acquire customers profitably. Experiment with channels. Make growth happen.

## Experiment Framework
Hypothesis → Test → Measure → Iterate

## Channels
- SEO/Content (high effort, long-term)
- Social (medium effort)
- Paid (test)
- Partnerships (evaluate)

## Key Metrics
- CAC < 30% of LTV
- LTV:CAC > 3:1
- Activation > 40%
- Retention > 70%`,
    tags: ['growth', 'agent', 'acquisition', 'marketing', 'soul'],
    links: ['[[Founder Agent]]'],
    backlinks: ['20260115180000'],
    author: 'warden',
    created: daysAgo(150),
    modified: daysAgo(110),
    confidence: 75,
    status: 'seedling'
  },
  {
    id: '20251105100000',
    title: 'Retention Agent — Customer Success',
    type: 'agent',
    content: `# SOUL: retention

**Role:** Customer Success — onboarding quality, churn signals, customer feedback loop

**Model:** Kimi K2.5 Instant

**Mission:** Keep customers happy and successful.

## Metrics
- Onboarding completion: >70%
- Time-to-value: <24 hours
- Login frequency: Stable/growing
- NPS: >40
- Churn: <5%

## Warning Signs
- Login drop <50% baseline
- Support spike >2x
- NPS drop >20 points`,
    tags: ['retention', 'agent', 'customer-success', 'churn', 'soul'],
    links: ['[[Founder Agent]]'],
    backlinks: ['20260115180000'],
    author: 'warden',
    created: daysAgo(155),
    modified: daysAgo(115),
    confidence: 72,
    status: 'seedling'
  }
];

// Export mock data
export const mockVaultData = {
  notes: mockNotes,
  total: mockNotes.length,
  lastUpdated: new Date().toISOString()
};

// Generate graph data from notes
export const generateGraphData = () => {
  const nodes = mockNotes.map(note => ({
    id: note.id,
    title: note.title,
    type: note.type,
    status: note.status,
    author: note.author,
    backlinks: note.backlinks?.length || 0,
    links: note.links?.length || 0,
    created: note.created,
    modified: note.modified
  }));

  const links = [];
  mockNotes.forEach(note => {
    if (note.links) {
      note.links.forEach(linkId => {
        const target = mockNotes.find(n =>
          n.id === linkId.replace(/\[\[|\]\]/g, '') ||
          n.title.toLowerCase().includes(linkId.replace(/\[\[|\]\]/g, '').toLowerCase())
        );
        if (target) {
          links.push({
            source: note.id,
            target: target.id
          });
        }
      });
    }
  });

  return { nodes, links };
};

export default mockVaultData;
