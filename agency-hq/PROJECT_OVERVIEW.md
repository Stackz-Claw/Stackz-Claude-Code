# 📋 Project Overview — The Agency HQ

A living, breathing AI agent operations center. Animated 3D office world where your AI teams work, communicate, and report to you in real time.

---

## 🎯 Project Vision

The Agency HQ is an interactive dashboard for managing AI agents that operate like a real team — handling finances, health optimization, brainstorming, approvals, and knowledge management. It combines a 3D virtual office with real-time communication (Telegram bots) and comprehensive management tools.

---

## 📊 Current Status

| Metric | Value |
|--------|-------|
| **Last Updated** | 2026-03-11 |
| **Version** | 0.1.0 |
| **Frontend** | React 18 + Vite + Three.js |
| **Backend** | Express + Socket.io |
| **Agents Active** | 7 (Smoke, Stackz, Nova, Bolt, Rex, Zip, Chill) |

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| 3D Graphics | Three.js + React Three Fiber + Drei |
| Animations | Framer Motion |
| State Management | Zustand |
| Real-time | Socket.io |
| Backend | Node.js + Express |
| Database | SQLite (better-sqlite3) |
| Messaging | Telegram Bots (node-telegram-bot-api) |
| Charts | Recharts |
| Graph/Notes | React Flow (@xyflow/react) |

---

## 📜 Changelog

### 2026-03-11 — v0.1.0

#### Added
- **GitHub Integration** — Added Git, GitHub CLI, and GitHub API `curl` commands to the allowed list in local settings
- **Idea Brainstorm Workflow** — Implemented comprehensive brainstorming workflow with bookmark and vault notepad skills
- **Brave Search Server Module** — Added Brave Search server module for web searching capabilities
- **Obsidian Vault MCP** — New `obsidian-vault-mcp` server module for note management
- **Agent Skills Expansion** — New skills for task decomposition, venture lifecycle management, hiring, and reporting
- **Markdown Templates** — Extensive markdown templates for project documentation
- **Note Management UI** — New UI components for note management
- **MCP Server Module** — New `x-mcp-server` module

#### Updated
- **NoteDetail Component** — Updated to support new functionality
- **Environment Configurations** — Updated example environment configurations

#### Frontend Pages Added
- **Timeline** — Agent activity timeline view
- **Briefing** — Daily briefings dashboard
- **Radar** — Strategic radar view
- **Approval Inbox** — Full approval board with idea submission
- **Lane Queue** — Task queue management
- **Agent Health** — Health monitoring for all agents
- **Token Economy** — Token/credits management dashboard

#### UI/UX Improvements
- **Sidebar Styling** — Refined sidebar styling and navigation active states
- **Glassmorphism** — Enhanced glassmorphism UI with new accent colors and hover effects
- **PageHeader Component** — New reusable PageHeader component

#### Agent Capabilities
- **Internal Communications Skill** — AI-powered internal communications
- **MCP Building Skill** — Model Context Protocol server building capabilities
- **Twitter Optimization Skill** — Social media optimization for agents
- **File Organization Skill** — Automated file organization

---

## 🗺️ Feature Roadmap

### Phase 1: Core Foundation (Complete)
- [x] 3D Virtual Office with agent avatars
- [x] Telegram bot integration (Smoke + Stackz)
- [x] Real-time dashboard with Socket.io
- [x] Financial tracking and charts
- [x] Health monitoring dashboard
- [x] Smart Notes with React Flow graph
- [x] Approval workflow system

### Phase 2: Agent Intelligence (In Progress)
- [x] Agent skill definitions
- [x] Task decomposition workflows
- [x] Venture lifecycle management
- [x] Internal communications AI
- [x] Brave Search integration
- [x] Obsidian Vault integration
- [ ] Advanced reasoning capabilities
- [ ] Multi-agent collaboration

### Phase 3: Expansion (Planned)
- [ ] Additional agent archetypes
- [ ] Voice interaction capabilities
- [ ] Mobile companion app
- [ ] Advanced analytics
- [ ] Custom workflow builder

---

## 🤖 Agent Roster

| Agent | Archetype | Zone | Status |
|-------|-----------|------|--------|
| **Smoke** | Executive — Life | Executive Suite | Active |
| **Stackz** | Executive — Business | Finance War Room | Active |
| **Nova** | The Nerd | Operations Floor | Active |
| **Bolt** | The Hype Man | Operations Floor | Active |
| **Rex** | The Skeptic | Operations Floor | Active |
| **Zip** | The Overachiever | Operations Floor | Active |
| **Chill** | The Slacker Who Delivers | Health Corner | Active |

---

## 📁 Project Structure

```
agency-hq/
├── frontend/                    # React + Vite application
│   └── src/
│       ├── pages/              # Main view pages (6+ views)
│       ├── components/
│       │   ├── 3d/            # Three.js office scene + agents
│       │   ├── chat/           # Office chat feed
│       │   ├── approvals/      # Approval UI components
│       │   ├── financial/     # Financial dashboards
│       │   ├── health/         # Health monitoring
│       │   ├── executive/      # Executive views
│       │   └── notes/          # React Flow graph
│       ├── store/              # Zustand state stores
│       ├── hooks/              # Custom React hooks
│       ├── data/              # Static data (personalities)
│       └── utils/              # Utility functions
├── backend/                     # Express + Socket.io server
│   ├── routes/                  # REST API endpoints
│   ├── services/                # Telegram bots + agent engine
│   ├── sockets/                 # Real-time event handlers
│   ├── db/                      # SQLite database schema
│   └── middleware/              # Express middleware
├── mock-data/                   # Seed data for development
├── skills/                      # Agent skill definitions
├── docs/                        # Documentation templates
└── .claude/                     # Claude Code configuration
```

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/agents` | GET | List all agents |
| `/api/agents/:id` | GET | Get agent details |
| `/api/approvals` | GET | List approvals |
| `/api/approvals` | POST | Create approval request |
| `/api/approvals/:id` | PATCH | Update approval status |
| `/api/financials` | GET | Get financial data |
| `/api/health` | GET | Get health metrics |
| `/api/notes` | GET | Get smart notes |
| `/api/notes` | POST | Create new note |

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Run development servers
npm run dev

# Access the application
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
```

---

## 📝 Updating This File

When making changes to the project:

1. **Add a new entry** under the current date in the Changelog
2. **Use clear prefixes**: Added, Updated, Fixed, Removed, Changed
3. **Group by category**: Frontend, Backend, Agents, Infrastructure, etc.
4. **Update the Last Updated date**
5. **Update version if it's a significant release**

### Format for Changelog Entries

```markdown
### YYYY-MM-DD — vX.Y.Z

#### Added
- New feature description

#### Updated
- Existing feature improvements

#### Fixed
- Bug fixes

#### Removed
- Deprecated features
```

---

*Last updated: 2026-03-11*
