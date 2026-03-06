# Agency HQ — Frontend Design System & Architecture

> This document defines the design system, component library, and architectural patterns
> for the Agency HQ dashboard. All new pages and components must follow these guidelines.

---

## Aesthetic Direction

- **Theme:** Dark mode, minimalist, premium corporate tech, futuristic
- **Background:** Animated 3D fluid blobs (deep blue, violet/purple, emerald green) via `Atmosphere.jsx`
- **Surfaces:** Glassmorphism with `backdrop-blur-xl`, luminous inner glows, gradient backgrounds
- **Typography:** `Outfit` (display/headers), `JetBrains Mono` (data/labels/monospace)
- **Colors:** Dark midnight base (`#060910`), vibrant neon accents (sky blue, emerald, violet, amber)
- **Animations:** Subtle, performance-conscious — CSS-driven where possible, Framer Motion for interactions

---

## Color Palette

### Base Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `hq-dark` | `#060910` | App background |
| `glass-bg` | `#0A0E1A` | Glass panel fill |

### Neon Accents
| Token | Hex | Usage |
|-------|-----|-------|
| `smoke-blue` | `#0EA5E9` | Primary accent, Smoke/Sheldon |
| `stackz-green` / `neon-green` | `#10B981` | Success, Stackz, business |
| `warden-amber` | `#F59E0B` | Warning, HR, Warden |
| `nebula-purple` | `#7C3AED` | Purple accent, gradients |
| `deep-violet` | `#5B21B6` | Deep purple variant |
| `plasma-blue` | `#2563EB` | Blue variant |

### Agent Colors (from `personalities.js`)
| Agent | Color |
|-------|-------|
| Smoke (Sheldon) | `#0EA5E9` |
| Stackz | `#10B981` |
| Warden | `#F59E0B` |
| Megaphone | `#EC4899` |
| Forge | `#6366F1` |
| Radar | `#14B8A6` |
| Canvas | `#A78BFA` |
| Cashflow | `#22C55E` |
| Founder | `#F97316` |

---

## Core Layout Components

### `Atmosphere.jsx` — Background
Fixed, non-interactive. Three animated blobs with `filter: blur(100-120px)` and staggered CSS animations.

### `TopBar.jsx` — Header
`bg-black/50 backdrop-blur-xl`. Tri-color gradient accent line with shimmer at bottom. Logo badge with glow shadow. Live clock + notification badges.

### `Sidebar.jsx` — Navigation
`bg-black/40 backdrop-blur-xl`. Active item has blue→purple gradient left bar with glow. Agent avatars with hover glow rings. Gradient fade dividers between sections.

**Current sidebar order:**
1. 📋 The Briefing (default landing)
2. 🛡️ Approval Inbox
3. 📥 Lane Queue
4. 🤖 Agents
5. ⚡ Token Economy
6. 📡 Radar
7. 💰 Financial
8. 🧬 Health & Life
9. 🔗 Smart Notes
10. 🕐 Timeline

### `GlassPanel.jsx` — Card Surface
Props: `neonAccent` ('blue' | 'green' | 'amber' | 'purple'), `hover`, `animate`.
Features: `backdrop-blur-xl`, gradient background fill, accent-colored top-edge highlight, hover glow.

### `PageHeader.jsx` — Page Title
Props: `title`, `accent` (gradient text), `accentColor`, `subtitle`, `actions`.
Uses `text-2xl font-display font-bold`, softer subtitle at `text-white/25`.

---

## Shared Components

### `ConfidenceArc.jsx`
SVG arc progress indicator (0–100). Teal ≥60, amber 40–59, red <40. Props: `value`, `size`.

### `PriorityBadge.jsx`
Color-coded pill: LOW (muted), MEDIUM (blue), HIGH (amber), CRITICAL (red + `animate-pulse`). Prop: `priority`.

### `StatusChip.jsx`
Generic badge. Props: `label`, `color`, `small`.

### `DebatePanel.jsx`
Two-column agent conflict view. Agent A vs Agent B with ⚡ divider. Stackz synthesis section below. Prop: `debate`.

