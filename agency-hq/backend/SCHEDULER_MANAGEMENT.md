# 🕐 Stackz Workflow Scheduler Management Guide

## 🚀 Starting the Scheduler

To start the Stackz workflow scheduler independently:

```bash
cd /Users/jaleeljenkins/Desktop/Stackz/agency-hq/backend
node start-scheduler.js
```

Or to start the entire development environment (including scheduler):

```bash
cd /Users/jaleeljenkins/Desktop/Stackz/agency-hq
npm run dev
```

## 📅 Scheduled Workflows

All workflows are configured to run automatically according to their schedules:

| Workflow | Schedule | Time (PT) | Description |
|----------|----------|-----------|-------------|
| **SELF_BUILD** | Daily | 2:00 AM | Master nightly engine - builds highest-priority incomplete component |
| **ZETTELKASTEN** | Daily | 3:00 AM | Process fleeting notes, detect clusters |
| **VAULT_ORGANIZER** | Daily | 3:00 AM | Vault maintenance, orphan detection |
| **IMPROVEMENT_LOOP** | Sundays | 3:00 AM | Audit all workflows, apply improvements |
| **STACKZ SELF-OPTIMIZATION** | Daily | 5:00 AM | Analyze performance, identify inefficiencies, propose improvements |
| **SYSTEM_HEALTH** | Daily | 6:00 AM | Full system diagnostics + morning brief |
| **MORNING BRAINSTORM** | Daily | 8:00 AM | Generate 3 new profitable business ideas |
| **WEEKLY REPORT** | Sundays | 9:00 AM | Generate comprehensive weekly report |
| **SEMANTIC SNAPSHOT** | Daily | 9:00 PM | Capture current state for historical tracking |
| **SELF-OP Polling** | Every 30 min | :00, :30 | Checks for new tasking in SELF-OP.md |
| **Midnight Cleanup** | Daily | 12:00 AM | Archive COMPLETED TODAY section of SELF-OP.md |

## 📁 Log Management

Logs are stored in: `backend/logs/`

Each workflow creates dated log files:
- `self-build-2026-03-12.log`
- `self-optimization-2026-03-12.log`
- `morning-brainstorm-2026-03-12.log`
- etc.

To monitor logs in real-time:
```bash
tail -f backend/logs/scheduler.log
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Error: `EADDRINUSE: address already in use :::3000`
   - Solution: Kill the process using the port
   ```bash
   lsof -i :3000
   kill -9 <PID>
   ```

2. **Scheduler Won't Start**
   - Check for syntax errors in `scheduler.js`
   - Ensure all required dependencies are installed
   - Verify Claude Code is accessible

3. **Workflows Not Executing**
   - Check the timezone settings (America/Los_Angeles)
   - Verify Claude Code installation and permissions
   - Check individual workflow logs for errors

### Monitoring

To check if workflows are scheduled correctly:
```bash
# Check cron jobs
crontab -l

# Or check the scheduler logs
tail -f backend/logs/scheduler.log
```

## 🛑 Stopping the Scheduler

To stop the scheduler:
- Press `Ctrl+C` if running in foreground
- Use `kill <PID>` if running in background

## 📊 Verification

To verify the Stackz self-optimization workflow is working:

1. Wait for the next scheduled run (5:00 AM) or manually trigger it
2. Check for log files in `backend/logs/self-optimization-*.log`
3. Look for generated proposals in the approval system
4. Verify notifications are sent

## 🔄 Automatic Restart

For production use, consider using a process manager like PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start the scheduler with PM2
pm2 start start-scheduler.js --name "stackz-scheduler"

# Set up automatic restart on boot
pm2 startup
pm2 save
```

This ensures the scheduler automatically restarts if the system reboots.