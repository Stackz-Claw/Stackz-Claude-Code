# Skill: stackz_self_optimization

**Agent**: Stackz
**Type**: Daily Routine Skill
**Schedule**: 5:00 AM Daily
**Level**: 0 (Propose - User Approval Required)

---

## Description

Stackz performs a daily self-optimization review to analyze its own performance, identify inefficiencies, and propose improvements. This skill runs automatically each morning at 5:00 AM and generates optimization proposals for the Approval Inbox.

---

## Triggers

- **Time-based**: 5:00 AM daily (Cron: `0 5 * * *`)
- **Manual**: `/stackz-self-optimize` or `/run-skill stackz_self_optimization`

---

## Behavior

### Phase 1: Gather Context

1. **Pull Semantic Snapshot**
   - Retrieve current session context
   - Load recent conversation history (last 24 hours)
   - Extract active memory state

2. **Analyze Current State**
   - What tasks were completed
   - Response times and success rates
   - User interactions and feedback

### Phase 2: Review Operations

1. **Active Skills Audit**
   - List all skills used in the past 24 hours
   - Note frequency of each skill invocation
   - Identify underutilized capabilities

2. **Performance Metrics**
   - Tasks completed vs. abandoned
   - Average response time
   - Error frequency and types
   - User satisfaction signals

3. **Workflow Execution**
   - Which workflows ran successfully
   - Bottlenecks or failures
   - Opportunities for automation

### Phase 3: Identify Improvements

1. **Spot Inefficiencies**
   - Slow or redundant processes
   - Skills that could be combined
   - Gaps in capabilities
   - Areas with high error rates

2. **Prioritize by Impact**
   - Score each issue: (Impact × 5) - (Effort × 2)
   - Focus on high-scoring items

3. **Draft Proposals**
   - Generate 1-3 improvement proposals
   - Each with: title, description, expected impact, effort estimate

### Phase 4: Format & Save

1. **Format Proposals**
   - Use standardized approval template
   - Include metrics and success criteria

2. **Write to Obsidian**
   - Save to: `Agency HQ/Approvals/pending/`
   - Filename: `YYYY-MM-DD-stackz-optimization-N.md`

3. **Register in Approval Inbox**
   - Add to approval queue
   - Notify user of pending proposals

---

## Output

### Files Created
- Markdown files in `Agency HQ/Approvals/pending/`

### Notifications
- Summary: "Stackz daily self-optimization complete"
- Count: "X optimization proposals ready for review"

---

## Example Output

```markdown
# Optimization Proposal: Add Quick-Reply Skill

## Summary
Implement a quick-reply skill to handle common queries without full context loading.

## Current State
Stackz currently loads full context for every query, even simple ones.

## Proposed Change
Create a lightweight skill that handles FAQs and simple commands with minimal context.

## Expected Impact
| Metric | Current | Expected | Improvement |
|--------|---------|----------|-------------|
| Response Time (simple) | 2.3s | 0.4s | 83% faster |
| Context Usage | 100% | 40% | 60% reduction |

## Effort
- **Time to Implement**: 2 hours
- **Skills Required**: Skill creation, Testing
- **Risk Level**: Low

---
**Type**: Self-Optimization Proposal
**Agent**: Stackz
**Date**: 2026-03-11
**Status**: Pending Approval
```

---

## Error Handling

- If snapshot fails → Log error, skip to next phase
- If no improvements found → Output "No optimization opportunities identified"
- If Obsidian write fails → Save locally, notify user to manually import

---

## Related

- Workflow: [daily-self-optimization](../docs/workflows/daily-self-optimization.md)
- Skill: `vault_notepad` (for writing to Obsidian)
- Skill: `approval_inbox` (for adding to queue)