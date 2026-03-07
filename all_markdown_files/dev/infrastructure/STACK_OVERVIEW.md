# STACK OVERVIEW
*Current hosting, services, and costs*

---

## INFRASTRUCTURE

### Hosting

| Service | Provider | Purpose |
|---------|----------|---------|
| VPS | Hostinger | Primary server |
| Domain | Cloudflare | DNS management |
| SSL | Let's Encrypt | Automatic HTTPS |

### Server Specs

| Resource | Allocation |
|----------|------------|
| CPU | 4 vCPU |
| RAM | 8 GB |
| Storage | 200 GB SSD |
| Bandwidth | Unlimited |

---

## SERVICES

### Active Services

| Service | Port | Status | URL |
|---------|------|--------|-----|
| Agency HQ | 3001 | Running | https://agency.heyfire.com |
| Frontend | 5173 | Running | (internal) |
| Vault API | 8765 | Running | http://localhost:8765 |

---

## COST TRACKING

| Month | Hosting | Domains | SSL | Total |
|-------|---------|---------|-----|-------|
| 2026-01 | $XX | $XX | $0 | $XX |
| 2026-02 | $XX | $XX | $0 | $XX |

---

## CREDENTIALS

Credentials are stored in:
- Backend: `.env` file (not committed)
- Infrastructure: LastPass or similar

---

## NOTES

- Auto-renewal enabled for SSL
- Backups run daily at 02:00 UTC
- Monitoring alerts go to Slack #dev-alerts
