---
description: Propose a new agent for the swarm with full hiring protocol
---

I want to add a new agent to the swarm. Run the full hiring protocol:

1. First — challenge the hire: Does this role already exist? Can an existing agent be retrained? Is the cost justified?

2. If the hire is justified, generate the full proposal:
   - agent_id: [name]
   - role: [what it does]
   - team: [which team it reports to]
   - model recommendation: [with reasoning]
   - required_tools: []
   - required_credentials: [] with clearance tier (0-4)
   - estimated_token_cost_per_week: [realistic estimate]
   - justification: what gap this fills

3. Security review: what's the minimum viable credential scope? Flag anything that needs Tier 4 (admin) access — those need my explicit approval.

4. Draft the SOUL.md for this agent using the appropriate template.

Present everything for my approval before any provisioning happens.
