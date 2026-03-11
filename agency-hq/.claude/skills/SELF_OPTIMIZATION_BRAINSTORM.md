# Self-Optimization Brainstorm Skill

**Purpose:** Identifies internal improvements, skill gaps, and process optimizations for the agency.

**When to use:** During Daily Self-Optimization workflow (Phase 3: Identify).

**NOT for:** Business ideas or revenue generation (use Morning Brainstorm for those).

**MCP Servers:**
- brave-search (for researching best practices, new tools, industry standards)
- x-mcp-server (for community feedback, engagement metrics, brand sentiment)

---

## Focus Areas

This skill analyzes the agency's **internal operations**, not external business:

| Category | Examples |
|----------|----------|
| **Process** | Slow workflows, redundant steps, manual bottlenecks |
| **Skills** | Underutilized skills, missing capabilities, skill gaps |
| **Memory** | Knowledge not being retained, context loss between sessions |
| **Communication** | Agent-to-agent gaps, handoff failures, missing context |
| **Infrastructure** | Missing tooling, slow builds, unreliable services |
| **Automation** | Manual tasks that could be automated |

---

## Brainstorming Process

### Step 1: Analyze Current State

Review:
- Recent workflow execution times
- Skills loaded and their usage frequency
- Error logs and failure patterns
- Memory retrieval success rates
- Socket event gaps

### Step 2: Identify Patterns

For each data source, ask:
- What's taking longer than expected?
- What keeps failing?
- What do I keep looking up that I should remember?
- What manual steps happen repeatedly?
- Which skills never get used?

### Step 3: Score Opportunities

| Criteria | Score Range | Description |
|----------|-------------|-------------|
| **Impact** | 1-5 | How much would fixing this improve operations? |
| **Effort** | 1-5 | How hard is it to fix? (1=easy, 5=hard) |
| **Urgency** | 1-5 | How critical is this now? |

**Priority = Impact × Urgency / Effort**

Only pursue items with priority ≥ 6.

### Step 4: Draft Proposals

For each high-priority item:
1. **Title** — Clear name of the improvement
2. **Problem** — What's broken or missing
3. **Solution** — How to fix it
4. **Success Criteria** — How to measure improvement
5. **Risk** — What could go wrong

---

## Output

This skill outputs optimization proposals in the format expected by Self-Optimization workflow:
- Formatted for Approval UI
- Tagged with `self-optimization` and relevant category

---

## Example

**Analysis:** "I keep losing context when switching between morning and afternoon sessions. Memory retrieval works but priorities get lost."

**Draft Proposal:**
- **Title:** Session Context Preservation
- **Problem:** Priority context lost between sessions
- **Solution:** Auto-summarize priorities to memory at session end, reload at start
- **Success Criteria:** Priority recall > 90% after 8hr gap
- **Risk:** Memory bloat if too much saved

---

**This skill is separate from the Business Brainstorm skill, which focuses on revenue-generating ideas for the startup pipeline.**