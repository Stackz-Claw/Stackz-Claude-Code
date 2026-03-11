# 🧠 Brainstorm & Idea Generation Workflow

## Overview

This workflow generates **profitable business ideas** for the agency. It runs every morning until **3 new revenue-generating ideas** are created, then routes them through the startup pipeline.

**Output Pipeline:** Ideas → Idea Refinement → Launch Planning → Task Decomposition → Startup Sub-Agent Team

**MCP Servers:**
- brave-search (for market research, competitor analysis, trending topics)
- x-mcp-server (for social listening, trend detection, market sentiment, **bookmark mining**)

---

## 🎯 Workflow Goal

**Generate 3 new profitable business ideas** that could generate revenue for the agency.

---

## ⏰ Schedule

| Setting | Value |
|---------|-------|
| **Frequency** | Daily (Morning) |
| **Run Time** | 8:00 AM - until completion |
| **Target** | 3 profitable business ideas |
| **Output** | Startup Pipeline (Refinement → Launch → Tasks → Execution) |
| **Status** | Ready to schedule |

---

## 🔄 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PROFITABLE IDEA GENERATION                             │
│                        (Startup Pipeline)                                  │
│                           ┌───────────────────┐                            │
│                           │  ☀️ MORNING       │                            │
│                           │  TRIGGER          │                            │
│                           └─────────┬─────────┘                            │
│                                     │                                        │
│                                     ▼                                        │
│                           ┌───────────────────┐                            │
│                           │  💰 REVENUE      │                            │
│                           │  FOCUS CHECK     │                            │
│                           └─────────┬─────────┘                            │
│                                     │                                        │
│                                     ▼                                        │
│                          ╔═════════════════════╗                            │
│                          ║   🔄 LOOP START     ║                            │
│                          ║                     ║                            │
│                          ║  Target: 3 ideas    ║                            │
│                          ║  (must be profitable)║                           │
│                          ╚═════════╤═══════════╝                            │
│                                    │                                          │
│          ┌────────────────────────┼────────────────────────┐              │
│          │                        │                        │              │
│          ▼                        ▼                        ▼              │
│   ┌──────────────┐        ┌──────────────┐        ┌──────────────┐       │
│   │   STAGE 1    │        │   STAGE 2    │        │   STAGE 3    │       │
│   │  BRAINSTORM  │───────▶│   FILTER     │───────▶│   DEVELOP    │       │
│   │  (Revenue)   │        │  (Profitable)│        │  (Business)  │       │
│   └──────────────┘        └──────────────┘        └──────────────┘       │
│          │                        │                        │              │
│          │                        │                        │              │
│          └────────────────────────┼────────────────────────┘              │
│                                   │                                          │
│                                   ▼                                          │
│                          ┌───────────────────┐                              │
│                          │   💾 SAVE TO     │                              │
│                          │   STARTUP PIPELINE│                             │
│                          └─────────┬─────────┘                              │
│                                    │                                         │
│                                    ▼                                         │
│                          ┌───────────────────┐                              │
│                          │   📈 IDEAS       │                              │
│                          │   COUNT: +1      │                              │
│                          └─────────┬─────────┘                              │
│                                    │                                         │
│                                    ▼                                         │
│                          ╔═════════════════════╗                            │
│                          ║   ❓ 3 PROFITABLE   ║                            │
│                          ║       IDEAS?       ║                            │
│                          ║                     ║                            │
│                          ║  YES → 📤 PIPELINE ║                            │
│                          ║  NO  → 🔄 LOOP     ║                            │
│                          ╚═════════════════════╝                            │
└─────────────────────────────────────────────────────────────────────────────┘

AFTER COMPLETION:
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STARTUP PIPELINE                                    │
│                                                                             │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌────────┐ │
│   │ IDEA         │───▶│ LAUNCH       │───▶│ TASK         │───▶│ STARTUP│ │
│   │ REFINEMENT   │    │ PLANNING     │    │ DECOMPOSITION│    │ SUB-   │ │
│   │              │    │              │    │              │    │ AGENT  │ │
│   └──────────────┘    └──────────────┘    └──────────────┘    │ TEAM   │ │
│                                                                             └────────┘
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Process

