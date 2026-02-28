# STARTUP_TEAM.md

Phase-driven execution engine for Stackz teams. This phase defines governance, milestone gating, and cross-team handoffs. See RADAR_PIPELINE.md for scoring and proposal generation.

## Governance: Bicameral Mind (Smoke + Stackz)

- Smoke (Internal) acts as Chief of Operations (COO) for personal & health domains.
- Stackz (External) acts as Chief of Business Operations (CBO) for external domains.
- Ghost remains the Validation Gate for legality; NINO remains aligned with revenue engine within the lane-queue workflow.
- Decision pass: Stakeholders propose -> governance review by Ghost (legal) if needed -> Smoke and Stackz negotiate scheduling/priority -> final approval by Stackz (as CBO).
- Overrides: Personal health/time blocks override business scheduling; health metrics logged via SMOKE_SOUL.
- Logging: All governance decisions logged in memory and memory/sync-log.md.

## Escalation Paths

1) Low impact: Smoke recommends, Stackz approves in Lane Queue.
2) Medium impact: Ghost legal gate signs off; Stackz proceeds to execution.
3) High impact: Initiate weekly governance review; escalate to Owner if necessary.

## Workflow Example

1) Radar proposes project; Stackz reviews.
2) Ghost validates; if fail, Radar revises; resubmits.
3) Smoke schedules personal wellness blocks; Stackz delays business milestones accordingly.
4) Start MVP development; log notes to vault.

---

## Vault & Ahrens Protocol (Slip-box)

1) The Ahrens vault structure and the integrated MOC map the notes master skeleton
2) Ensure each note includes YAML FrontMatter, sources, and atomic data. Ensure notes link with "Reason for Link" rationale.
3) Forge: Vault service creates markdown notes with proper frontmatter and GUIDs for vault entries.

---

