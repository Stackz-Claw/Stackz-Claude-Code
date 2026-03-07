# PROJECT TECH SPEC TEMPLATE
*Architecture decisions and tech choices for a venture*

---

## PROJECT OVERVIEW

| Field | Value |
|-------|-------|
| **Project Name** | [Name] |
| **Slug** | [slug] |
| **Status** | [Planning / Building / Live] |
| **Start Date** | YYYY-MM-DD |
| **Target Launch** | YYYY-MM-DD |

---

## FROM RADAR

### Proposal Reference
[Link to Radar proposal]

### Key Requirements
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

---

## ARCHITECTURE

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | [React/Vite] |
| Backend | [Node/Python] |
| Database | [SQLite/PostgreSQL] |
| Hosting | [Hostinger VPS] |
| Payments | [Stripe] |

### System Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Backend   │────▶│  Database   │
│  (Browser)  │     │   (API)     │     │   (SQL)     │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  External   │
                    │  Services   │
                    │(Stripe,etc)│
                    └─────────────┘
```

---

## API DESIGN

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/resource | List resources |
| GET | /api/resource/:id | Get single |
| POST | /api/resource | Create |
| PUT | /api/resource/:id | Update |
| DELETE | /api/resource/:id | Delete |

### Data Models

```typescript
// Resource
interface Resource {
  id: string;
  name: string;
  created: Date;
  updated: Date;
}
```

---

## INTEGRATIONS

| Service | Purpose | Status |
|---------|---------|--------|
| Stripe | Payments | Pending |
| Telegram | Notifications | Pending |

---

## MILESTONES

| Milestone | Target | Status |
|-----------|--------|--------|
| MVP Complete | YYYY-MM-DD | Pending |
| Staging Deploy | YYYY-MM-DD | Pending |
| Payment Integration | YYYY-MM-DD | Pending |
| Launch | YYYY-MM-DD | Pending |

---

## DEPENDENCIES

### Internal
- [Dependency 1]
- [Dependency 2]

### External
- [Service 1]
- [Service 2]

---

## DECISIONS

| Decision | Rationale | Date |
|----------|-----------|------|
| [Choice] | [Why] | YYYY-MM-DD |

---

## NOTES

[Additional architecture notes]
