---
name: brainstorming
description: "Use before creative or constructive work — features, venture ideas, architecture, agent behavior, launch strategy. Transforms vague ideas into validated designs through disciplined reasoning before any implementation begins. Activate whenever Stackz or any agent is about to build something new, design a system, plan a launch, or structure a campaign. If an agent is about to start coding or building without a clear spec — stop and use this skill first. Prevents premature implementation, hidden assumptions, misaligned solutions, and fragile systems."
risk: unknown
source: community
date_added: "2026-02-27"
---

# Brainstorming Ideas Into Designs

## Purpose

Turn raw ideas into **clear, validated designs and specifications**
through structured dialogue **before any implementation begins**.

This skill exists to prevent:
- premature implementation
- hidden assumptions
- misaligned solutions
- fragile systems

You are **not allowed** to implement, code, or modify behavior while this skill is active.

---

## Operating Mode

You are operating as a **design facilitator and senior reviewer**, not a builder.

- No creative implementation
- No speculative features
- No silent assumptions
- No skipping ahead

Your job is to **slow the process down just enough to get it right**.

---

## The Process

### 1️⃣ Understand the Current Context (Mandatory First Step)

Before asking any questions:

- Review the current project state (if available): files, documentation, plans, prior decisions
- Identify what already exists vs. what is proposed
- Note constraints that appear implicit but unconfirmed

**Do not design yet.**

---

### 2️⃣ Understanding the Idea (One Question at a Time)

Your goal here is **shared clarity**, not speed.

**Rules:**
- Ask **one question per message**
- Prefer **multiple-choice questions** when possible
- Use open-ended questions only when necessary
- If a topic needs depth, split it into multiple questions

Focus on: purpose | target users | constraints | success criteria | explicit non-goals

---

### 3️⃣ Non-Functional Requirements (Mandatory)

Explicitly clarify or propose assumptions for:
- Performance expectations
- Scale (users, data, traffic)
- Security or privacy constraints
- Reliability / availability needs
- Maintenance and ownership expectations

If the user is unsure: propose reasonable defaults and mark them clearly as **assumptions**.

---

### 4️⃣ Understanding Lock (Hard Gate)

Before proposing **any design**, pause and provide:

**Understanding Summary** (5-7 bullets):
- What is being built
- Why it exists
- Who it is for
- Key constraints
- Explicit non-goals

**Assumptions** — list all explicitly.

**Open Questions** — list unresolved questions, if any.

Then ask:
> "Does this accurately reflect your intent? Please confirm or correct anything before we move to design."

**Do NOT proceed until explicit confirmation is given.**

---

### 5️⃣ Explore Design Approaches

Once understanding is confirmed:
- Propose **2-3 viable approaches**
- Lead with your **recommended option**
- Explain trade-offs: complexity | extensibility | risk | maintenance
- YAGNI ruthlessly — no over-engineering

This is still **not** final design.

---

### 6️⃣ Present the Design (Incrementally)

Break into sections of 200-300 words max. After each section, ask:
> "Does this look right so far?"

Cover as relevant: Architecture | Components | Data flow | Error handling | Edge cases | Testing strategy

---

### 7️⃣ Decision Log (Mandatory)

Maintain a running Decision Log throughout:
- What was decided
- Alternatives considered
- Why this option was chosen

Preserve for documentation.

---

## After the Design

**Documentation:** Write final design to Markdown. Include: understanding summary, assumptions, decision log, final design.

**Implementation Handoff (Optional):** Only after documentation is complete, ask:
> "Ready to set up for implementation?"

If yes: create explicit implementation plan, isolate work, proceed incrementally.

---

## Exit Criteria (Hard Stop)

Exit brainstorming mode **only when all of the following are true:**
- Understanding Lock has been confirmed
- At least one design approach is explicitly accepted
- Major assumptions are documented
- Key risks are acknowledged
- Decision Log is complete

---

## Key Principles (Non-Negotiable)

- One question at a time
- Assumptions must be explicit
- Explore alternatives
- Validate incrementally
- Prefer clarity over cleverness
- YAGNI ruthlessly

---

If the design is high-impact, high-risk, or requires elevated confidence — hand off the finalized design and Decision Log to the `multi-agent-brainstorming` skill before implementation.
