## Instructions

You are being asked to write an incident report, outage communication, or postmortem. These documents serve two distinct audiences and two distinct moments:

1. **During the incident** — real-time updates to affected employees and stakeholders. Tone: calm, factual, action-oriented. Goal: tell people what's happening, what's being done, and what to do.
2. **After the incident** — a postmortem/retrospective that explains what happened, why, and how it will be prevented. Tone: blameless, analytical, forward-looking. Goal: build trust and capture learnings.

Before writing, clarify:
- Are we writing a **live update** or a **postmortem**?
- What was the incident? (service/system affected, start time, current status)
- Who is the audience? (all employees, customers, specific teams, leadership)
- What is the current status? (ongoing, resolved, monitoring)

---

## Live Incident Update Format

Use this during an active incident or immediately after resolution. Keep it short, factual, and free of speculation.

```
🔴 [INCIDENT] / 🟡 [MONITORING] / 🟢 [RESOLVED] — [Service/System Name]
[One sentence: what is affected and current status]

**Status**: [Investigating / Identified / Mitigating / Resolved]
**Started**: [Time + timezone]
**Resolved**: [Time + timezone, or "Ongoing"]

**What's happening**:
[2-3 sentences max. Describe symptoms only — what users/employees are experiencing. No speculation about cause until identified.]

**What we're doing**:
[1-2 sentences. The specific action being taken right now.]

**Who is affected**:
[Be specific: "All users in the EU region" or "Employees using the internal dashboard" — not "some users"]

**Next update**: [Specific time, e.g., "30 minutes" or "by 3:00 PM PT"]

— [Team/On-call name]
```

**Tone rules for live updates:**
- Never speculate about cause before it's confirmed ("we believe it may be..." → remove)
- Never minimize ("just a small issue") or catastrophize
- Always give a next-update time so people stop asking
- Use 🔴 for active/investigating, 🟡 for identified/mitigating/monitoring, 🟢 for fully resolved
- Update the status emoji as the incident progresses

---

## Postmortem / Incident Report Format

Use this 24–72 hours after resolution. The goal is a blameless, honest account of what happened and how to prevent recurrence.

```
# Incident Report: [Service/System] — [Date]

**Severity**: [SEV-1 / SEV-2 / SEV-3 or equivalent]
**Duration**: [Start time] → [End time] ([total duration])
**Status**: Resolved
**Author(s)**: [Names or teams responsible for the report]

---

## Summary
[2–3 sentences. What happened, how long it lasted, and the business/user impact in plain language. Someone who wasn't involved should fully understand the incident from this paragraph alone.]

## Timeline
| Time (PT) | Event |
|---|---|
| HH:MM | Incident started / first symptom observed |
| HH:MM | Alert fired / first human awareness |
| HH:MM | [Key diagnostic step] |
| HH:MM | Root cause identified |
| HH:MM | Fix deployed |
| HH:MM | Incident resolved / all systems normal |

## Root Cause
[1–3 sentences. The specific technical or process failure that caused the incident. Be precise — "a misconfigured load balancer rule" not "a configuration issue."]

## Impact
- **Users/employees affected**: [Number or percentage, with scope]
- **Duration**: [X hours Y minutes]
- **Services affected**: [List]
- **Business impact**: [Revenue, SLA breach, support tickets, etc. if known]

## What Went Well
- [Thing 1: e.g., "Alerting fired within 2 minutes of first error"]
- [Thing 2: e.g., "On-call rotation responded quickly"]
- [Thing 3: e.g., "Rollback procedure worked as designed"]

## What Went Wrong
- [Thing 1: e.g., "Alert threshold was set too high, delaying detection by 18 minutes"]
- [Thing 2: e.g., "Runbook for this service was outdated"]

## Action Items
| Action | Owner | Due date |
|---|---|---|
| [Specific fix or improvement] | [Team/person] | [Date] |
| [Runbook update] | [Team/person] | [Date] |
| [Monitoring improvement] | [Team/person] | [Date] |

## Supporting Links
- [Link to alert/dashboard]
- [Link to related PR or config change]
- [Link to on-call log or chat thread]
```

**Tone rules for postmortems:**
- **Blameless**: Focus on systems and processes, not individual errors. "The deploy process lacked a canary stage" not "Bob pushed bad code."
- **Honest**: Don't soften the impact. If it was bad, say so clearly — sanitizing erodes trust.
- **Forward-looking**: The action items section is the most important part. Empty or vague action items undermine the whole document.
- **Specific**: "A bug in the payment retry logic" beats "an engineering error."

---

## Worked Example: Live Update

```
🟡 [MONITORING] — Internal Dashboard (auth service)

Authentication to the internal dashboard is degraded for approximately 30% of employees. Most users can log in on retry; a small number cannot log in at all.

**Status**: Mitigating
**Started**: 2:14 PM PT
**Resolved**: Ongoing

**What's happening**: The auth service is returning intermittent 503 errors, causing login failures for a subset of users. The issue began following a config update at 2:10 PM PT.

**What we're doing**: Engineering has rolled back the config change and is monitoring error rates. Error rate has dropped from 45% to ~12% over the past 10 minutes.

**Who is affected**: All employees attempting to log into the internal dashboard. Read-only access for logged-in users is unaffected.

**Next update**: 3:00 PM PT or sooner if resolved.

— Platform Engineering on-call
```

## Worked Example: Postmortem (abbreviated)

```
# Incident Report: Internal Dashboard Auth — March 3, 2025

**Severity**: SEV-2
**Duration**: 2:14 PM → 3:02 PM PT (48 minutes)
**Status**: Resolved

## Summary
A config change to the auth service introduced an invalid certificate reference, causing intermittent login failures for ~30% of employees for 48 minutes. The issue was resolved by rolling back the config change. No data was lost; no external users were affected.

## Root Cause
A manual config update deployed at 2:10 PM PT referenced a certificate that had been rotated the previous day. The deploy pipeline did not validate certificate references before pushing to production.

## Action Items
| Action | Owner | Due date |
|---|---|---|
| Add certificate reference validation to deploy pipeline | Platform Eng | March 10 |
| Update runbook to include cert rotation checklist | Platform Eng | March 7 |
| Add synthetic login monitor to catch auth degradation faster | Observability | March 14 |
```
