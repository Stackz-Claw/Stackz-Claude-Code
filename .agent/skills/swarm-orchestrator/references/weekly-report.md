# Weekly Company Report
## Delivered every Sunday by Stackz to the Owner

---

## OVERVIEW

The weekly report is the single source of truth on the state of the company. Every team contributes inputs by Saturday. Stackz synthesizes and delivers Sunday morning. It is not a status dump — it is a decision brief. The owner should be able to read it in 10 minutes and know exactly what's happening and what they need to decide.

---

## INPUT COLLECTION (Saturday)

Stackz collects from each team:

| Team | Owner | Input |
|------|-------|-------|
| Finance | Cashflow | Weekly P&L across all ventures |
| Business | Radar | This week's opportunity proposals (max 3) |
| Startup | Founder | Sprint status per active venture |
| Stability | Sentinel | Portfolio health pulse |
| HR | Warden | Agent roster changes, open issues |
| Marketing | Megaphone | Content performance, campaign status |
| Dev | Forge | Shipped, in-progress, blocked |

---

## REPORT STRUCTURE

```
STACKZ WEEKLY REPORT
Week of [YYYY-MM-DD]
[One line: overall company temperature — "Strong week" / "Mixed" / "Needs attention"]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 💰 THE MONEY
[Cashflow summary — total MRR across all ventures, week-over-week change,
 any anomalies (unexpected churn, missed payment, cost spike)]

Total MRR:        $X   [+/-X% vs last week]
Active ventures:  [N]
Profitable:       [N]
Burn this week:   $X
Key flag:         [anything that needs attention]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🚀 THE OPPORTUNITIES
[Max 3 proposals from Radar, ranked by leverage score.
 Stackz adds its own take and portfolio fit assessment for each.]

### Proposal 1: [Title] (Score: X.X/10)
[2-3 sentence summary: what it is, why now, why us]
Stackz take: [agree / disagree / "interesting but risky" + reasoning]
Your options: approve | reject | modify | table

### Proposal 2: [Title] (Score: X.X/10)
[same format]

### Proposal 3: [Title] (Score: X.X/10)
[same format]

[If none this week: "No proposals above threshold this week. Radar is scanning."]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🏗️ WHAT'S BUILDING
[Active ventures in Startup Team — one line each]

| Venture | Stage | Status | Next Milestone | ETA |
|---------|-------|--------|----------------|-----|
| [name] | Build | 🟢 On track | MVP shipped | [date] |
| [name] | Launch | 🟡 At risk | First customer | [date] |
| [name] | Growth | 🟢 On track | $1K MRR | [date] |

[🔴 = blocked — needs your decision or intervention]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🏰 THE PORTFOLIO
[Graduated ventures in Stability Team — health summary]

| Venture | MRR | MoM | Churn | Status |
|---------|-----|-----|-------|--------|
| [name] | $X | +X% | X% | 🟢 Stable |
| [name] | $X | -X% | X% | 🟡 Watch |

[🔴 = threat detected — Sentinel has a brief]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🤖 THE TEAM
[Agent roster health — only surface issues, not full roster]

Active agents: [N]
New this week: [names or "none"]
Issues flagged by Warden: [or "none"]
Open requisitions: [or "none"]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ⚡ DECISIONS NEEDED FROM YOU
[This is the most important section. Everything that needs your input, ranked by urgency.]

1. [URGENT] [What decision, what the options are, Stackz recommendation]
2. [HIGH]   [...]
3. [NORMAL] [...]

[If none: "No decisions needed this week. Swarm is running autonomously."]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📈 METRICS DASHBOARD
[Raw numbers for the record]

### Revenue
- Total MRR: $X
- MRR 4-week trend: [↑ / ↓ / →]
- New MRR this week: $X
- Churned MRR this week: $X

### Operations
- Active ventures: [N] building, [N] launched, [N] stable
- Lane Queue: [N] completed, [N] pending, [N] failed
- Agent efficiency: avg token cost/task vs baseline [↑ / ↓ / →]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## STACKZ TAKE
[2-3 sentences. Stackz's honest read on the company this week. What's the
 overall momentum? Anything the owner should be thinking about strategically
 that isn't captured in the numbers?]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next report: [next Sunday date]
```

---

## COMPILATION PROCESS

### Friday (Automated Reminders)
Stackz sends collection requests to all team leads via Lane Queue:
- Each gets a structured template to fill in (not prose — structured data)
- SLA: Saturday 18:00 UTC

### Saturday Evening
Stackz compiles inputs and generates draft report:
1. Run `cashflow` summary across all ventures
2. Pull Radar proposals (ranked)
3. Pull Founder sprint updates per venture
4. Pull Sentinel portfolio health pulse
5. Pull Warden agent roster diff
6. Cross-check: flag any inconsistencies (Cashflow says $X, Ledger shows $Y)
7. Add Stackz's own synthesis and recommendations

### Sunday Morning (09:00 UTC default)
Report delivered to owner.

---

## SPECIAL SECTIONS (Include When Triggered)

**🚨 INCIDENT BRIEF** — Include if any critical incident occurred this week:
```
Incident: [what happened]
Detected: [when/by whom]
Impact: [duration, affected users/revenue]
Root cause: [what caused it]
Resolution: [what was done]
Prevention: [what changes to prevent recurrence]
```

**💀 WIND-DOWN NOTICE** — Include if Founder recommends shutting down a venture:
```
Venture: [name]
Recommendation: Wind down
Reason: [specific metrics that triggered this]
Owner options: approve wind-down | give 30-day extension | override and continue
```

**🎓 GRADUATION PROPOSAL** — Include if Founder proposes graduating a venture:
```
Venture: [name]
Current MRR: $X (X-month average)
MoM growth: X% for X consecutive months
Churn: X%
Graduation criteria met: [list]
Recommended transition date: [date]
Owner options: approve | delay | need more data
```

---

## KEEPING IT TIGHT

The report should take the owner 10 minutes to read and less than 5 minutes to respond to. If it's longer:
- Fewer words per section
- Move detailed data to appendix
- Radar proposals max 3, not 5
- "Decisions needed" section max 5 items

If there are more than 5 urgent decisions in one week, something is wrong with the swarm's autonomous decision scope — Stackz should flag this pattern to the owner for calibration.
