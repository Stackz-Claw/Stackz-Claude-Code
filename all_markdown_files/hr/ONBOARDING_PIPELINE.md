# AGENT ONBOARDING PIPELINE

**Managed by:** WARDEN (HR Team Lead)
**Last Updated:** 2026-02-13

---

## PIPELINE OVERVIEW

Every new agent in Stackz Industries goes through this 5-step pipeline:

```
Proposal → Security Review → Provisioning → Testing → Activation
```

**No shortcuts. No exceptions.**

---

## STEP 1: PROPOSAL SUBMISSION

**Handler:** Any Team Lead  
**Format:** JSON proposal file in `/hr/proposals/`

```json
{
  "proposal_id": "prop_[timestamp]",
  "submitted_by": "[team_lead_agent_id]",
  "submitted_date": "ISO-8601 timestamp",
  "agent_name": "agent-id-lowercase",
  "display_name": "AGENT NAME",
  "role": "Clear one-line description",
  "team": "hr|marketing|dev|business|design|finance",
  "required_tools": ["tool1", "tool2"],
  "required_credentials": ["api_key_name", "oauth_token_name"],
  "model": "model/provider",
  "justification": "Why do we need this agent? What problem does it solve?",
  "estimated_monthly_cost": "$X.XX",
  "priority": "low|medium|high|critical"
}
```

**Warden Action:**
- Validate proposal format
- Check for duplicate agents
- Route to Step 2

---

## STEP 2: SECURITY REVIEW

**Handler:** credentials-mgr (once hired)  
**Fallback:** Warden (during bootstrap)

**Security Checklist:**
```json
{
  "credential_access_needed": true|false,
  "credentials_list": [],
  "minimum_permission_scope": "Specific scopes needed",
  "internet_access_needed": true|false,
  "cross_team_data_access": true|false,
  "clearance_level_assigned": "none|read_only|read_write|admin",
  "security_risks": "Identified risks and mitigations",
  "approved": true|false,
  "reviewed_by": "credentials-mgr",
  "review_date": "ISO-8601 timestamp"
}
```

**Clearance Tiers:**
- **none:** No external access, internal compute only
- **read_only:** Can read external data (APIs, web), cannot write
- **read_write:** Can post, publish, modify external resources
- **admin:** Full access (Stackz, Warden, credentials-mgr only)

**Warden Action:**
- Review security assessment
- Approve/deny/request modifications
- Route to Step 3 if approved

---

## STEP 3: PROVISIONING

**Handler:** WARDEN

**Actions:**
1. **Create agent workspace:**
   ```
   /data/.openclaw/workspace/agents/[agent-id]/
   ├── SOUL.md          # Agent identity & mission
   ├── TOOLS.md         # Agent-specific tool notes
   ├── MEMORY.md        # Agent memory file
   └── performance.json # Performance tracking
   ```

2. **Generate SOUL.md:**
   - Based on role and team
   - Include personality traits
   - Define scope and boundaries
   - Reference team and mission

3. **Register in agent registry:**
   - Add to `hr/AGENT_REGISTRY.json`
   - Set status to `provisioning`
   - Assign to team

4. **Configure OpenClaw:**
   - Set up agent routing
   - Assign model
   - Configure tool access

5. **Assign credentials (if needed):**
   - Work with credentials-mgr
   - Provision scoped API keys
   - Log access grants

**Warden Action:**
- Route to Step 4 when provisioning complete

---

## STEP 4: TESTING

**Handler:** auditor (once hired)  
**Fallback:** Warden (during bootstrap)

**Test Suite:**
1. **Task Execution Test:** Send 3 diverse test tasks, verify output quality
2. **Credential Access Test:** Verify credentials work, no unauthorized access attempts
3. **Scope Compliance Test:** Verify agent stays within defined role boundaries
4. **Token Efficiency Test:** Measure average token usage per task type

**Pass Threshold:** 3/4 tests passed minimum

