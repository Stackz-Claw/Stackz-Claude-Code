# OPPORTUNITY LOG
*Running log of all scanned opportunities in the RADAR pipeline*

---

## Overview

This is the running log of all opportunities scanned by the RADAR team. Every opportunity that passes initial filtering gets recorded here. The log serves as the single source of truth for pipeline status and historical decisions.

---

## Logging Guidelines

- Add new opportunities at the top of the log (most recent first)
- Update status as opportunities progress through the pipeline
- Archive rejected or expired opportunities to `archived/`
- Use the ID format: `opp_YYYYMMDD_NNN`
- Include scoring breakdown for every entry
- Link to validation reports and proposals where applicable

---

## Score Thresholds

| Score | Decision | Action |
|-------|----------|--------|
| ≥80 | Validate | Enters validation pipeline |
| 60-79 | Monitor | Logged and watched for changes |
| <60 | Discard | Archived immediately |

---

## Status Definitions

| Status | Meaning | Next Step |
|--------|---------|-----------|
| Scored | Initial score assigned | Route to validator if ≥80 |
| Validating | Under validator review | Await Validation Report |
| Validated | Passed validation | Route to pitch for packaging |
| Packaged | Has complete proposal | Present to Stackz |
| Approved | GO decision from owner | Handoff to Startup Team |
| Rejected | NO-GO decision from owner | Archive with reason |
| Expired | No decision in 90 days | Archive with note |

---

## Active Opportunities

### opp_20260306_001 — [Opportunity Name]

**Date Added:** 2026-03-06
**Source:** [GitHub Trending / ProductHunt / Reddit / etc.]
**Current Status:** Scored

#### Description
[Brief description of the opportunity]

#### Scoring Breakdown

| Dimension | Score | Notes |
|-----------|-------|-------|
| Revenue Potential | /25 | [Notes] |
| Build Complexity | /20 | [Notes] |
| Competitive Moat | /20 | [Notes] |
| Market Timing | /20 | [Notes] |
| Operational Fit | /15 | [Notes] |
| **TOTAL** | /100 | |

#### Status History

| Date | Status | Notes |
|------|--------|-------|
| 2026-03-06 | Scored | Initial scoring by radar |

#### Links
- Validation Report: `../validations/val_YYYYMMDD_NNN.md`
- Proposal: `../pipeline/YYYY-MM-DD-[slug]-proposal.md`

---

## Archived Opportunities

Archived opportunities are moved to `archived/` directory when:
- Rejected by owner (with reason)
- Expired (no decision in 90 days)
- Kill rating from validator

See `archived/` directory for complete history.

---

## Pipeline Summary

| Metric | Count |
|--------|-------|
| Total Opportunities Logged | 0 |
| Currently Validating | 0 |
| Awaiting Approval | 0 |
| Approved (Active) | 0 |
| Rejected | 0 |

---

## Adding New Opportunities

To add a new opportunity:

1. Copy the template section above
2. Assign next sequential ID
3. Fill in all scoring dimensions
4. Add initial status entry
5. Move to appropriate status based on score

---

## Querying the Log

Common queries for finding opportunities:

- Score ≥80: `grep -n "≥80" OPPORTUNITY_LOG.md`
- Status = Validating: Look for "Validating" status
- Source = [X]: Search by source name
- Recent: Check top entries (most recent first)

---

## Integration Points

- **SCORING_RUBRIC.md** — Scoring methodology
- **RADAR_PIPELINE.md** — Full pipeline process
- **validations/** — Validation reports (80+ opportunities)
- **pipeline/** — Proposal documents
- **archived/** — Rejected/expired opportunities
