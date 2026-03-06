# OPENHANDS_ONBOARDING.md — Forge Team Integration Guide

## Prepared by: STACKZ (CBO) | For: FORGE Team + HR (Warden)

---

## What Is OpenHands?

OpenHands is an open-source AI-powered software development platform.
- Repo: https://github.com/All-Hands-AI/OpenHands
- Docs: https://docs.all-hands.dev
- License: MIT

**Capabilities:**
- AI coding agents that write, test, and debug code autonomously
- CLI and web UI for agent-driven development
- MCP (Model Context Protocol) server support for tool integration
- Sandboxed execution environments (Docker-based)
- GitHub integration for issues, PRs, and CI

---

## Why OpenHands for Epicenter MVP?

Forge team will use OpenHands as the primary AI-assisted development platform to build Epicenter MVP. It accelerates:
- Code generation and scaffolding (SvelteKit routes, API endpoints, vault services)
- Automated test writing and debugging
- PR creation and review assistance
- MCP server integration for the vault-service and Smoke/Stackz bridges

---

## Integration Architecture

**Approach:** Fork & PR Workflow (Forge Lead's recommendation)

```
OpenHands (upstream)
    │
    ▼
Fork (your GitHub org)
    │
    ▼
Clone into Forge workspace
    │
    ▼
epicenter/forge-openhands/
├── src/
│   ├── bridge.ts          # OpenHands ↔ Epicenter bridge service
│   ├── config.ts          # Configuration loader
│   └── types.ts           # TypeScript interfaces
├── scripts/
│   ├── setup.sh           # One-command setup script
│   └── test.sh            # Run integration tests
├── docs/
│   └── CONTRIBUTING.md    # How to contribute to the bridge
├── config.json            # OpenHands connection config
├── package.json           # Dependencies
└── README.md              # This integration's readme
```

---

## Setup Guide (For Forge Developers)

### Prerequisites
- Docker installed and running
- Node.js 18+ and npm
- Python 3.12+ (for OpenHands CLI)
- Access to the forked OpenHands repo

### Step 1: Install OpenHands CLI

```bash
# Option A: Using uv (recommended)
uv tool install openhands --python 3.12

# Option B: Binary install
curl -fsSL https://install.openhands.dev/install.sh | sh

# Option C: Docker (no local install needed)
# See Docker section below
```

### Step 2: Configure OpenHands

Create `~/.openhands/settings.json`:

```json
{
  "llm": {
    "provider": "openrouter",
    "model": "minimax/minimax-m2.5",
    "api_key": "${OPENROUTER_API_KEY}"
  },
  "sandbox": {
    "volumes": "/data/.openclaw/workspace/epicenter"
  }
}
```

### Step 3: Clone the Bridge

```bash
cd /data/.openclaw/workspace/epicenter
git clone <your-fork-url> forge-openhands
cd forge-openhands
npm install
```

### Step 4: Run the Bridge

```bash
# Start the bridge service
npm run dev

# Or run via Docker
docker compose -f docker-compose.openhands.yml up -d
```

### Step 5: Verify Connection

```bash
# Health check
curl http://localhost:3003/health

# Test a simple code generation task
curl -X POST http://localhost:3003/api/generate \
  -H "Content-Type: application/json" \
  -d '{"task": "Create a hello world SvelteKit route"}'
```

---

## How to Use OpenHands for Epicenter Development

### Task Workflow

1. **Define the task** in a GitHub issue or Lane Queue message
2. **Assign to OpenHands** via the bridge:
   ```bash
   openhands "Implement the /api/config/encrypt endpoint per vault spec"
   ```
3. **Review the output** — OpenHands creates a PR or outputs code to the sandbox
4. **Merge or iterate** — Forge lead reviews, approves, or requests changes
5. **Log the result** — Commit vault note documenting what was built

### MCP Server Integration

OpenHands supports MCP servers for tool access. Configure vault tools:

```json
{
  "mcp_servers": [
    {
      "name": "vault-service",
      "url": "http://localhost:3001",
      "tools": ["encrypt", "status", "kill_switch"]
    }
  ]
}
```

---

## Access & Permissions

| Role | Access Level | What They Can Do |
|------|-------------|------------------|
| FORGE (Lead) | Admin | Full config, deploy, merge authority |
| Forge Devs | Write | Clone, branch, PR, run tasks |
| STACKZ | Read + Approve | Review PRs, approve merges |
| GHOST | Read (legal dirs only) | Review `/legal` directory contents |
| All Others | None | No direct OpenHands access |

---

## Security Rules

- **No credentials in code.** Use env vars or the vault-service.
- **No raw tokens logged.** OpenHands output is sanitized before commit.
- **Sandbox isolation.** All OpenHands tasks run in Docker sandboxes.
- **PR review required.** No direct merges to main without Forge lead approval.

---

## Contribution Guidelines

1. Branch from `main` using format: `forge/<feature-name>`
2. Write tests for any new endpoint or service
3. Include vault notes (Ahrens Protocol) for significant architectural decisions
4. PR description must include: What changed, Why, How to test
5. Forge lead reviews and merges

---

## Onboarding Checklist (For New Forge Developers)

- [ ] Fork the OpenHands repo to your org
- [ ] Clone the bridge scaffold (`epicenter/forge-openhands`)
- [ ] Install OpenHands CLI (uv, binary, or Docker)
- [ ] Configure `~/.openhands/settings.json` with OpenRouter API key
- [ ] Run the bridge locally and verify health check
- [ ] Complete one test task: generate a simple SvelteKit route
- [ ] Submit a test PR to confirm workflow
- [ ] Review the CONTRIBUTING.md and vault note protocol

---

## HR Handoff (Warden)

Stackz has approved this onboarding document. Warden (HR) should:

1. Distribute this doc to all Forge team members
2. Track onboarding checklist completion per developer
3. Report onboarding status to Stackz in weekly standup
4. Provision OpenHands access credentials via credentials-mgr
5. Add OpenHands to the agent registry

---

*"Forge doesn't just write code. Forge builds with AI agents that write code. OpenHands is the multiplier."* — Stackz
