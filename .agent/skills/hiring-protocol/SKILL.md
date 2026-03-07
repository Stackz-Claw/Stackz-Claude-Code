# Hiring Protocol

## Description
Propose a new agent for the swarm with full hiring protocol

## Trigger Phrases
- "add a new agent"
- "hire an agent"
- "new agent proposal"
- "agent requisition"

## Process

### Phase 1: Challenge the Hire
First — challenge the hire:
- Does this role already exist?
- Can an existing agent be retrained?
- Is the cost justified?

### Phase 2: Generate Full Proposal
If the hire is justified, generate:
- agent_id: [name]
- role: [what it does]
- team: [which team it reports to]
- model recommendation: [with reasoning]
- required_tools: []
- required_credentials: [] with clearance tier (0-4)
- estimated_token_cost_per_week: [realistic estimate]
- justification: what gap this fills

### Phase 3: Security Review
- What's the minimum viable credential scope?
- Flag anything that needs Tier 4 (admin) access — those need explicit owner approval

### Phase 4: Draft SOUL
Draft the SOUL.md for this agent using the appropriate template.

## Important
Present everything for owner approval before any provisioning happens.
