# OPPORTUNITY LOG FORMAT
*Used by: radar | Defines how opportunities are tracked and logged*

---

## LOG PURPOSE

The Opportunity Log is the single source of truth for all opportunities in the RADAR pipeline. Every signal that passes the filter stage gets logged here.

---

## LOG STRUCTURE

```
opportunities/
├── README.md              ← This file
├── OPPORTUNITY_LOG.md     ← Running log (this file)
└── archived/              ← Rejected/expired opportunities
    └── YYYY-MM-[slug].md  ← Individual archived entries
```

---

## LOG ENTRY FORMAT

### New Opportunity Entry

```markdown
## [ID] - [Project Name]

**Date:** YYYY-MM-DD
**Source:** [Where it was found]
**Score:** [1-100]
**Status:** [Scored|Validated|Monitoring|Approved|Rejected|Archived]

### The Opportunity
[Brief description]

### Scoring Breakdown
| Dimension | Score | Notes |
|-----------|-------|-------|
| Revenue Potential | /25 | ... |
| Build Complexity | /20 | ... |
| Competitive Moat | /20 | ... |
| Market Timing | /20 | ... |
| Operational Fit | /15 | ... |
| **TOTAL** | /100 | |

### Status History
| Date | Status | Notes |
|------|--------|-------|
| YYYY-MM-DD | Scored | Initial scoring |
| YYYY-MM-DD | Validated | Passed validation |
| YYYY-MM-DD | Approved | GO decision |
```

---

## STATUS DEFINITIONS

| Status | Meaning |
|--------|---------|
| **Scored** | Has received initial score (1-100) |
| **Validated** | Passed validator review |
| **Monitoring** | Score 60-79, being watched |
| **Packaged** | Has proposal document |
| **Approved** | GO decision from owner |
| **Rejected** | NO-GO decision from owner |
| **Archived** | Expired or rejected >90 days ago |

---

## UPDATING THE LOG

### Adding New Opportunity
1. Add new entry at top of OPPORTUNITY_LOG.md
2. Use next sequential ID (opp_YYYYMMDD_NNN)
3. Include all scoring details

### Updating Status
1. Add row to Status History table
2. Update main status field
3. If approved → create project in Startup Team
4. If rejected → move to archived/

### Archiving
- Rejected opportunities: Move to `archived/YYYY-MM-[slug].md`
- Expired (no decision in 90 days): Archive with note

---

## QUERYING THE LOG

Common queries:
- `Score ≥80` → Pipeline candidates
- `Status = Approved` → Active projects
- `Source = [X]` → Opportunities from specific source
- `Date > [X]` → Recent opportunities

---

## SCORE THRESHOLDS

| Score | Action |
|-------|--------|
| ≥80 | Validate |
| 60-79 | Monitor |
| <60 | Discard |

---

## VALIDATION INTEGRATION

Each 80+ opportunity should link to its Validation Report:
- Located: `validations/val_YYYYMMDD_NNN.md`
- Contains: Risk rating, failure modes, recommendation

---

## APPROVAL INTEGRATION

Each approved opportunity should link to its Proposal:
- Located: `../pipeline/YYYY-MM-DD-[slug]-proposal.md`
- Contains: Full owner-facing document
