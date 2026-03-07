# MONITORING
*What's being watched, alert thresholds*

---

## METRICS TRACKED

### Server Metrics

| Metric | Threshold | Alert |
|--------|-----------|-------|
| CPU Usage | > 80% for 5 min | Warning |
| CPU Usage | > 95% for 2 min | Critical |
| Memory Usage | > 80% for 5 min | Warning |
| Memory Usage | > 95% for 2 min | Critical |
| Disk Usage | > 85% | Warning |
| Disk Usage | > 95% | Critical |

### Application Metrics

| Metric | Threshold | Alert |
|--------|-----------|-------|
| Response Time (p95) | > 2s | Warning |
| Response Time (p99) | > 5s | Critical |
| Error Rate | > 1% | Warning |
| Error Rate | > 5% | Critical |
| Health Check Failures | 2 consecutive | Critical |

### Business Metrics

| Metric | Threshold | Alert |
|--------|-----------|-------|
| Failed Payments | Any | Warning |
| API Rate Limits | > 80% | Warning |
| Webhook Failures | > 10% | Warning |

---

## ALERT CHANNELS

| Severity | Channel |
|----------|---------|
| Critical | Slack #dev-alerts + SMS |
| High | Slack #dev-alerts |
| Medium | Slack #dev-alerts |
| Low | Email (daily digest) |

---

## HEALTH CHECKS

### Endpoints

| Service | Endpoint | Expected |
|---------|----------|----------|
| Agency HQ | http://localhost:3001/health | 200 OK |
| Frontend | http://localhost:5173 | 200 OK |
| Vault API | http://localhost:8765/vault/health | 200 OK |

### Check Interval
- Every 5 minutes
- 2 failures = alert
- 3 failures = page on-call

---

## LOGGING

### What's Logged

| Level | What |
|-------|------|
| Error | Exceptions, failures |
| Warning | Deprecations, retries |
| Info | Requests, actions |
| Debug | Detailed flow |

### Retention
- Errors: 30 days
- Warnings: 14 days
- Info: 7 days
- Debug: 2 days

---

## DASHBOARDS

| Dashboard | URL | Purpose |
|-----------|-----|---------|
| Server | [Grafana URL] | System metrics |
| App | [Grafana URL] | Application metrics |
| Logs | [Grafana URL] | Log viewer |

---

## ON-CALL

| Rotation | Person | Contact |
|----------|--------|---------|
| Primary | devops | [Contact] |
| Backup | forge | [Contact] |

---

## ESCALATION

If alert not acknowledged:

| Time | Action |
|------|--------|
| 0 min | Alert fires |
| 5 min | If unacked → backup paged |
| 15 min | If unacked → forge paged |
| 30 min | If critical → Stackz notified |
