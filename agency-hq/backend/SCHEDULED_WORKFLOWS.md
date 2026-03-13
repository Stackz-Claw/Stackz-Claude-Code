# 🕐 Stackz Workflow Scheduler

This document outlines all the automated workflows that run on a scheduled basis in the Stackz agency system.

## 📅 Scheduled Workflows

| Workflow | Schedule | Time (PT) | Description |
|----------|----------|-----------|-------------|
| **SELF_BUILD** | Daily | 2:00 AM | Master nightly engine - builds highest-priority incomplete component |
| **ZETTELKASTEN** | Daily | 3:00 AM | Process fleeting notes, detect clusters |
| **VAULT_ORGANIZER** | Daily | 3:00 AM | Vault maintenance, orphan detection |
| **IMPROVEMENT_LOOP** | Sundays | 3:00 AM | Audit all workflows, apply improvements |
| **STACKZ SELF-OPTIMIZATION** | Daily | 5:00 AM | Analyze performance, identify inefficiencies, propose improvements |
| **SYSTEM_HEALTH** | Daily | 6:00 AM | Full system diagnostics + morning brief |
| **MORNING BRAINSTORM** | Daily | 8:00 AM | Generate 3 new profitable business ideas |
| **SELF-OP Polling** | Every 30 min | :00, :30 | Checks for new tasking in SELF-OP.md |
| **SEMANTIC SNAPSHOT** | Daily | 9:00 PM | Capture current state for historical tracking |
| **WEEKLY REPORT** | Sundays | 9:00 AM | Generate comprehensive weekly report |
| **Midnight Cleanup** | Daily | 12:00 AM | Archive COMPLETED TODAY section of SELF-OP.md |

## 📁 Log Directory

All workflow logs are stored in: `backend/logs/`

Log files are named with the pattern: `<workflow-name>-<YYYY-MM-DD>.log`

## 🛠️ Management

To restart the scheduler:
```bash
# From the agency-hq/backend directory
node scheduler.js
```

## 📊 Monitoring

Check the main scheduler log for execution status:
```bash
tail -f backend/logs/scheduler.log
```

## 🆘 Troubleshooting

If a workflow fails:
1. Check the specific workflow log file in `backend/logs/`
2. Look for error messages or stack traces
3. Verify that Claude Code is properly installed and accessible
4. Check that all required MCP servers are running
5. Ensure network connectivity for external services

## 📝 Notes

- All workflows use Claude Code sessions with Ollama API for inference
- No Anthropic credits are consumed by scheduled workflows
- Workflows run in isolated sessions to prevent interference
- Timezone is set to America/Los_Angeles for all schedules