# Agents Tab — Career Specialist App

**Date:** 2026-06-08  
**Status:** Approved

---

## Context

Student Success Managers (SSMs) need visibility into what the AI agents are doing on behalf of each student — which jobs were found, which were filtered, how resumes were tailored, and which applications were submitted. Today there is no way for an SSM to monitor agent activity per student. This feature adds a dedicated Agents tab inside each student's profile so SSMs can watch the pipeline in real time.

---

## Scope

**Option A — Agents Tab Only.** Build the Agents tab as a fully working component with mock real-time data. Scaffold a minimal `/career-specialist` route and student profile shell to house it. The full student profile (Overview tab, Applications tab content) is out of scope and added later.

---

## Routes

| Route | Component | Notes |
|---|---|---|
| `/career-specialist` | `CareerSpecialistPage` | Simple student list, 3–5 mock students |
| `/career-specialist/students/:id` | `StudentProfilePage` | Profile shell + tab nav; Agents tab is default |

Both routes are added to `src/App.tsx` alongside existing routes, wrapped in `<AppLayout>`.

---

## UI Design

**Design system:** Lightforth standard — white cards on `#eef4ff` background, Instrument Sans font, primary blue `#2563eb`, `border-border` borders, `shadow-sm`. Uses existing `.lf-panel`, `.lf-tabs`, `.lf-tab`, `.lf-tab-active` classes where applicable.

### Student Profile Shell
Thin header bar showing student avatar initials, name, and role/location. Tab nav with Overview · **Agents** · Applications. Agents tab is active by default.

### Agents Tab — 3 sections stacked

**1. Stats Summary Row**  
Four stat cards in a grid: Found / Matched / Tailored / Applied. Each shows a large number, a muted subtext (e.g. "16 rejected", "2 in progress"), and a green delta where relevant. Uses `.lf-panel`.

**2. Agent Status Cards**  
Four cards in a grid, one per agent: Scout · Filter · Tailor · Driver. Each card shows:
- Agent name (uppercase, small, bold)
- Status badge pill: `running` (green), `working` (yellow), `idle` (gray)
- One-line description of current task
- Small muted stat line (e.g. "34 jobs found", "5 applied · 1 pending")

**3. Tabbed Live Feed**  
Panel with tab bar: All · Scout · Filter · Tailor · Driver. Active tab has primary blue underline. Top-right shows a green "● Live" indicator.

Feed rows are a 3-column grid: timestamp · agent name · message. Alternating row backgrounds (`#fff` / `#fafbff`). New events append at the bottom; feed auto-scrolls. Clicking a tab filters to that agent's events only (client-side).

---

## Components

```
src/pages/career-specialist/
  CareerSpecialistPage.tsx     — student list with mock data
  StudentProfilePage.tsx       — profile shell + tab routing

src/components/agents/
  AgentsTab.tsx                — orchestrates the 3 sections, owns useAgentSession
  AgentStatsSummary.tsx        — 4 stat cards
  AgentStatusCards.tsx         — 4 agent status cards
  AgentFeed.tsx                — tabbed feed with filtering + auto-scroll
```

---

## Data & State

No backend. A custom hook `useAgentSession(studentId)` drives all state:

```ts
type AgentName = 'scout' | 'filter' | 'tailor' | 'driver' | 'system'

type FeedEvent = {
  id: string
  timestamp: Date
  agent: AgentName
  message: string
}

type AgentStatus = {
  name: AgentName
  status: 'running' | 'working' | 'idle'
  currentTask: string
  stat: string
}

type AgentSession = {
  stats: { found: number; matched: number; tailored: number; applied: number }
  agents: AgentStatus[]
  events: FeedEvent[]
}
```

The hook initialises with seed data and appends a new mock `FeedEvent` every 3–5 seconds via `setInterval`, also updating the relevant agent's status and summary stats. This produces the live feel without a backend.

---

## Verification

1. Run `npm run dev`, navigate to `/career-specialist`
2. Click any student → confirm profile shell loads with Agents tab active
3. Confirm 3 sections render: stats row, agent cards, tabbed feed
4. Watch feed for ~15 seconds — new events should appear and auto-scroll
5. Click each feed tab (Scout, Filter, etc.) — confirm feed filters correctly
6. Confirm fonts, colors, and spacing match existing Lightforth pages (white cards, `#eef4ff` background, Instrument Sans)