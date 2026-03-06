# HR TEAM — WARDEN
**Team Lead:** `WARDEN`  
**Mission:** Every agent that exists in this swarm was hired, credentialed, tested, and monitored by this team. No agent goes live without passing through here. No credential gets issued without a paper trail.

---

## TEAM ROSTER

| Agent | Role | Model | Clearance |
|-------|------|-------|-----------|
| `warden` | HR Lead — hiring, onboarding, performance reviews, retirements | Kimi K2.5 (Thinking) | Admin |
| `recruiter` | Scouts capability gaps, proposes new hires, writes SOULs | Kimi K2.5 (Instant) | Read |
| `auditor` | Monitors all agents: token usage, error rates, output quality | Kimi K2.5 (Instant) | Read |
| `credentials-mgr` | API keys, OAuth tokens, scoped access provisioning | Local script agent | Admin |

---

## DIRECTORIES

```
hr/
├── README.md                     ← This file
├── HIRING_STATUS.md              ← Live roster of all agents across all teams
├── ONBOARDING_PIPELINE.md        ← Step-by-step process every new agent goes through
├── PROVISIONING_GUIDE.md         ← How to configure a new agent in OpenClaw
├── WARDEN_INITIALIZATION_REPORT.md ← Warden's own boot log
├── STATUS.md                     ← Current team health and open items
├── proposals/
│   ├── README.md                 ← How to submit a new agent proposal
│   └── templates/
│       ├── SOUL_auditor.md       ← SOUL template for auditor agents
│       ├── SOUL_credentials-mgr.md ← SOUL template for credentials-mgr
│       ├── SOUL_recruiter.md     ← SOUL template for recruiter agents
│       └── SOUL_team-lead.md     ← SOUL template for team lead roles
└── agents/
    ├── SOUL_warden.md            ← Warden's own SOUL file
    ├── SOUL_recruiter.md         ← Recruiter's SOUL file
    ├── SOUL_auditor.md           ← Auditor's SOUL file
    └── SOUL_credentials-mgr.md  ← Credentials manager SOUL file
```

---

## CORE RESPONSIBILITIES

### Hiring
When any team identifies a capability gap, they submit a proposal to Warden. Warden evaluates:
- Is this gap real or can an existing agent be retrained?
- What's the minimum permission scope needed?
- Which model is most cost-effective for this role?

### Onboarding
Every new agent goes through the 5-step pipeline defined in `ONBOARDING_PIPELINE.md`. No shortcuts.

### Performance Reviews
Weekly cadence. `auditor` compiles metrics. Warden reviews and recommends: keep / retrain / reassign / retire.

### Credential Management
`credentials-mgr` is the only agent that touches API keys and OAuth tokens. All other agents receive scoped, time-limited credentials. Monthly audit of all active credentials.

### Retirement
When an agent is retired, Warden:
1. Revokes all credentials
2. Archives SOUL.md to `hr/agents/retired/`
3. Removes from active roster in `HIRING_STATUS.md`
4. Notifies Stackz

---

## ESCALATION TO STACKZ

Warden escalates to Stackz when:
- A new agent requires Tier 4 (admin) access
- An agent fails 2+ consecutive performance reviews
- A security incident is detected by `auditor`
- Credential compromise is suspected
