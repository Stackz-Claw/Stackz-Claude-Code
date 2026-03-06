---
name: internal-comms
description: This skill should be used whenever writing any kind of internal company communication. Activate for 3P updates (Progress/Plans/Problems), company newsletters, FAQ responses, status reports, leadership updates, project updates, incident reports, all-hands prep, team announcements, and any other message intended for an internal employee audience. Also activate when someone says things like "write an update for my team," "draft something for Slack," "I need to tell the company about X," "help me communicate this internally," or "how do I announce this?" — even if they don't explicitly name a communication format.
license: Complete terms in LICENSE.txt
---

# Internal Communications

## Quick-Start: Which Format?

| Request type | Load this file |
|---|---|
| Weekly team update / Progress-Plans-Problems / "3P" | `examples/3p-updates.md` |
| Company-wide newsletter / "what happened this week" roundup | `examples/company-newsletter.md` |
| Employee questions / common confusion / "what are people asking" | `examples/faq-answers.md` |
| Incident report / postmortem / outage communication | `examples/incident-report.md` |
| Anything else (announcement, leadership note, project update, etc.) | `examples/general-comms.md` |

**When in doubt, load `examples/general-comms.md`** — it contains the universal principles and a clarifying workflow that works for any format.

---

## How to Use This Skill

1. **Identify the format** from the table above (or ask if unclear)
2. **Load the matching example file** — each file contains formatting rules, tone guidance, a workflow, and a worked example
3. **Gather information** using available tools (Slack, Google Drive, email, calendar) before asking the user — try to arrive pre-loaded with context
4. **Draft, then check** against the formatting rules in the loaded file before presenting output

---

## Universal Principles (Apply to Every Format)

These apply regardless of which example file you load:

**Lead with what matters.** Put the most important information in the first sentence. Busy readers skim; make sure they can't miss the point.

**One idea per sentence.** Internal comms fail when they're dense. If a sentence has more than one verb, consider splitting it.

**Active voice.** "We shipped X" not "X was shipped." "Engineering fixed Y" not "Y was fixed by engineering."

**Data over adjectives.** "We closed 12 new accounts" beats "we had a great sales month." Numbers make vague claims credible.

**Match the audience's context.** Executives need so-what, not how. Individual contributors need actionable detail. Cross-functional audiences need defined acronyms. Always ask: *what does this audience already know?*

**Tone calibration:**
- All-company announcements → professional, warm, inclusive ("we")
- Leadership updates → direct, data-driven, concise
- Team-level updates → casual, specific, matter-of-fact
- Incident comms → calm, factual, action-oriented (never alarmist)

---

## Information Gathering (Before You Write)

When tools are available, gather context proactively — don't ask the user for information you can find yourself:

- **Slack**: Posts with high reaction counts or long reply threads in large channels signal importance
- **Google Drive / Docs**: Recently edited docs with high view counts, especially from senior authors
- **Email**: Messages from executives, or threads with many replies
- **Calendar**: Non-recurring meetings with large attendee lists (product reviews, all-hands, announcements)

Always prefer sources from the relevant time period:
- Past week for Progress/Problems/incidents
- Next week for Plans/upcoming launches

If tools aren't available, ask the user for raw notes — then your job is formatting and polishing, not discovery.

---

## Reference Files

Each file below is self-contained with instructions, formatting rules, and a worked example:

- `examples/3p-updates.md` — Weekly Progress/Plans/Problems format for any team size
- `examples/company-newsletter.md` — Company-wide newsletter for Slack/email distribution
- `examples/faq-answers.md` — Structured Q&A from employee questions across the company
- `examples/incident-report.md` — Incident/outage communications and postmortems
- `examples/general-comms.md` — Universal fallback for any format not listed above
