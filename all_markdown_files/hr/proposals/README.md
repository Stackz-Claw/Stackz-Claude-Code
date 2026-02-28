# AGENT PROPOSALS

This directory contains all agent hiring proposals, both pending and processed.

## Structure

```
proposals/
├── pending/        # Awaiting review
├── approved/       # Approved, provisioning in progress
├── active/         # Completed and activated
└── rejected/       # Not approved (with reasons)
```

## Submitting a Proposal

Team leads: Create a JSON file in `pending/` following the template in `ONBOARDING_PIPELINE.md`.

**Naming convention:** `prop_[timestamp]_[agent-name].json`

Example: `prop_20260213_recruiter.json`

## Process Flow

```
pending/ → (review) → approved/ → (provision & test) → active/
                  ↓
               rejected/
```

All proposals are tracked in `AGENT_REGISTRY.json`.