### `AgentAvatar.jsx`
Colored initial-based avatar mapped via `AGENT_PERSONALITIES`. Props: `agentId`, `size`.

---

## CSS Utilities (from `index.css`)

### Glass Panels
- `.glass-panel` — base glass with blur/glow
- `.glass-panel-hover` — enhanced hover state
- `.glass-smoke` — blue-tinted glass variant

### Neon Text
- `.neon-text-smoke` — sky blue glow
- `.neon-text-green` — emerald glow
- `.neon-text-purple` — violet glow

### Buttons
- `.btn-gradient-blue` — blue gradient fill
- `.btn-gradient-green` — green gradient fill (used for "Approve")

### Misc
- `.hq-label` — `text-[10px] font-mono text-white/30 uppercase tracking-widest` section labels
- `.shimmer-overlay` — moving highlight animation

---

## Page Architecture

### Routing
- State-based via Zustand `useUIStore` → `activeView` string
- `App.jsx` maps `activeView` → component via `PAGE_MAP`
- Default: `'briefing'` → `BriefingPage`

### Data Sources
- Mock data: `@mock/` alias → `../mock-data/` (configured in `vite.config.js`)
- Available: `lanes.json`, `approval-inbox.json`, `agent-health.json`, `token-economy.json`, `radar-signals.json`, `briefing.json`, `timeline.json`, `agents.json`, `financial.json`, `health.json`, `notes.json`, `startups.json`

### State Management
- `useUIStore` — view routing, UI toggles, loading state
- `useAgentStore` — agent data
- `useApprovalStore` — old approval system
- `useApprovalInboxStore` — new approval inbox (approve/reject/modify + resolved history)
- `useSyncBusStore` — sync bus messages

---

## Existing Pages

| Page | File | Key Features |
|------|------|-------------|
| The Briefing | `BriefingPage.jsx` | Premium GlassPanel, 6 collapsible sections, Stackz voice |
| Approval Inbox | `ApprovalInboxPage.jsx` | Approval cards, confidence arcs, debate view, actions |
| Lane Queue | `LaneQueuePage.jsx` | 3-col Kanban, priority badges, blocked glow |
| Agents | `AgentHealthPage.jsx` | Collapsible teams, lead budget bars, 6 metrics per agent |
| Token Economy | `TokenEconomyPage.jsx` | 4 KPI cards, team bars, agent table, warnings |
| Radar | `RadarPage.jsx` | 6-col Kanban, TAM, Compounding shimmer |
| Financial | `FinancialDashboard.jsx` | Revenue timeline, KPIs, Stackz reactor |
| Health & Life | `HealthDashboard.jsx` | Health metrics, Smoke reactor |
| Smart Notes | `SmartNotes.jsx` | Knowledge graph |
| Timeline | `TimelinePage.jsx` | Vertical timeline, pill filters, expandable context |

---

## Design Rules for New Features

1. **Always use GlassPanel** for card surfaces — never raw divs with ad-hoc backgrounds
2. **Use PageHeader** for every page title — maintains consistent heading hierarchy
3. **Match spacing** — `p-6` page padding, `gap-5` between sections
4. **Use font-display** for headings, `font-mono` for data/labels
5. **Use neon accents sparingly** — one primary accent color per page section
6. **Expandable sections** use Framer Motion `AnimatePresence` with `height: 'auto'` animation
7. **Status indicators** must glow — use `boxShadow` with `40`-`60` alpha suffix
8. **Text opacity hierarchy** — titles `white/90`, body `white/50`, labels `white/25`, muted `white/15`
9. **All mock data** goes in `mock-data/` and is imported via `@mock/` alias
10. **Agent identity** always rendered via `AgentAvatar` + `AGENT_PERSONALITIES` lookup

---

## Tech Stack

- **Framework:** React 18
- **Build:** Vite 5
- **Styling:** Tailwind CSS v3
- **Animations:** Framer Motion
- **State:** Zustand
- **Fonts:** Outfit + JetBrains Mono (Google Fonts, loaded in `index.html`)