### Stage 1: Revenue-Focused Brainstorm 🔥

| Step | Action | Description |
|------|--------|-------------|
| 1.0 | **Sync X Bookmarks** | Call `x-mcp-server.get_bookmarks()` to pull saved tweets for research |
| 1.1 | **Revenue Context** | Review: current revenue, market gaps, customer pain points, competitive opportunities |
| 1.2 | **Bookmark Mining** | Analyze bookmarks for: product ideas, pain points, competitor mentions, revenue signals |
| 1.3 | **Seed Questions** | Ask: "What would people pay for?", "What's missing in the market?", "What could we charge for?" |
| 1.4 | **Rapid Fire** | Generate 10+ business ideas in 5 minutes (must have monetization path) |
| 1.5 | **Cluster** | Group similar ideas by business model |

### Stage 2: Profitability Filter 🔍

| Step | Action | Description |
|------|--------|-------------|
| 2.1 | **Evaluate** | Score each idea on: Revenue Potential (1-5), Time to Market (1-5), Scalability (1-5) |
| 2.2 | **Select Top** | Keep only ideas with total score ≥ 12 |
| 2.3 | **Validate** | Must answer: "Who pays?", "How much?", "Why us?" |

### Stage 3: Business Development 📐

| Step | Action | Description |
|------|--------|-------------|
| 3.1 | **Business Case** | Write: target customer, pricing model, revenue projection |
| 3.2 | **Unique Value** | What makes this different from competitors? |
| 3.3 | **Go-to-Market** | How do we acquire first paying customer? |
| 3.4 | **Next Step** | Ready for Idea Refinement |

### Stage 4: Pipeline & Route 💾

| Step | Action | Description |
|------|--------|-------------|
| 4.1 | **Save to Pipeline** | Add to: `Agency HQ/Ideas/startup-pipeline/` |
| 4.2 | **Tag** | Add tags: `idea`, `profitable`, `startup-pipeline` |
| 4.3 | **Route** | Trigger Idea Refinement workflow |
| 4.4 | **Check** | If counter < 3, loop back to Stage 1 |

---

## 📋 Execution Checklist

- [ ] Morning trigger activates workflow
- [ ] Revenue context loaded
- [ ] Generate profitable business ideas only
- [ ] Filter for monetization potential
- [ ] Develop business case for each idea
- [ ] Save to startup pipeline
- [ ] Route to Idea Refinement
- [ ] Continue until 3 profitable ideas

---

## 🎯 Success Criteria

| Metric | Target | Actual |
|--------|--------|--------|
| Profitable Ideas Generated | 3 | — |
| Completion Time | < 30 min | — |
| Ideas Routed to Pipeline | 3 | — |
| Ready for Launch Planning | 3 | — |

---

## 🔔 Post-Run Actions

When the workflow completes:

1. **Summary Report** — Display count of profitable ideas generated
2. **Pipeline Notification** — Send to Startup Sub-Agent Team
3. **Auto-Queue** — Queue ideas for Idea Refinement workflow

---

## 📅 Scheduling Instructions

### Cron Expression
```
0 8 * * *  # 8:00 AM daily
```

---

## 🔗 Startup Pipeline

| Stage | Workflow | Description |
|-------|----------|-------------|
| 1 | **Brainstorm** | Generate 3 profitable business ideas |
| 2 | [Idea Refinement](./idea-refinement.md) | Flesh out into full proposals |
| 3 | [Launch Planning](./launch-planning.md) | Turn into actionable launch plans |
| 4 | [Task Decomposition](./task-decomposition.md) | Break down into implementable tasks |
| 5 | **Startup Sub-Agent Team** | Execute the business |

---

*Created: 2026-03-11*
*Last Updated: 2026-03-11*
*Status: Ready to Schedule*
*Focus: Profitable Business Ideas Only*