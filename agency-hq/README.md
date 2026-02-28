# 🏢 The Agency HQ

A living, breathing AI agent operations center. Animated 3D office world where your AI teams work, communicate, and report to you in real time.

---

## ⚡ Quick Start

```bash
# 1. Clone and install
cd agency-hq
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your values (Telegram tokens optional for MVP)

# 3. Run
npm run dev
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
```

---

## 📲 Telegram Bot Setup (100% Free — No Credit Card)

Takes 2 minutes. Gets you two live bots (Smoke + Stackz) on your phone.

### Step 1 — Create Smoke Bot
1. Open Telegram and message **@BotFather**
2. Send: `/newbot`
3. Name it: `Smoke Agency Bot` (or anything you want)
4. Username: `smoke_agency_bot` (must end in `bot`)
5. BotFather gives you a token — copy it

### Step 2 — Create Stackz Bot
Repeat the same process for a second bot:
- Name: `Stackz Agency Bot`
- Username: `stackz_agency_bot`

### Step 3 — Get Your Chat ID
1. Message **@userinfobot** on Telegram
2. It replies with your chat ID (looks like: `123456789`)

### Step 4 — Add to .env
```bash
SMOKE_BOT_TOKEN=1234567890:ABCdef...
STACKZ_BOT_TOKEN=0987654321:XYZabc...
TELEGRAM_CHAT_ID=123456789
```

### Step 5 — Run
```bash
npm run dev
```

Both bots come online and send their daily briefing within seconds. Reply in Telegram — messages route back into the dashboard in real time. Use inline buttons to Approve/Reject directly from your phone.

---

## 🗺️ Navigation

| Page | Key | Description |
|---|---|---|
| Office World | `1` | 3D animated office — click agents to inspect |
| Executive View | `2` | Smoke + Stackz side-by-side with radial menus |
| Financial | `3` | Stackz revenue dashboard with live charts |
| Health & Life | `4` | Smoke health dashboard + suggestion approval cards |
| Smart Notes | `5` | React Flow agent knowledge graph |
| Approvals | `6` | Full approval board + idea submission |

---

## 🤖 Agent Roster

| Agent | Archetype | Zone | Personality |
|---|---|---|---|
| **Smoke** | Executive — Life | Executive Suite | Calm, calculated, minimal. Health optimization. |
| **Stackz** | Executive — Business | Finance War Room | Hyped, urgent, money-focused. Moves fast. |
| **Nova** | The Nerd | Operations Floor | Data-obsessed. Everything has a confidence interval. |
| **Bolt** | The Hype Man | Operations Floor | ALL CAPS. Celebrates everything. Cannot contain it. |
| **Rex** | The Skeptic | Operations Floor | Always plays devil's advocate. Never wrong twice. |
| **Zip** | The Overachiever | Operations Floor | First in, last out. Already automated it. |
| **Chill** | The Slacker Who Delivers | Health Corner | Lowercase always. Stares at ceiling. Then drops the best idea. |

---

## 🏗️ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **3D World**: Three.js + React Three Fiber + Drei
- **Animations**: Framer Motion
- **State**: Zustand
- **Real-time**: Socket.io
- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **Telegram**: node-telegram-bot-api (FREE)
- **Charts**: Recharts
- **Graph**: React Flow (@xyflow/react)

---

## 📁 Project Structure

```
agency-hq/
├── frontend/          React + Vite + Three.js
│   └── src/
│       ├── pages/     6 main views
│       ├── components/
│       │   ├── 3d/    Three.js office scene + agents
│       │   ├── chat/  Office chat feed
│       │   ├── approvals/
│       │   ├── financial/
│       │   ├── health/
│       │   ├── executive/
│       │   └── notes/ React Flow graph
│       ├── store/     Zustand state
│       └── hooks/     Socket.io, day/night, agent activity
├── backend/           Express + Socket.io
│   ├── routes/        REST API
│   ├── services/      Telegram bots + agent engine
│   ├── sockets/       Real-time handlers
│   └── db/            SQLite schema
└── mock-data/         Realistic seed data (swap-ready)
```

---

## 🔌 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend port (default: 3001) |
| `SMOKE_BOT_TOKEN` | Smoke's Telegram bot token |
| `STACKZ_BOT_TOKEN` | Stackz's Telegram bot token |
| `TELEGRAM_CHAT_ID` | Your Telegram chat ID |
| `VITE_API_URL` | Backend API URL for frontend |
| `VITE_SOCKET_URL` | Socket.io URL for frontend |

---

## 🚀 Production Deployment

```bash
# Build frontend
npm run build --workspace=frontend

# Start backend
npm run start --workspace=backend
```

Serve `frontend/dist` with nginx or any static host. Point `VITE_API_URL` to your backend.

---

*The Agency HQ — Built with React Three Fiber, Framer Motion, Socket.io, and a lot of agent energy*
