# RUNBOOK
*How to handle common incidents*

---

## INCIDENT SEVERITY

| Level | Response Time | Examples |
|-------|--------------|----------|
| **Critical** | 15 min | Site down, data loss, security breach |
| **High** | 1 hour | Major feature broken, payment failed |
| **Medium** | 4 hours | Minor feature broken, slow response |
| **Low** | 24 hours | Cosmetic issues, typos |

---

## COMMON INCIDENTS

### 1. Site Not Loading

**Symptoms:** Cannot access site, timeout errors

**Diagnosis:**
1. Check if server is running: `docker ps`
2. Check server health: `curl http://localhost:3001/health`
3. Check DNS: `dig yourdomain.com`
4. Check Cloudflare status

**Fix:**
```bash
# Restart containers
docker-compose restart

# Or rebuild
docker-compose up -d --build
```

**Escalate:** If server won't start → check logs → contact forge

---

### 2. High CPU Usage

**Symptoms:** Site loads slowly, requests timeout

**Diagnosis:**
1. Check processes: `top` or `htop`
2. Check Docker stats: `docker stats`
3. Check for infinite loops in recent deploys

**Fix:**
- Identify process
- Kill if safe: `kill -15 <pid>`
- Or restart affected container

---

### 3. Database Issues

**Symptoms:** Errors writing to database, slow queries

**Diagnosis:**
1. Check database file: `ls -la *.db`
2. Check disk space: `df -h`
3. Check for locks: `lsof *.db`

**Fix:**
```bash
# Restart container
docker-compose restart db

# If corruption suspected
# Restore from latest backup
```

---

### 4. SSL Certificate Issues

**Symptoms:** HTTPS not working, certificate warnings

**Diagnosis:**
1. Check certificate: `openssl s_client -connect domain:443`
2. Check Let's Encrypt logs

**Fix:**
```bash
# Force renewal
certbot renew --force-renewal
```

---

### 5. Memory Exhausted

**Symptoms:** OOM errors, container crashes

**Diagnosis:**
1. Check Docker stats: `docker stats`
2. Check dmesg: `dmesg | grep -i oom`

**Fix:**
- Increase swap
- Restart container
- Optimize application

---

### 6. Webhook Failures

**Symptoms:** Notifications not arriving, Zapier issues

**Diagnosis:**
1. Check webhook logs in app
2. Test webhook endpoint manually
3. Check third-party service status

**Fix:**
- Retry failed webhooks
- Check API keys
- Verify endpoint URL

---

## EMERGENCY CONTACTS

| Role | Contact |
|------|---------|
| Forge (Dev Lead) | [Contact] |
| DevOps | [Contact] |
| Stackz | [Contact] |

---

## ESCALATION PATH

1. **devops** attempts fix
2. If unresolved in 15 min → **forge**
3. If critical → **Stackz** immediately

---

## POST-INCIDENT

After resolving:
1. Document what happened
2. Document what fixed it
3. Update this runbook if needed
4. Review for prevention
