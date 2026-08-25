# Lightforth Frontend Rebuild — Design Spec

**Date:** 2026-04-30
**Status:** Approved
**Scope:** Frontend only — backend hosted externally, all data via Axios REST calls.

---

## 1. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| Component library | shadcn/ui + Radix UI |
| Animations | Framer Motion |
| Icons | Lucide React |
| Server state | TanStack React Query v5 |
| HTTP client | Axios |
| Font | Instrument Sans (Google Fonts) |

---

## 2. Project Structure

```
src/
├── components/
│   ├── ui/            # shadcn primitives (Button, Card, Dropdown, Toast, etc.)
│   ├── layout/        # AppLayout, Sidebar, TopNav
│   └── shared/        # ResumeUploadDropdown, UpgradeCard, CreditBanner, ActionCard
├── pages/
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── MyDocuments.tsx
│   ├── ResumeBuilder.tsx
│   ├── AutoApply.tsx
│   ├── InterviewPrep.tsx
│   ├── InterviewCopilot.tsx
│   ├── BillingPage.tsx
│   └── SettingsPage.tsx
├── hooks/
│   └── useAuth.tsx    # user context + session
├── lib/
│   └── api.ts         # Axios instance with auth interceptors
├── App.tsx            # Route definitions
└── main.tsx
```

---

## 3. Routing

| Path | Page | Access |
|------|------|--------|
| `/auth` | Auth (login/signup) | Public |
| `/` | Dashboard | Protected |
| `/documents` | My Documents | Protected |
| `/resume-builder` | Resume Builder | Protected |
| `/auto-apply` | Auto-Apply | Protected |
| `/interview-prep` | Interview Prep | Protected |
| `/interview-copilot` | Interview Copilot | Protected |
| `/billing` | Billing & Subscription | Protected |
| `/settings` | Settings | Protected |

Protected routes check `useAuth` — redirect to `/auth` if no session.

---

## 4. Design System

### Colors (Tailwind config extensions)
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#2563EB` | Sidebar active, buttons, links |
| `primary-foreground` | `#FFFFFF` | Text on primary |
| `background` | `#F8FAFC` | Page background |
| `card` | `#FFFFFF` | Card surfaces |
| `muted` | `#F1F5F9` | Banners, secondary bg |
| `muted-foreground` | `#64748B` | Secondary text |
| `foreground` | `#0F172A` | Primary text |
| `destructive` | `#DC2626` | Reject, delete actions |
| `success` | `#16A34A` | ATS badge, accept actions |
| `upgrade-from` | `#1E3A5F` | Upgrade card gradient start |
| `upgrade-to` | `#1D4ED8` | Upgrade card gradient end |

### Typography
- Font: **Instrument Sans** (loaded from Google Fonts)
- Base size: 14px
- Headings: 20–28px, semibold
- Muted/secondary: 13px, `text-muted-foreground`

### Key Shared Components

| Component | Description |
|-----------|-------------|
| `<Sidebar />` | Left nav: logo, nav links, active state, Upgrade card at bottom |
| `<TopNav />` | Top bar: Lightforth logo, notification bell with badge, help icon, avatar |
| `<UpgradeCard />` | Dark navy gradient card, bottom of sidebar, "Upgrade Now" CTA |
| `<CreditBanner />` | Dismissible gray bar: "0 credits remaining today · Upgrade ×" |
| `<ResumeUploadDropdown />` | Blue upload row with dropdown: "Upload a Resume" / "Use Lightforth Resume" |
| `<ActionCard />` | Post-upload next-step cards (Tailor / Interview Prep / Copilot) |
| `<TemplateGrid />` | Resume Builder: template picker with preview panel |
| `<ATSPanel />` | Resume Builder: right panel with job description input + score bars |

---

## 5. State Management

### Auth
- `useAuth` context wraps the app
- On mount: calls `GET /api/me` via Axios
- Stores: `{ user, plan, credits, isLoading }`
- Protected routes redirect to `/auth` when `!user && !isLoading`

### Server State
- React Query for all async data (resumes, credits, templates)
- Default config: `staleTime: 5min`, `gcTime: 30min`, `refetchOnWindowFocus: false`

### Local/UI State
- `useState` only for transient UI (dropdowns, modals, upload progress)
- No global store — keeps things simple and debuggable

---

## 6. API Layer

**File:** `src/lib/api.ts`

```ts
// Axios instance
baseURL: import.meta.env.VITE_API_BASE_URL
// Request interceptor: attach Bearer token from localStorage
// Response interceptor: on 401, clear session and redirect to /auth
```

**Environment variables:**
```
VITE_API_BASE_URL=https://api.lightforth.ai
```

---

## 7. Dashboard Flow (3 States)

### State 1 — Empty (no resume uploaded)
- Greeting: date + "Welcome [Name], let's get you hired."
- `<ResumeUploadDropdown />` — light blue card with upload CTA
- "We'll analyze your resume and tailor it to your next job application."
- "How it works" collapsed section with help links

### State 2 — Dropdown open
- Upload CTA expands dropdown with two options:
  - "Upload a Resume" (file picker)
  - "Use Lightforth Resume" (uses existing resume in system)

### State 3 — Resume uploaded
- Uploaded file chip (filename + size + ✕ to remove)
- `<CreditBanner />` if credits are 0
- "Resume uploaded. What do you want to do next?"
- Three `<ActionCard />` components:
  - Tailor my Resume → (highlighted/primary border)
  - Practice For Interview →
  - Start Interview Copilot →

---

## 8. Resume Builder Flow (4 Steps)

### Step 1 — Select Job Profile
Left sidebar step indicator active on "Select a Job Profile".

### Step 2 — Choose Template
- Template grid (Professional, Lora Modern, Garamond Classic, Calibri Clean)
- Right panel: live template preview
- Selected template shows green checkmark + "Calibri Clean selected" label
- "Proceed" CTA at bottom

### Step 3 — Job Title
User enters the target job title.

### Step 4 — Build
- Left panel: accordion sections (Personal Info, Professional Summary, Experience, Education, Projects, Skills, Language, Certificate, Social Links) + progress circle
- Center panel: live resume preview
- Right panel: ATS Tips + Job Description textarea + "Unlock AI Suggestions"

### AI Diff View (after tailoring)
- Full-screen resume with tracked changes (red strikethrough = removed, green = added)
- Top actions: Regenerate | Reject ✕ | Accept ✓

### ATS Optimization View
- Left: clean resume preview
- Right: ATS Optimization Overview card — circular score, job description, score bars (Headline Match, Impact Score, Skill Match, Experience Score, Style Score, Total Score)

---

## 9. Implementation Order (flows)

1. **Scaffold** — project setup, routing, layout shell, design tokens
2. **Dashboard** — all 3 states (empty, dropdown, uploaded + action cards)
3. **Resume Builder** — template selection → builder → AI diff → ATS panel
4. **Auto-Apply** — upgrade gate + 4-step wizard + jobs tab + applied tab
5. **Interview Prep** — setup → settings → active interview → report
6. **Interview Copilot** — setup → live feed
7. **Sign Up / Auth** — login + signup forms
8. **Other pages** — Billing, Settings, My Documents, Explore

---

*Spec approved by user on 2026-04-30.*
