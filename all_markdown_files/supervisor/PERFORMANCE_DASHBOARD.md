# PERFORMANCE DASHBOARD
*Real-time monitoring system for STACKZ agent swarm*

---

## OVERVIEW

The Performance Dashboard provides real-time visibility into the health, performance, and cost metrics of all agents across the STACKZ architecture. It serves as the primary monitoring interface for the Supervisor team.

---

## DASHBOARD COMPONENTS

### 1. System Health Overview

```
┌─────────────────────────────────────────────────────────────┐
│  STACKZ PERFORMANCE DASHBOARD                    Updated: XX │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │  AGENT   │ │  COST    │ │  ERROR   │ │  TASK    │     │
│  │  HEALTH  │ │  TODAY   │ │  RATE    │ │  COMPLET │     │
│  │   87%   │ │  $XX.XX  │ │   0.3%   │ │   94%    │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## METRICS TRACKED

### Agent Metrics

| Metric | Description | Update Frequency |
|--------|-------------|------------------|
| Tasks Completed | Total tasks completed by agent | Real-time |
| Tasks Failed | Total task failures | Real-time |
| Token Usage | Tokens consumed per task | Per task |
| Cost Per Task | Dollar cost per task completion | Per task |
| Error Rate | Percentage of failed tasks | Hourly |
| Response Time | Average response latency | Hourly |
| Quality Score | Output quality rating (1-10) | Daily |

### Team Metrics

| Metric | Description |
|--------|-------------|
| Active Agents | Number of currently running agents |
| Queue Depth | Tasks waiting in Lane Queue |
| Throughput | Tasks completed per hour |
| Budget Utilization | % of team budget consumed |

### Cost Metrics

| Metric | Description |
|--------|-------------|
| Daily Spend | Total cost per day |
| Weekly Trend | Cost trajectory |
| By Team | Cost breakdown per team |
| By Model | Cost breakdown per AI model |

---

## TEAM HEALTH PANELS

### HR Team — Warden

| Agent | Tasks | Errors | Cost | Status |
|-------|-------|--------|------|--------|
| warden | 45 | 0 | $X | 🟢 |
| recruiter | 12 | 1 | $X | 🟢 |
| auditor | 28 | 0 | $X | 🟢 |
| credentials-mgr | 8 | 0 | $X | 🟢 |

### Marketing Team — Megaphone

| Agent | Tasks | Errors | Cost | Status |
|-------|-------|--------|------|--------|
| megaphone | 23 | 0 | $X | 🟢 |
| ghost | 67 | 2 | $X | 🟢 |
| lens | 45 | 1 | $X | 🟢 |
| director | 8 | 0 | $X | 🟢 |
| scout | 156 | 3 | $X | 🟡 |
| scheduler | 89 | 1 | $X | 🟢 |

### Dev Team — Forge

| Agent | Tasks | Errors | Cost | Status |
|-------|-------|--------|------|--------|
| forge | 18 | 0 | $X | 🟢 |
| smith | 34 | 2 | $X | 🟢 |
| pixel | 29 | 1 | $X | 🟢 |
| tester | 42 | 0 | $X | 🟢 |
| devops | 12 | 0 | $X | 🟢 |
| integrator | 8 | 0 | $X | 🟢 |

### Business — Radar

| Agent | Tasks | Errors | Cost | Status |
|-------|-------|--------|------|--------|
| radar | 12 | 0 | $X | 🟢 |
| analyst | 89 | 4 | $X | 🟡 |
| validator | 23 | 1 | $X | 🟢 |
| pitch | 15 | 0 | $X | 🟢 |

### Design — Canvas

| Agent | Tasks | Errors | Cost | Status |
|-------|-------|--------|------|--------|
| canvas | 8 | 0 | $X | 🟢 |
| palette | 34 | 1 | $X | 🟢 |
| illustrator | 56 | 2 | $X | 🟢 |
| animator | 12 | 0 | $X | 🟢 |
| brand-guard | 78 | 0 | $X | 🟢 |

### Finance — Cashflow

| Agent | Tasks | Errors | Cost | Status |
|-------|-------|--------|------|--------|
| cashflow | 5 | 0 | $X | 🟢 |
| ledger | 234 | 1 | $X | 🟢 |
| forecaster | 8 | 0 | $X | 🟢 |
| billing | 45 | 0 | $X | 🟢 |

---

## ALERT SYSTEM

### Alert Thresholds

| Severity | Condition | Action |
|----------|-----------|--------|
| 🔴 Critical | Error rate > 5% | Immediate page |
| 🟠 High | Error rate > 2% | Alert to Supervisor |
| 🟡 Warning | Error rate > 1% | Log and monitor |
| 🔵 Info | Cost spike > 20% | Weekly report |

### Alert Channels

| Severity | Channel |
|----------|---------|
| Critical | SMS + Slack |
| High | Slack #alerts |
| Warning | Email digest |
| Info | Dashboard only |

---

## COST BREAKDOWN

### By Team (This Month)

| Team | Spend | % of Total |
|------|-------|------------|
| Marketing | $X | XX% |
| Dev | $X | XX% |
| Business | $X | XX% |
| Design | $X | XX% |
| Finance | $X | XX% |
| HR | $X | XX% |

### By Model

| Model | Spend | Tasks |
|-------|-------|-------|
| Kimi K2.5 | $X | X |
| Seedream 3.0 | $X | X |
| Seedance 2.0 | $X | X |
| Claude | $X | X |

---

## PERFORMANCE TRENDS

### Task Completion Rate (7 days)

```
Day    | Completion | Errors
-------|------------|-------
Mon    | 94%        | 0.4%
Tue    | 96%        | 0.2%
Wed    | 91%        | 0.8%
Thu    | 95%        | 0.3%
Fri    | 93%        | 0.5%
Sat    | 89%        | 0.7%
Sun    | 92%        | 0.4%
```

### Cost Trend (30 days)

```
Week   | Spend
-------|-------
W1     | $XXX
W2     | $XXX
W3     | $XXX
W4     | $XXX (projected)
```

---

## ACCESS

- **URL**: [Dashboard URL]
- **Refresh**: Real-time (10s intervals)
- **Access**: Supervisor team + Stackz + Owner

---

## DATA STORAGE

Metrics stored in:
- `supervisor/metrics/AGENT_METRICS.json`
- `supervisor/metrics/COST_TRACKING.json`
- Time-series data in metrics DB
