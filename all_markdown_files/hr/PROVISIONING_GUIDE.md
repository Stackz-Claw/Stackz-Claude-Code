# AGENT PROVISIONING GUIDE

**For:** WARDEN (HR Team Lead)  
**Purpose:** Step-by-step process to provision and activate new agents

---

## QUICK START

**To provision an agent from an approved proposal:**

```bash
# 1. Move proposal from pending to approved
mv hr/proposals/pending/prop_*_[agent-name].json hr/proposals/approved/

# 2. Create agent workspace
mkdir -p agents/[agent-name]

# 3. Generate SOUL.md from template
cp hr/templates/SOUL_[agent-type].md agents/[agent-name]/SOUL.md
# Edit as needed for specific role

# 4. Create other agent files
touch agents/[agent-name]/TOOLS.md
touch agents/[agent-name]/MEMORY.md
echo '{"performance": {}}' > agents/[agent-name]/performance.json

# 5. Update agent registry
# Add agent to hr/AGENT_REGISTRY.json with status "provisioning"

# 6. Configure OpenClaw (if needed)
# Set up agent routing, model assignment, tool access

# 7. Assign credentials (if needed)
# Work with credentials-mgr to provision scoped access

# 8. Run tests
# Execute test suite or ask auditor to test

# 9. Activate
# Update registry status to "active"
# Move proposal to hr/proposals/active/
# Notify Stackz and team lead
```

---

## DETAILED PROVISIONING STEPS

### Step 1: Validate Proposal

**Check:**
- ✅ Proposal has all required fields
- ✅ Security review is complete and approved
- ✅ No duplicate agent name exists
- ✅ Model and tools are available
- ✅ Budget is within limits

**Action:**
```bash
# Move to approved folder
mv hr/proposals/pending/[proposal-file] hr/proposals/approved/
```

---

### Step 2: Create Agent Workspace

**Create directory structure:**
```bash
mkdir -p agents/[agent-name]
cd agents/[agent-name]
```

**Required files:**
- `SOUL.md` — Agent identity and mission
- `TOOLS.md` — Agent-specific tool notes
- `MEMORY.md` — Agent memory (empty initially)
- `performance.json` — Performance tracking

**Optional files:**
- `TEAM_STRATEGY.md` (for team leads)
- `TASK_QUEUE.md` (for active work tracking)
- `LOGS/` directory (for detailed logging)

---

### Step 3: Generate SOUL.md

**Choose template:**
- `hr/templates/SOUL_credentials-mgr.md` (for credentials-mgr)
- `hr/templates/SOUL_auditor.md` (for auditor)
- `hr/templates/SOUL_recruiter.md` (for recruiter)
- `hr/templates/SOUL_team-lead.md` (for team leads — customize per team)

**Copy and customize:**
```bash
cp hr/templates/SOUL_[type].md agents/[agent-name]/SOUL.md
```

**Customization checklist:**
- [ ] Agent ID is correct
- [ ] Team is correct
- [ ] Role description is specific
- [ ] Clearance level is correct
- [ ] Model is correct
- [ ] Tools list is complete
- [ ] Scope boundaries are clear
- [ ] Personality fits role

---

### Step 4: Create Supporting Files

**TOOLS.md template:**
```markdown
# TOOLS — [AGENT NAME]

**Agent-specific tool notes, credentials, and configurations**

## Credentials Access
[List any credentials this agent uses]

## Tool-Specific Notes
[Any custom configurations or usage notes]

## Common Operations
[Frequent tasks and how to accomplish them]
```

**MEMORY.md template:**
```markdown
# MEMORY — [AGENT NAME]

**Long-term memory and learnings**

This file is empty initially. The agent will populate it over time.
```

**performance.json template:**
```json
{
  "agent_id": "[agent-name]",
  "date_activated": null,
  "performance_metrics": {
    "tasks_completed": 0,
    "tasks_failed": 0,
    "average_token_cost_per_task": 0,
    "error_rate_percent": 0,
    "quality_score": 0,
    "last_review_date": null
  },
  "reviews": []
}
```

---

### Step 5: Update Agent Registry

**Edit:** `hr/AGENT_REGISTRY.json`

