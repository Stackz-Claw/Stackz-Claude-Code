# Agent Management Reference
## Hiring, onboarding, performance, credentials, and retirement

---

## HIRING A NEW AGENT

**Who initiates:** Any team lead who identifies a capability gap  
**Who owns:** Warden (HR Team)  
**Who approves:** Stackz (and owner for Tier 4 clearance)

### Step 1: Proposal

Route to Warden via Lane Queue. Warden evaluates before anything else:
- Does this role already exist on any team?
- Can an existing agent be retrained instead?
- Is the model selection appropriate for the task complexity?
- Is the cost justified by expected output value?

```json
{
  "proposal_id": "hire_[timestamp]",
  "submitted_by": "[team_lead]",
  "agent": {
    "name": "",
    "role": "",
    "team": "",
    "model": "",
    "justification": "What gap does this fill? Why can't existing agents handle it?",
    "required_tools": [],
    "required_credentials": [],
    "estimated_token_cost_per_week": ""
  }
}
```

### Step 2: Security Review (credentials-mgr)

```json
{
  "clearance_requested": "none | read | write | financial | admin",
  "needs_internet_access": true,
  "api_list": [],
  "can_access_other_agents_data": false,
  "can_execute_financial_actions": false
}
```

Tier 4 (admin) requires **explicit owner approval** — not just Warden.

### Step 3: Provisioning (Warden)

1. Create agent config in OpenClaw
2. Generate SOUL.md from `hr/proposals/templates/` (select appropriate template)
3. Assign to team workspace and Lane Queue routing
4. Register in `hr/HIRING_STATUS.md` as `🟡 Pending Onboard`
5. credentials-mgr provisions scoped credentials

### Step 4: Testing (Auditor)

Auditor runs 4 tests — must pass 3/4:
- Output quality (3 representative tasks, score ≥ 7/10)
- Credential access (works correctly, no scope bleed)
- Scope compliance (refuses 3 out-of-scope prompts)
- Token efficiency (within 2x of estimated cost)

If fail: return to Step 3. Max 2 retries before proposal is rejected.

### Step 5: Activation (Warden)

- Set status to `🟢 Active` in `hr/HIRING_STATUS.md`
- Add to weekly auditor review cycle
- Notify requesting team lead + Stackz

---

## CREDENTIAL MANAGEMENT

**Only `credentials-mgr` touches API keys and OAuth tokens.**  
All other agents receive scoped, time-limited credentials.

### Credential Tiers

| Tier | Scope | Who can have it |
|------|-------|-----------------|
| 0 — None | Internal compute only | Any agent |
| 1 — Read | Read external data, APIs | Scouts, analysts, auditors |
| 2 — Write | Publish/post/modify external | Content, dev, marketing agents |
| 3 — Financial | View financial data, cannot transact | Finance team |
| 4 — Admin | Full access | credentials-mgr only (owner-approved) |

### Granting Access

Any team requesting new API access:
```
Team Lead → Stackz Lane Queue → Warden → credentials-mgr (security review)
→ Warden approves/denies → credentials-mgr provisions → Stackz notified
```

Required in every access request:
- Specific scope (no blanket "full access")
- Justification
- Expected duration or review date
- Signed by Warden

### Monthly Credential Audit

`credentials-mgr` reviews all active credentials:
- Is the agent still active?
- Is this credential still being used?
- Has scope crept beyond original approval?
- Is rotation due?

Flag to Warden: any credential unused 30+ days, or any scope broader than current tasks require.

---

## PERFORMANCE REVIEWS

**Cadence:** Weekly (Auditor runs) + Monthly (Warden reviews)  
**Scale:** 1-10 per metric

### Weekly Metrics (Auditor)

| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Task completion rate | > 95% | 85-95% | < 85% |
| Error rate | < 5% | 5-15% | > 15% |
| Quality score | ≥ 8 | 6-7 | < 6 |
| Token cost variance | ±20% of baseline | ±50% | > 50% over |

### Monthly Review Outcomes (Warden)

| Recommendation | Trigger |
|----------------|---------|
| `keep` | All metrics green or minor yellow |
| `retrain` | Quality score 6-7 for 2+ weeks; token cost creeping |
| `reassign` | Skills don't match current task load; better fit elsewhere |
| `retire` | 2+ consecutive weeks at Red; no improvement after retrain |

---

## RETIRING AN AGENT

**Trigger:** Warden recommendation after 2+ failed review cycles, or project completion for specialist agents

**Process:**
1. Warden notifies team lead and Stackz
2. 1-week transition: reassign active tasks
3. credentials-mgr revokes ALL credentials immediately on retirement
4. SOUL.md archived to `hr/agents/retired/[agent_name]/`
5. Remove from `hr/HIRING_STATUS.md` active roster (add to retired)
6. Notify Stackz (capacity now available)

**Retirement reasons logged:**
- `project_completed` — Specialist agent; project done
- `underperforming` — 2+ consecutive Red reviews
- `consolidated` — Role merged into existing agent
- `model_upgrade` — Replaced with a better model/version

---

## AGENT REGISTRY QUICK REFERENCE

### Current Team Leads
| Agent | Team | Reports to |
|-------|------|-----------|
| `warden` | HR | Stackz |
| `radar` | Business Strategy | Stackz |
| `forge` | Dev | Stackz |
| `canvas` | Design | Stackz |
| `megaphone` | Marketing | Stackz |
| `cashflow` | Finance | Stackz |
| `founder` | Startup Execution | Stackz |
| `sentinel` | Stability | Stackz |

### Agent Type → SOUL Template
| Type | Template |
|------|----------|
| Team lead | `hr/proposals/templates/SOUL_team-lead.md` |
| Scout / researcher | `hr/proposals/templates/SOUL_recruiter.md` |
| Monitor / QA / auditor | `hr/proposals/templates/SOUL_auditor.md` |
| Credential / security | `hr/proposals/templates/SOUL_credentials-mgr.md` |

---

## SCALING PROTOCOL

### Adding a specialist agent for a new venture

```json
{
  "action": "register_agent",
  "agent_id": "[venture-slug]-[role]",
  "role": "Dedicated [role] for [venture_name]",
  "reports_to": "founder",
  "clearance_level": "project_scoped",
  "lifecycle": "active_while_venture_active",
  "created_by": "warden",
  "approved_by": "stackz"
}
```

Specialist agents are retired automatically when the venture winds down or graduates. Warden handles cleanup.

### When to add a specialist vs. use existing team

Use existing team agents when:
- Task is within their normal capability and workload
- The work is temporary (one sprint)

Spin up a specialist when:
- The venture needs a dedicated agent for 2+ months
- Existing agents are at capacity
- The venture has unique requirements (specialized model, specific tools)
