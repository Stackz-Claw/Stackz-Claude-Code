# 🧠 Brainstorm & Idea Generation Workflow

## Overview

This workflow combines **Brainstorming** and **Idea Generation** into a unified process that runs until **3 new ideas** are created. It is designed to run **every morning**.

---

## 🎯 Workflow Goal

**Generate 3 new actionable ideas** through structured brainstorming and idea development.

---

## ⏰ Schedule

| Setting | Value |
|---------|-------|
| **Frequency** | Daily (Morning) |
| **Run Time** | 8:00 AM - until completion |
| **Target** | 3 new ideas generated |
| **Status** | Ready to schedule |

---

## 🔄 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MORNING IDEA GENERATION                            │
│                           ┌───────────────────┐                             │
│                           │  ☀️ WAKE UP &     │                             │
│                           │  CONTEXT SETUP    │                             │
│                           └─────────┬─────────┘                             │
│                                     │                                        │
│                                     ▼                                        │
│                           ┌───────────────────┐                             │
│                           │  📊 CURRENT       │                             │
│                           │  IDEAS COUNT: 0   │                             │
│                           └─────────┬─────────┘                             │
│                                     │                                        │
│                                     ▼                                        │
│                          ╔═════════════════════╗                             │
│                          ║   🔄 LOOP START     ║                             │
│                          ║                     ║                             │
│                          ║  Target: 3 ideas    ║                             │
│                          ╚═════════╤═══════════╝                             │
│                                    │                                          │
│          ┌────────────────────────┼────────────────────────┐              │
│          │                        │                        │              │
│          ▼                        ▼                        ▼              │
│   ┌──────────────┐        ┌──────────────┐        ┌──────────────┐       │
│   │   STAGE 1    │        │   STAGE 2    │        │   STAGE 3    │       │
│   │  BRAINSTORM  │───────▶│   FILTER     │───────▶│   DEVELOP    │       │
│   │              │        │              │        │              │       │
│   └──────────────┘        └──────────────┘        └──────────────┘       │
│          │                        │                        │              │
│          │                        │                        │              │
│          └────────────────────────┼────────────────────────┘              │
│                                   │                                          │
│                                   ▼                                          │
│                          ┌───────────────────┐                              │
│                          │   💾 SAVE IDEA    │                              │
│                          │   TO NOTEPAD      │                              │
│                          └─────────┬─────────┘                              │
│                                    │                                         │
│                                    ▼                                         │
│                          ┌───────────────────┐                              │
│                          │   📈 IDEAS        │                              │
│                          │   COUNT: +1       │                              │
│                          └─────────┬─────────┘                              │
│                                    │                                         │
│                                    ▼                                         │
│                          ╔═════════════════════╗                            │
│                          ║   ❓ 3 IDEAS?      ║                            │
│                          ║                     ║                            │
│                          ║  YES → ✅ COMPLETE ║                            │
│                          ║  NO  → 🔄 LOOP     ║                            │
│                          ╚═════════════════════╝                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Process

### Stage 1: Brainstorm 🔥

| Step | Action | Description |
|------|--------|-------------|
| 1.1 | **Gather Context** | Review current projects, problems, and opportunities |
| 1.2 | **Seed Questions** | Ask: "What if...", "How might we...", "What about..." |
| 1.3 | **Rapid Fire** | Generate 10+ raw ideas in 5 minutes (no filtering) |
| 1.4 | **Cluster** | Group similar ideas together |

### Stage 2: Filter 🔍

| Step | Action | Description |
|------|--------|-------------|
| 2.1 | **Evaluate** | Score each idea on: Impact (1-5), Feasibility (1-5), Originality (1-5) |
| 2.2 | **Select Top** | Keep only ideas with total score ≥ 10 |
| 2.3 | **Validate** | Check if idea aligns with project goals |

### Stage 3: Develop 📐

| Step | Action | Description |
|------|--------|-------------|
| 3.1 | **Flesh Out** | Write 2-3 sentences describing the idea |
| 3.2 | **Identify Benefits** | List 3 key benefits of implementing this idea |
| 3.3 | **Note Risks** | Document 1-2 potential challenges |
| 3.4 | **Next Steps** | Define immediate action (1 sentence) |

### Stage 4: Save & Track 💾

| Step | Action | Description |
|------|--------|-------------|
| 4.1 | **Record** | Save idea to Vault Notepad with timestamp |
| 4.2 | **Tag** | Add tags: `idea`, `brainstorm`, `morning-session` |
| 4.3 | **Increment** | Update counter: ideas_generated += 1 |
| 4.4 | **Check** | If counter < 3, loop back to Stage 1 |

---

## 📋 Execution Checklist

- [ ] Morning trigger activates workflow
- [ ] Load previous session context (if any)
- [ ] Begin brainstorming cycle
- [ ] Filter and select ideas
- [ ] Develop each idea fully
- [ ] Save to Vault Notepad
- [ ] Increment idea counter
- [ ] Check if 3 ideas reached
- [ ] If yes → mark complete, send notification
- [ ] If no → continue loop

---

## 🎯 Success Criteria

| Metric | Target | Actual |
|--------|--------|--------|
| Ideas Generated | 3 | — |
| Completion Time | < 30 min | — |
| Ideas Saved to Vault | 3 | — |
| Notification Sent | Yes | — |

---

## 🔔 Post-Run Actions

When the workflow completes:

1. **Summary Report** — Display count of ideas generated
2. **Quick Review** — Show titles of 3 new ideas
3. **Export Option** — Option to export ideas to markdown
4. **Schedule Next** — Auto-schedule next morning run

---

## 📅 Scheduling Instructions

### Cron Expression

```
0 8 * * *  # 8:00 AM daily
```

### Alternative: Claude Code Loop

```
/loop 24h /brainstorm-ideas --target 3
```

---

## 🔗 Related Workflows

| Workflow | Description |
|----------|-------------|
| [Idea Refinement](./idea-refinement.md) | Takes generated ideas and fleshes them out into full proposals |
| [Launch Planning](./launch-planning.md) | Turns approved ideas into actionable launch plans |
| [Task Decomposition](./task-decomposition.md) | Breaks down ideas into implementable tasks |

---

*Created: 2026-03-11*
*Last Updated: 2026-03-11*
*Status: Ready to Schedule*