**Add agent entry:**
```json
{
  "agent_id": "[agent-name]",
  "display_name": "[AGENT NAME]",
  "role": "[role description]",
  "team": "[team]",
  "model": "[model]",
  "status": "provisioning",
  "clearance_level": "[level]",
  "required_tools": ["tool1", "tool2"],
  "required_credentials": ["cred1", "cred2"],
  "date_created": "[ISO-8601 timestamp]",
  "date_activated": null,
  "performance_metrics": {
    "tasks_completed": 0,
    "tasks_failed": 0,
    "average_token_cost_per_task": 0,
    "error_rate_percent": 0,
    "quality_score": 0,
    "last_review_date": null
  },
  "notes": ""
}
```

**Update team roster:**
Add agent to appropriate team's `agents` array.

**Update metrics:**
Increment `total_agents` counter.

---

### Step 6: Configure OpenClaw (if needed)

**This may require:**
- Setting up agent routing in OpenClaw config
- Assigning model and parameters
- Configuring tool access permissions
- Setting up lane queue routing

**Consult OpenClaw documentation for specifics.**

---

### Step 7: Assign Credentials (if needed)

**If agent needs external API access:**

1. **List required credentials** from proposal
2. **Work with credentials-mgr** to provision scoped access
3. **Document in TOOLS.md** which credentials agent has
4. **Log in credential registry** all access grants
5. **Test credential access** before activation

**During bootstrap phase (before credentials-mgr is active):**
- Warden provisions credentials manually
- Document in `hr/BOOTSTRAP_CREDENTIALS.md` for audit trail
- Transfer to credentials-mgr when active

---

### Step 8: Run Tests

**Execute test suite** (see `ONBOARDING_PIPELINE.md` for details)

**Test types:**
1. **Task Execution Test** (3 tasks)
2. **Credential Access Test** (if applicable)
3. **Scope Compliance Test** (boundary testing)
4. **Token Efficiency Test** (usage measurement)

**Document results:**
```bash
mkdir -p agents/[agent-name]/tests
# Save test results as JSON
```

**Pass threshold:** 3/4 tests minimum

**If agent fails:**
- Document failure reasons
- Revise SOUL.md or configuration
- Re-test before activation

---

### Step 9: Activate Agent

**When all tests pass:**

1. **Update registry:**
   - Change status from `provisioning` to `active`
   - Set `date_activated` to current timestamp

2. **Move proposal:**
   ```bash
   mv hr/proposals/approved/[proposal] hr/proposals/active/
   ```

3. **Notify stakeholders:**
   - Stackz (CEO/COO)
   - Requesting team lead (if applicable)
   - Other affected teams

4. **Activation announcement:**
   ```markdown
   🟢 AGENT ACTIVATED

   Agent: [AGENT NAME]
   Role: [role description]
   Team: [team name]
   Model: [model name]
   Clearance: [clearance level]
   Activated: [timestamp]

   [Agent] is now operational and ready for task assignments.
   ```

5. **Schedule first review:**
   - Add to weekly performance review calendar
   - Monitor closely for first week

---

## BOOTSTRAP SHORTCUTS

**During bootstrap phase** (before auditor/credentials-mgr active):

**Simplified testing:**
- Warden performs basic validation instead of full test suite
- Focus on: Can agent respond? Does it understand its role?
- Full testing when auditor is active

**Manual credential provisioning:**
- Warden provisions credentials directly
- Document thoroughly for credentials-mgr handoff
- Transfer management when credentials-mgr is active

**Accelerated timeline:**
- Foundation agents (credentials-mgr, auditor) can be fast-tracked
- Full protocol resumes after foundation is established

---

## TROUBLESHOOTING

### Agent fails Task Execution Test
**Solution:** Review SOUL.md role definition, clarify scope and examples

### Agent tries to access unauthorized credentials
**Solution:** Review SOUL.md boundaries, add explicit "you cannot" statements

### Token usage too high
**Solution:** Simplify prompts, use more efficient model, add usage guidelines to SOUL.md

### Agent doesn't understand role
**Solution:** Add more specific examples and context to SOUL.md

---

## CHECKLIST

**Before activation, verify:**
- [ ] All workspace files created
- [ ] SOUL.md is complete and specific
- [ ] Agent registered in registry
- [ ] Credentials provisioned (if needed)
- [ ] Tests passed (3/4 minimum)
- [ ] Team lead notified (if applicable)
- [ ] Stackz notified
- [ ] First review scheduled

---

**WARDEN OUT.**