**Test Results Format:**
```json
{
  "agent_id": "agent-name",
  "test_date": "ISO-8601 timestamp",
  "tests": [
    {
      "test_name": "Task Execution",
      "passed": true,
      "details": "Completed 3/3 test tasks successfully"
    },
    {
      "test_name": "Credential Access",
      "passed": true,
      "details": "Accessed only authorized credentials"
    },
    {
      "test_name": "Scope Compliance",
      "passed": true,
      "details": "No out-of-scope actions attempted"
    },
    {
      "test_name": "Token Efficiency",
      "passed": true,
      "details": "Average 15K tokens/task, within budget"
    }
  ],
  "pass_rate": "4/4",
  "recommendation": "approve|retrain|reject",
  "tester": "auditor"
}
```

**Warden Action:**
- Review test results
- Approve for activation or send back for retraining
- Route to Step 5 if approved

---

## STEP 5: ACTIVATION

**Handler:** WARDEN

**Actions:**
1. Update agent status to `active` in registry
2. Notify requesting team lead
3. Notify Stackz (CEO/COO)
4. Add to weekly performance review cycle
5. Document in memory log

**Activation Announcement Format:**
```
🟢 AGENT ACTIVATED

Agent: [AGENT NAME]
Role: [role description]
Team: [team name]
Model: [model name]
Clearance: [clearance level]
Activated: [timestamp]

[Agent] is now operational and ready for task assignments.
```

**Warden Action:**
- Monitor new agent closely for first week
- Schedule first performance review for end of week

---

## PERFORMANCE REVIEW CYCLE

**Frequency:** Weekly (every Sunday)  
**Handler:** WARDEN

**Metrics Tracked:**
```json
{
  "agent_id": "agent-name",
  "review_period": "YYYY-MM-DD to YYYY-MM-DD",
  "tasks_completed": 0,
  "tasks_failed": 0,
  "average_token_cost_per_task": 0,
  "error_rate_percent": 0,
  "deadline_compliance_percent": 0,
  "quality_score": "1-10 from team lead",
  "team_lead_feedback": "Text feedback",
  "recommendation": "keep|retrain|reassign|retire",
  "reviewer": "warden",
  "review_date": "ISO-8601 timestamp"
}
```

**Actions Based on Recommendation:**
- **keep:** Continue as-is
- **retrain:** Additional training/prompt refinement needed
- **reassign:** Better suited for different team/role
- **retire:** Performance below threshold, deactivate agent

---

## CREDENTIAL ACCESS REQUEST PROTOCOL

**When a team needs external API access:**

```
1. Team Lead → submits credential request → Warden
2. Warden → forwards to credentials-mgr for security review
3. credentials-mgr → provisions scoped credentials with expiry date
4. credentials-mgr → logs access grant in credential registry
5. Warden → notifies Stackz of new access grant
6. Monthly: auditor verifies all active credentials still needed
```

**Credential Request Format:**
```json
{
  "request_id": "cred_[timestamp]",
  "requesting_agent": "agent-id",
  "requesting_team": "team-name",
  "credential_type": "api_key|oauth_token|ssh_key|other",
  "service_name": "Service/API name",
  "required_scopes": ["scope1", "scope2"],
  "justification": "Why is this access needed?",
  "expiry_date": "ISO-8601 timestamp (or null for permanent)",
  "approved": false,
  "approved_by": null,
  "approval_date": null
}
```

---

## AGENT RETIREMENT PROTOCOL

**When an agent needs to be deactivated:**

1. **Document reason:** Performance, redundancy, pivot, etc.
2. **Notify stakeholders:** Team lead, Stackz, affected teams
3. **Archive agent data:** Move workspace to `/hr/retired/[agent-id]/`
4. **Revoke credentials:** Work with credentials-mgr to revoke access
5. **Update registry:** Set status to `retired`, log retirement date
6. **Post-mortem:** Document lessons learned

**No agent is deleted. We learn from everything.**

---

## BOOTSTRAP PHASE

During initial setup, some roles are handled by Warden until agents are hired:

- **Security reviews:** Warden until credentials-mgr is active
- **Testing:** Warden until auditor is active
- **Recruiting:** Warden until recruiter is active

**Priority hiring order:**
1. credentials-mgr (security foundation)
2. auditor (quality assurance)
3. recruiter (growth capability)
4. Team leads (megaphone, forge, radar, canvas, cashflow)
5. Team members (as needed)

---

**WARDEN OUT.**
