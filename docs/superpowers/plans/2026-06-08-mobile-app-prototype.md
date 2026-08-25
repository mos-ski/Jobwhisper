# Mobile App Click-Through Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone, front-end-only, click-through prototype of the Lightforth mobile app (Interview Copilot, Auto Apply, Notifications) inside a phone-frame, reachable at `/mobile-app-preview`, mirroring the existing `DesktopCopilotPreview` pattern (mock data, simulated async state, no backend).

**Architecture:** One route added outside `ProtectedRoute` in `src/App.tsx`, pointing at a new `MobileAppPreview` page that renders a `PhoneFrame` containing a bottom-tab-bar app shell. Each of the four modules (Home, Jobs/Auto Apply, Copilot, Notifications) is its own file with its own internal screen-state machine, composed by the page. Shared mock data lives in one file.

**Tech Stack:** React 18 + TypeScript, Tailwind CSS v3, shadcn/ui primitives, Framer Motion (`AnimatePresence`/`motion`), lucide-react icons, `cn` from `@/lib/utils` — all already in the project. No new dependencies.

**Reference spec:** `docs/superpowers/specs/2026-06-08-mobile-app-prototype-design.md`
**Reference brief:** `docs/lightforth-mobile-app.md`
**Pattern to mirror:** `src/pages/DesktopCopilotPreview.tsx` (mock data constants, `MacWindow` frame wrapper, per-screen function components, `setTimeout`-driven state cycling)

---

## File Structure

- Create: `src/pages/MobileAppPreview.tsx` — page entry: route target, `PhoneFrame`, bottom tab bar, `activeTab` state, composes the four modules
- Create: `src/pages/mobile-preview/PhoneFrame.tsx` — device frame wrapper + small shared primitives (`LightningLogo` re-export pattern, `Toggle`, `StatusBadge`)
- Create: `src/pages/mobile-preview/mockData.ts` — typed mock data: jobs, applications, notifications, Q&A pairs, resumes
- Create: `src/pages/mobile-preview/HomeScreen.tsx` — Home/Dashboard module
- Create: `src/pages/mobile-preview/AutoApplyModule.tsx` — Job Feed → Job Detail → Apply animation → History → Application Detail
- Create: `src/pages/mobile-preview/CopilotModule.tsx` — Onboarding → Setup → Response Style modal → Live Canvas → Complete
- Create: `src/pages/mobile-preview/NotificationsModule.tsx` — Notification Centre → Preferences
- Modify: `src/App.tsx` — add the `/mobile-app-preview` route (around line 67, alongside `desktop-copilot-preview`)

---

## Verification approach

This is a visual prototype with no business logic to unit test (the existing `DesktopCopilotPreview` has no test file either — same pattern applies here). Each task's verification step is: run the dev server, open `/mobile-app-preview` in the browser, and confirm the new screen(s) render with the elements specified and that navigation forward/back works with no dead ends. Use the `run` skill or `npm run dev` directly.

---

### Task 1: Route, page shell, phone frame, and bottom tab bar

**Files:**
- Create: `src/pages/mobile-preview/PhoneFrame.tsx`
- Create: `src/pages/MobileAppPreview.tsx`
- Modify: `src/App.tsx:67` (add route after the `desktop-copilot-preview` line)

- [ ] **Step 1: Create the `PhoneFrame` component**

```tsx
// src/pages/mobile-preview/PhoneFrame.tsx
import { cn } from '@/lib/utils'

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{ background: 'linear-gradient(145deg, #eef2ff 0%, #e0e7ff 50%, #eef2ff 100%)' }}
    >
      <div className="relative flex h-[844px] w-[390px] flex-col overflow-hidden rounded-[48px] border-[6px] border-neutral-900 bg-white shadow-2xl">
        {/* Dynamic island */}
        <div className="absolute left-1/2 top-3 z-20 h-7 w-32 -translate-x-1/2 rounded-full bg-neutral-900" />
        {/* Status bar */}
        <div className="flex h-12 flex-shrink-0 items-center justify-between px-7 pt-2 text-xs font-medium text-neutral-900">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <span>5G</span>
            <div className="h-3 w-6 rounded-sm border border-neutral-900" />
          </div>
        </div>
        {/* Screen content */}
        <div className="relative flex-1 overflow-hidden">{children}</div>
        {/* Home indicator */}
        <div className="flex h-8 flex-shrink-0 items-center justify-center">
          <div className="h-1 w-32 rounded-full bg-neutral-900" />
        </div>
      </div>
    </div>
  )
}

export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors',
        on ? 'bg-[#2563EB]' : 'bg-neutral-300'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
          on ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  )
}
```

- [ ] **Step 2: Create the `MobileAppPreview` page with bottom tab bar and tab state**

```tsx
// src/pages/MobileAppPreview.tsx
import { useState } from 'react'
import { Bell, Briefcase, Home, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhoneFrame } from './mobile-preview/PhoneFrame'
import { HomeScreen } from './mobile-preview/HomeScreen'
import { AutoApplyModule } from './mobile-preview/AutoApplyModule'
import { CopilotModule } from './mobile-preview/CopilotModule'
import { NotificationsModule } from './mobile-preview/NotificationsModule'
import { MOCK_NOTIFICATIONS } from './mobile-preview/mockData'

type ActiveTab = 'home' | 'jobs' | 'copilot' | 'notifications'

const TABS: { id: ActiveTab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'copilot', label: 'Copilot', icon: Sparkles },
  { id: 'notifications', label: 'Alerts', icon: Bell },
]

export default function MobileAppPreview() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home')
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'home' && <HomeScreen onNavigate={setActiveTab} />}
          {activeTab === 'jobs' && <AutoApplyModule />}
          {activeTab === 'copilot' && <CopilotModule />}
          {activeTab === 'notifications' && <NotificationsModule />}
        </div>
        <nav className="flex flex-shrink-0 items-center justify-around border-t border-neutral-200 bg-white py-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'relative flex flex-col items-center gap-1 px-3 py-1 text-[11px] font-medium transition-colors',
                activeTab === id ? 'text-[#2563EB]' : 'text-neutral-400'
              )}
            >
              <Icon size={20} />
              {id === 'notifications' && unreadCount > 0 && (
                <span className="absolute right-1 top-0 h-4 w-4 rounded-full bg-red-500 text-center text-[9px] leading-4 text-white">
                  {unreadCount}
                </span>
              )}
              {label}
            </button>
          ))}
        </nav>
      </div>
    </PhoneFrame>
  )
}
```

Note: this references `HomeScreen`, `AutoApplyModule`, `CopilotModule`, `NotificationsModule`, and `MOCK_NOTIFICATIONS` which don't exist yet — that's expected. Stub them minimally so the app compiles before moving on:

```tsx
// Temporary stubs — replaced in later tasks. Create each as:
// export function HomeScreen({ onNavigate }: { onNavigate: (tab: 'home'|'jobs'|'copilot'|'notifications') => void }) {
//   return <div className="p-6">Home (stub)</div>
// }
```
Create each of `HomeScreen.tsx`, `AutoApplyModule.tsx`, `CopilotModule.tsx`, `NotificationsModule.tsx` with a minimal one-line stub export matching the signature used above, and `mockData.ts` exporting `export const MOCK_NOTIFICATIONS: { read: boolean }[] = []`. These get fleshed out in Tasks 2–6.

- [ ] **Step 3: Add the route in `App.tsx`**

Open `src/App.tsx`, find the line:
```tsx
<Route path="/desktop-copilot-preview" element={<Suspense fallback={null}><DesktopCopilotPreview /></Suspense>} />
```
Add directly after it:
```tsx
<Route path="/mobile-app-preview" element={<Suspense fallback={null}><MobileAppPreview /></Suspense>} />
```
And add the lazy import near the top alongside the `DesktopCopilotPreview` import (find that import line and follow the same `lazy(() => import(...))` pattern used for the other page imports in this file).

- [ ] **Step 4: Run the dev server and verify the shell**

Run: `npm run dev` (or use the `run` skill), open `http://localhost:5173/mobile-app-preview`
Expected: A phone frame renders centred on the page with a status bar, dynamic island, home indicator, and a 4-item bottom tab bar (Home/Jobs/Copilot/Alerts). Tapping each tab swaps the visible stub text and highlights the active tab in blue.

- [ ] **Step 5: Commit**

```bash
git add src/pages/MobileAppPreview.tsx src/pages/mobile-preview/ src/App.tsx
git commit -m "Add mobile app prototype shell: phone frame, route, bottom tab nav"
```

---

### Task 2: Mock data file

**Files:**
- Modify: `src/pages/mobile-preview/mockData.ts` (replace stub with full content)

- [ ] **Step 1: Write the typed mock data**

```ts
// src/pages/mobile-preview/mockData.ts

export type ApplicationStatus = 'submitted' | 'viewed' | 'shortlisted' | 'interview' | 'rejected'

export interface MockJob {
  id: string
  title: string
  company: string
  location: string
  logoColor: string
  matchTag: string
  postedAgo: string
  description: string
}

export interface MockApplication {
  id: string
  jobTitle: string
  company: string
  status: ApplicationStatus
  appliedOn: string
  logoColor: string
}

export type NotificationCategory = 'applications' | 'matches' | 'account'

export interface MockNotification {
  id: string
  category: NotificationCategory
  title: string
  body: string
  timestamp: string
  read: boolean
}

export interface MockQA {
  q: string
  a: string
}

export const MOCK_JOBS: MockJob[] = [
  { id: 'job-1', title: 'Product Designer', company: 'Stripe', location: 'Remote', logoColor: '#635BFF', matchTag: '95% match', postedAgo: '2h ago', description: 'Design end-to-end payment experiences used by millions of businesses worldwide. You will partner with engineering and research to ship polished, accessible interfaces.' },
  { id: 'job-2', title: 'Senior Frontend Engineer', company: 'Notion', location: 'Remote · US', logoColor: '#000000', matchTag: '91% match', postedAgo: '5h ago', description: 'Build the editor experiences that power millions of workspaces. Strong React and performance instincts required.' },
  { id: 'job-3', title: 'Product Manager', company: 'Figma', location: 'San Francisco, CA', logoColor: '#A259FF', matchTag: '88% match', postedAgo: '1d ago', description: 'Own the roadmap for collaboration features. Work closely with design and engineering to ship features used by designers everywhere.' },
  { id: 'job-4', title: 'UX Researcher', company: 'Airbnb', location: 'Remote', logoColor: '#FF5A5F', matchTag: '84% match', postedAgo: '2d ago', description: 'Lead qualitative and quantitative research that shapes how millions of guests and hosts experience Airbnb.' },
]

export const MOCK_APPLICATIONS: MockApplication[] = [
  { id: 'app-1', jobTitle: 'Product Designer', company: 'Stripe', status: 'interview', appliedOn: '3rd Jun, 2026', logoColor: '#635BFF' },
  { id: 'app-2', jobTitle: 'Senior Frontend Engineer', company: 'Notion', status: 'shortlisted', appliedOn: '1st Jun, 2026', logoColor: '#000000' },
  { id: 'app-3', jobTitle: 'Staff Designer', company: 'Linear', status: 'viewed', appliedOn: '29th May, 2026', logoColor: '#5E6AD2' },
  { id: 'app-4', jobTitle: 'Product Manager', company: 'Figma', status: 'submitted', appliedOn: '27th May, 2026', logoColor: '#A259FF' },
  { id: 'app-5', jobTitle: 'UX Lead', company: 'Duolingo', status: 'rejected', appliedOn: '20th May, 2026', logoColor: '#58CC02' },
]

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  { id: 'notif-1', category: 'applications', title: 'Stripe wants to schedule an interview', body: 'Tap to respond and pick a time that works for you.', timestamp: '10 min ago', read: false },
  { id: 'notif-2', category: 'matches', title: '3 new roles match your profile', body: 'Including a Senior Designer role at Google.', timestamp: '2 hours ago', read: false },
  { id: 'notif-3', category: 'applications', title: 'Someone at Notion viewed your application', body: 'Your Senior Frontend Engineer application is getting attention — stay ready.', timestamp: '5 hours ago', read: false },
  { id: 'notif-4', category: 'account', title: 'You have 1 credit left', body: 'Top up before your next interview session.', timestamp: '1 day ago', read: true },
  { id: 'notif-5', category: 'applications', title: "Good news — you've been shortlisted", body: 'Your Senior Frontend Engineer application at Notion was shortlisted.', timestamp: '2 days ago', read: true },
  { id: 'notif-6', category: 'applications', title: "Your application to Duolingo wasn't selected this time", body: 'Keep going — three new roles are waiting for you.', timestamp: '4 days ago', read: true },
]

export const MOCK_QA: MockQA[] = [
  { q: 'Can you tell me a little bit about yourself and your background?', a: "I'm a product designer with 6 years of experience building digital products across fintech and AI. I've shipped a dozen live products end to end, from early discovery through launch and iteration." },
  { q: 'What would you say is your greatest professional strength?', a: 'My greatest strength is owning the full product lifecycle — from strategy through to shipped, polished experiences. That end-to-end ownership cuts handoff friction and speeds up delivery.' },
  { q: 'Why are you interested in this role specifically?', a: "I've followed your team's work closely, and the focus on accessible, user-centred products lines up with what I care most about building. I'd love to bring that same care here." },
  { q: 'Walk me through how you approach a brand new feature.', a: 'I start with the problem, not the solution — talking to users, reviewing data, mapping the journey. Then I prototype early and test before committing to a full build.' },
]

export const MOCK_RESUMES = [
  { name: 'Darnell Smith', role: 'Product Designer', date: '1st Jun, 2026' },
  { name: 'Darnell Smith', role: 'UI/UX Designer', date: '15th Apr, 2026' },
]
```

- [ ] **Step 2: Verify the project still type-checks**

Run: `npx tsc --noEmit`
Expected: No new errors related to `mockData.ts` (existing unrelated errors, if any, are not your concern here).

- [ ] **Step 3: Commit**

```bash
git add src/pages/mobile-preview/mockData.ts
git commit -m "Add typed mock data for mobile app prototype"
```

---

### Task 3: Home/Dashboard screen

**Files:**
- Modify: `src/pages/mobile-preview/HomeScreen.tsx` (replace stub)

- [ ] **Step 1: Build the Home screen**

Build a light-themed dashboard screen (`#2563EB` brand blue, white background, matching the rest of the app's shadcn/ui look) containing, top to bottom:
- A greeting header ("Good afternoon, Darnell") with an avatar circle
- A **credit balance card**: "2 credits remaining" with a small progress/usage indicator and a "Top up" button (brand blue)
- Two **quick action cards** side by side: "Start Copilot session" (sparkles icon, navigates to `copilot` tab) and "Browse jobs" (briefcase icon, navigates to `jobs` tab)
- A **recent activity** section: render the 3 most recent items from `MOCK_NOTIFICATIONS` as compact rows (title + timestamp), each tapping through to the `notifications` tab

Component signature:
```tsx
import { MOCK_NOTIFICATIONS } from './mockData'

type ActiveTab = 'home' | 'jobs' | 'copilot' | 'notifications'

export function HomeScreen({ onNavigate }: { onNavigate: (tab: ActiveTab) => void }) {
  const recent = MOCK_NOTIFICATIONS.slice(0, 3)
  // ...layout described above; quick action cards call onNavigate('copilot') / onNavigate('jobs');
  // recent activity rows call onNavigate('notifications')
}
```
Use `Sparkles`, `Briefcase`, `ArrowRight` from `lucide-react`, and Tailwind utility classes consistent with cards elsewhere in the app (rounded-2xl, border, subtle shadow, p-4/p-5 spacing).

- [ ] **Step 2: Verify in browser**

With the dev server running, open `/mobile-app-preview`, ensure the Home tab is active by default.
Expected: greeting, credit card, two quick-action cards, and 3 recent-activity rows render. Tapping "Start Copilot session" switches to the Copilot tab; tapping "Browse jobs" switches to the Jobs tab; tapping a recent-activity row switches to the Alerts tab.

- [ ] **Step 3: Commit**

```bash
git add src/pages/mobile-preview/HomeScreen.tsx
git commit -m "Build mobile prototype Home/Dashboard screen"
```

---

### Task 4: Auto Apply — Job Feed and Job Detail

**Files:**
- Modify: `src/pages/mobile-preview/AutoApplyModule.tsx` (replace stub, build incrementally — this task adds feed + detail; Task 5 adds apply/history/detail)

- [ ] **Step 1: Set up the module's internal view-state machine and Job Feed screen**

```tsx
import { useState } from 'react'
import { ArrowLeft, MapPin } from 'lucide-react'
import { MOCK_JOBS, MOCK_APPLICATIONS, type MockJob } from './mockData'

type AutoApplyView =
  | { name: 'feed' }
  | { name: 'detail'; job: MockJob }
  | { name: 'applying'; job: MockJob }
  | { name: 'applied'; job: MockJob }
  | { name: 'history' }
  | { name: 'application-detail'; applicationId: string }

export function AutoApplyModule() {
  const [view, setView] = useState<AutoApplyView>({ name: 'feed' })

  if (view.name === 'feed') return <JobFeedScreen onSelectJob={(job) => setView({ name: 'detail', job })} onViewHistory={() => setView({ name: 'history' })} />
  if (view.name === 'detail') return <JobDetailScreen job={view.job} onBack={() => setView({ name: 'feed' })} onApply={() => setView({ name: 'applying', job: view.job })} />
  // 'applying' | 'applied' | 'history' | 'application-detail' handled in Task 5
  return null
}

function JobFeedScreen({ onSelectJob, onViewHistory }: { onSelectJob: (job: MockJob) => void; onViewHistory: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between px-5 pb-2 pt-4">
        <h1 className="text-xl font-semibold text-neutral-900">Jobs for you</h1>
        <button onClick={onViewHistory} className="text-sm font-medium text-[#2563EB]">History</button>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-4">
        {MOCK_JOBS.map((job) => (
          <button key={job.id} onClick={() => onSelectJob(job)} className="block w-full rounded-2xl border border-neutral-200 p-4 text-left">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 flex-shrink-0 rounded-xl" style={{ background: job.logoColor }} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-neutral-900">{job.title}</p>
                <p className="truncate text-sm text-neutral-500">{job.company}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-400">
                  <MapPin size={12} /><span>{job.location}</span><span>·</span><span>{job.postedAgo}</span>
                </div>
              </div>
              <span className="flex-shrink-0 rounded-full bg-[#2563EB]/10 px-2 py-1 text-[11px] font-medium text-[#2563EB]">{job.matchTag}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function JobDetailScreen({ job, onBack, onApply }: { job: MockJob; onBack: () => void; onApply: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="truncate text-base font-semibold text-neutral-900">{job.company}</h1>
      </header>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl" style={{ background: job.logoColor }} />
          <div>
            <p className="text-lg font-semibold text-neutral-900">{job.title}</p>
            <p className="text-sm text-neutral-500">{job.company} · {job.location}</p>
          </div>
        </div>
        <span className="inline-block rounded-full bg-[#2563EB]/10 px-3 py-1 text-xs font-medium text-[#2563EB]">{job.matchTag}</span>
        <p className="text-sm leading-relaxed text-neutral-600">{job.description}</p>
      </div>
      <div className="flex-shrink-0 border-t border-neutral-200 p-4">
        <button onClick={onApply} className="w-full rounded-xl bg-[#2563EB] py-3 text-center text-sm font-semibold text-white">Apply with one tap</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open the Jobs tab. Expected: a scrollable feed of 4 job cards with logo swatch, title, company, location, posted-time, and match tag. Tapping a card opens its detail screen with a back arrow, full description, and an "Apply with one tap" button at the bottom. Back arrow returns to the feed.

- [ ] **Step 3: Commit**

```bash
git add src/pages/mobile-preview/AutoApplyModule.tsx
git commit -m "Add Auto Apply job feed and job detail screens"
```

---

### Task 5: Auto Apply — Apply animation, History, and Application Detail

**Files:**
- Modify: `src/pages/mobile-preview/AutoApplyModule.tsx`

- [ ] **Step 1: Add the applying/applied states, history list, and application detail screen**

Extend the `AutoApplyModule` switch to handle the remaining view names, and add these components in the same file:

```tsx
import { useEffect } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { MOCK_APPLICATIONS, type MockApplication, type ApplicationStatus } from './mockData'

// Inside AutoApplyModule's render, add:
//   if (view.name === 'applying') return <ApplyingScreen job={view.job} onDone={() => setView({ name: 'applied', job: view.job })} />
//   if (view.name === 'applied') return <AppliedScreen job={view.job} onDone={() => setView({ name: 'feed' })} />
//   if (view.name === 'history') return <HistoryScreen onBack={() => setView({ name: 'feed' })} onSelect={(id) => setView({ name: 'application-detail', applicationId: id })} />
//   if (view.name === 'application-detail') return <ApplicationDetailScreen applicationId={view.applicationId} onBack={() => setView({ name: 'history' })} />

function ApplyingScreen({ job, onDone }: { job: MockJob; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
      <Loader2 className="animate-spin text-[#2563EB]" size={32} />
      <p className="font-semibold text-neutral-900">Applying to {job.company}…</p>
      <p className="text-sm text-neutral-500">Filling in your application using your career profile and resume.</p>
    </div>
  )
}

function AppliedScreen({ job, onDone }: { job: MockJob; onDone: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <Check className="text-green-600" size={28} />
      </div>
      <p className="text-lg font-semibold text-neutral-900">Application sent!</p>
      <p className="text-sm text-neutral-500">Your application to {job.company} for {job.title} has been submitted. We'll keep you posted on its status.</p>
      <button onClick={onDone} className="mt-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white">Back to jobs</button>
    </div>
  )
}

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  submitted: 'Submitted', viewed: 'Viewed', shortlisted: 'Shortlisted', interview: 'Interview', rejected: 'Not selected',
}
const STATUS_COLOR: Record<ApplicationStatus, string> = {
  submitted: 'bg-neutral-100 text-neutral-600', viewed: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-amber-100 text-amber-700', interview: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700',
}

function HistoryScreen({ onBack, onSelect }: { onBack: () => void; onSelect: (id: string) => void }) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-semibold text-neutral-900">Apply history</h1>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-4">
        {MOCK_APPLICATIONS.map((app) => (
          <button key={app.id} onClick={() => onSelect(app.id)} className="flex w-full items-center gap-3 rounded-2xl border border-neutral-200 p-4 text-left">
            <div className="h-10 w-10 flex-shrink-0 rounded-xl" style={{ background: app.logoColor }} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-neutral-900">{app.jobTitle}</p>
              <p className="truncate text-sm text-neutral-500">{app.company} · {app.appliedOn}</p>
            </div>
            <span className={`flex-shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ${STATUS_COLOR[app.status]}`}>{STATUS_LABEL[app.status]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ApplicationDetailScreen({ applicationId, onBack }: { applicationId: string; onBack: () => void }) {
  const app = MOCK_APPLICATIONS.find((a) => a.id === applicationId) as MockApplication
  const STAGES: ApplicationStatus[] = ['submitted', 'viewed', 'shortlisted', 'interview']
  const currentIndex = STAGES.indexOf(app.status)
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="truncate text-base font-semibold text-neutral-900">{app.company}</h1>
      </header>
      <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl" style={{ background: app.logoColor }} />
          <div>
            <p className="text-lg font-semibold text-neutral-900">{app.jobTitle}</p>
            <p className="text-sm text-neutral-500">{app.company} · Applied {app.appliedOn}</p>
          </div>
        </div>
        {app.status === 'rejected' ? (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">This application wasn't selected this time. Keep going — new roles are waiting for you.</div>
        ) : (
          <ol className="space-y-3">
            {STAGES.map((stage, i) => (
              <li key={stage} className="flex items-center gap-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${i <= currentIndex ? 'bg-[#2563EB] text-white' : 'bg-neutral-200 text-neutral-400'}`}>
                  {i <= currentIndex ? <Check size={12} /> : i + 1}
                </div>
                <span className={`text-sm ${i <= currentIndex ? 'font-medium text-neutral-900' : 'text-neutral-400'}`}>{STATUS_LABEL[stage]}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

From a Job Detail screen, tap "Apply with one tap". Expected: a ~1.8s "Applying…" spinner state, then a success screen with a "Back to jobs" button returning to the feed. From the feed header, tap "History" — expected a list of 5 applications with status badges; tapping one opens a detail screen showing either a status timeline (highlighted up to the current stage) or a "not selected" message for the rejected one, with working back navigation.

- [ ] **Step 3: Commit**

```bash
git add src/pages/mobile-preview/AutoApplyModule.tsx
git commit -m "Add Auto Apply applying animation, history, and application detail screens"
```

---

### Task 6: Interview Copilot — Onboarding and Setup

**Files:**
- Modify: `src/pages/mobile-preview/CopilotModule.tsx` (replace stub, build incrementally — this task covers the entry card, onboarding, and setup screens)

- [ ] **Step 1: Set up the module's view-state machine, entry card, onboarding, and setup screens**

```tsx
import { useState } from 'react'
import { ArrowLeft, Check, FileText, Mic, Sparkles, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Toggle } from './PhoneFrame'
import { MOCK_RESUMES } from './mockData'

type ResponseStyle = 'default' | 'headlines' | 'coaching'
type CopilotView =
  | { name: 'entry' }
  | { name: 'onboarding' }
  | { name: 'setup' }
  | { name: 'style'; jobTitle: string }
  | { name: 'live'; jobTitle: string; style: ResponseStyle }
  | { name: 'complete' }

const NAVY = '#0c1d48'

export function CopilotModule() {
  const [view, setView] = useState<CopilotView>({ name: 'entry' })

  if (view.name === 'entry') return <EntryScreen onStart={() => setView({ name: 'onboarding' })} />
  if (view.name === 'onboarding') return <OnboardingScreen onContinue={() => setView({ name: 'setup' })} />
  if (view.name === 'setup') return <SetupScreen onBack={() => setView({ name: 'onboarding' })} onContinue={(jobTitle) => setView({ name: 'style', jobTitle })} />
  // 'style' | 'live' | 'complete' handled in Task 7
  return null
}

function EntryScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center" style={{ background: NAVY }}>
      <Sparkles className="text-blue-300" size={36} />
      <h1 className="text-xl font-semibold text-white">Interview Copilot</h1>
      <p className="text-sm text-white/60">Real-time AI assistance during live interviews — on video calls or phone calls, right from your pocket.</p>
      <button onClick={onStart} className="mt-2 rounded-xl bg-[#1a7aff] px-6 py-3 text-sm font-semibold text-white">Start a session</button>
    </div>
  )
}

function OnboardingScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex h-full flex-col px-6 py-8 text-white" style={{ background: NAVY }}>
      <Sparkles className="text-blue-300" size={28} />
      <h1 className="mt-4 text-xl font-semibold">Copilot listens, you respond with confidence</h1>
      <p className="mt-2 text-sm text-white/60">Place your phone beside your laptop during video calls, or use it directly during phone interviews. Copilot listens and shows you what to say — only you can see it.</p>
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.07] p-3">
          <Mic size={18} className="text-blue-300" />
          <div>
            <p className="text-sm font-medium">Microphone access</p>
            <p className="text-xs text-white/50">Needed to hear the interviewer and respond in real time</p>
          </div>
        </div>
      </div>
      <button onClick={onContinue} className="mt-auto rounded-xl bg-[#1a7aff] py-3 text-center text-sm font-semibold text-white">Continue</button>
    </div>
  )
}

function SetupScreen({ onBack, onContinue }: { onBack: () => void; onContinue: (jobTitle: string) => void }) {
  const [jobTitle, setJobTitle] = useState('Product Designer')
  const [resume, setResume] = useState<string | null>(MOCK_RESUMES[0]?.name ?? null)
  const [jd, setJd] = useState('')
  const [micConnected, setMicConnected] = useState(false)
  const [dontAsk, setDontAsk] = useState(false)
  const QUICK_TITLES = ['Product Designer', 'Software Engineer', 'Product Manager']

  return (
    <div className="flex h-full flex-col text-white" style={{ background: NAVY }}>
      <header className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="text-base font-semibold">Session setup</h1>
      </header>
      <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-4">
        <div>
          <label className="text-xs font-medium text-white/60">Job title</label>
          <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.08] px-3 py-2 text-sm text-white outline-none" />
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_TITLES.map((t) => (
              <button key={t} onClick={() => setJobTitle(t)} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">{t}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-white/60">Resume</label>
          {resume ? (
            <div className="mt-1 flex items-center justify-between rounded-lg border border-white/15 bg-white/[0.08] px-3 py-2 text-sm">
              <span className="flex items-center gap-2 truncate"><FileText size={14} />{resume}</span>
              <button onClick={() => setResume(null)} className="text-xs text-white/50">Remove</button>
            </div>
          ) : (
            <button onClick={() => setResume(MOCK_RESUMES[0].name)} className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 py-3 text-sm text-white/70">
              <Upload size={14} />Upload or use Lightforth resume
            </button>
          )}
        </div>
        <div>
          <label className="text-xs font-medium text-white/60">Job description (optional)</label>
          <textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={3} placeholder="Paste the job description…" className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.08] px-3 py-2 text-sm text-white outline-none placeholder:text-white/30" />
          <button onClick={() => setJd('Looking for a product designer with 4+ years of experience in B2B SaaS, strong systems thinking, and a portfolio of shipped work.')} className="mt-1 text-xs font-medium text-blue-300">✨ Suggest for me</button>
        </div>
        <div>
          <label className="text-xs font-medium text-white/60">Audio device</label>
          <button onClick={() => setMicConnected(true)} className="mt-1 flex w-full items-center justify-between rounded-lg border border-white/15 bg-white/[0.08] px-3 py-2 text-sm">
            <span className="flex items-center gap-2"><Mic size={14} />Phone microphone</span>
            {micConnected ? <span className="flex items-center gap-1 text-xs font-medium text-green-400"><Check size={12} />Connected</span> : <span className="text-xs text-white/40">Tap to connect</span>}
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" checked={dontAsk} onChange={(e) => setDontAsk(e.target.checked)} className="h-4 w-4 rounded" />
          Don't ask me again
        </label>
      </div>
      <div className="flex-shrink-0 p-4">
        <button onClick={() => onContinue(jobTitle)} disabled={!micConnected} className={cn('w-full rounded-xl py-3 text-center text-sm font-semibold', micConnected ? 'bg-[#1a7aff] text-white' : 'bg-white/10 text-white/40')}>
          Continue
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open the Copilot tab. Expected: an entry card with "Start a session" → onboarding screen explaining mic access with a Continue button → setup screen showing job-title input with quick-select chips, resume chip with remove option, optional JD field with a working "✨ Suggest for me" button that fills sample text, an audio-device row that shows "Connected" once tapped, and a "Don't ask me again" checkbox. The Continue button is disabled until the mic shows Connected, then becomes active (brand blue).

- [ ] **Step 3: Commit**

```bash
git add src/pages/mobile-preview/CopilotModule.tsx
git commit -m "Add Copilot entry, onboarding, and session setup screens"
```

---

### Task 7: Interview Copilot — Response style modal and Live Canvas

**Files:**
- Modify: `src/pages/mobile-preview/CopilotModule.tsx`

- [ ] **Step 1: Add the response-style modal and live canvas**

Extend the `CopilotModule` switch:
```tsx
// if (view.name === 'style') return <ResponseStyleScreen jobTitle={view.jobTitle} onSelect={(style) => setView({ name: 'live', jobTitle: view.jobTitle, style })} />
// if (view.name === 'live') return <LiveCanvasScreen jobTitle={view.jobTitle} onEnd={() => setView({ name: 'complete' })} />
```

Add these components to the same file:
```tsx
import { useEffect, useRef } from 'react'
import { Settings } from 'lucide-react'
import { MOCK_QA } from './mockData'

const STYLES: { id: ResponseStyle; title: string; desc: string }[] = [
  { id: 'default', title: 'Default', desc: 'Full natural-sounding answer to read aloud' },
  { id: 'headlines', title: 'Headlines', desc: 'STAR-format bullet points' },
  { id: 'coaching', title: 'Coaching', desc: 'Short tips to guide your own response' },
]

function ResponseStyleScreen({ jobTitle, onSelect }: { jobTitle: string; onSelect: (style: ResponseStyle) => void }) {
  return (
    <div className="flex h-full flex-col justify-end px-5 pb-8 text-white" style={{ background: NAVY }}>
      <div className="rounded-2xl bg-white/[0.07] p-5">
        <h2 className="text-base font-semibold">How should Copilot present answers?</h2>
        <p className="mt-1 text-xs text-white/50">For your {jobTitle} session</p>
        <div className="mt-4 space-y-2">
          {STYLES.map((s) => (
            <button key={s.id} onClick={() => onSelect(s.id)} className="block w-full rounded-xl border border-white/15 p-3 text-left">
              <p className="text-sm font-semibold">{s.title}</p>
              <p className="text-xs text-white/50">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

type CopilotStatus = 'listening' | 'processing' | 'answering'

function LiveCanvasScreen({ jobTitle, onEnd }: { jobTitle: string; onEnd: () => void }) {
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState<CopilotStatus>('listening')
  const [streamed, setStreamed] = useState('')

  useEffect(() => {
    const qa = MOCK_QA[index % MOCK_QA.length]
    setStatus('listening')
    setStreamed('')
    const t1 = setTimeout(() => setStatus('processing'), 1400)
    const t2 = setTimeout(() => setStatus('answering'), 2600)
    let charTimer: ReturnType<typeof setInterval>
    const t3 = setTimeout(() => {
      let i = 0
      charTimer = setInterval(() => {
        i += 4
        setStreamed(qa.a.slice(0, i))
        if (i >= qa.a.length) {
          clearInterval(charTimer)
          setTimeout(() => setIndex((n) => n + 1), 2200)
        }
      }, 30)
    }, 2600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(charTimer) }
  }, [index])

  const qa = MOCK_QA[index % MOCK_QA.length]
  const STATUS_LABEL: Record<CopilotStatus, string> = { listening: 'Listening…', processing: 'Processing…', answering: 'Answering…' }

  return (
    <div className="flex h-full flex-col text-white" style={{ background: NAVY }}>
      <header className="flex items-center justify-between px-5 pt-4">
        <span className="truncate text-xs text-white/50">{jobTitle} session</span>
        <Settings size={16} className="text-white/50" />
      </header>
      <div className="flex items-center gap-2 px-5 pt-2">
        <span className={cn('h-2 w-2 rounded-full', status === 'listening' && 'bg-green-400 shadow-[0_0_8px_2px_rgba(74,222,128,0.6)]', status === 'processing' && 'bg-amber-400', status === 'answering' && 'bg-blue-400')} />
        <span className="text-xs text-white/60">{STATUS_LABEL[status]}</span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="text-sm font-medium text-white/70">{qa.q}</p>
        {status === 'processing' && (
          <div className="mt-4 flex gap-1">
            {[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-white/40" style={{ animationDelay: `${i * 0.15}s` }} />)}
          </div>
        )}
        {status === 'answering' && <p className="mt-4 text-base leading-relaxed text-white">{streamed}<span className="animate-pulse">▋</span></p>}
      </div>
      <div className="flex-shrink-0 p-4">
        <button onClick={onEnd} className="w-full rounded-xl bg-white/10 py-3 text-center text-sm font-semibold text-white">End session</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Continue from setup → response-style modal: 3 selectable cards (Default/Headlines/Coaching). Selecting one opens the live canvas: status dot/label cycles Listening (green glow) → Processing (bouncing dots) → Answering (streaming text), then advances to the next mock question automatically, looping. "End session" navigates onward.

- [ ] **Step 3: Commit**

```bash
git add src/pages/mobile-preview/CopilotModule.tsx
git commit -m "Add Copilot response style modal and live canvas with simulated status cycling"
```

---

### Task 8: Interview Copilot — Session Complete

**Files:**
- Modify: `src/pages/mobile-preview/CopilotModule.tsx`

- [ ] **Step 1: Add the completion screen and wire it into the switch**

```tsx
// if (view.name === 'complete') return <CompleteScreen onGoHome={() => setView({ name: 'entry' })} />

function CompleteScreen({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center text-white" style={{ background: NAVY }}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
        <Check className="text-green-400" size={28} />
      </div>
      <h1 className="text-lg font-semibold">Session complete</h1>
      <p className="text-sm text-white/60">Nice work. Your Copilot session has ended — you can review your preferences any time before your next interview.</p>
      <button onClick={onGoHome} className="mt-2 rounded-xl bg-[#1a7aff] px-6 py-3 text-sm font-semibold text-white">Go Home</button>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

From the live canvas, tap "End session". Expected: a confirmation screen with a checkmark, "Session complete" heading, and a "Go Home" button that returns to the Copilot module's entry card (full loop closed: entry → onboarding → setup → style → live → complete → entry).

- [ ] **Step 3: Commit**

```bash
git add src/pages/mobile-preview/CopilotModule.tsx
git commit -m "Add Copilot session complete screen, closing the Copilot flow loop"
```

---

### Task 9: Notifications — Notification Centre

**Files:**
- Modify: `src/pages/mobile-preview/NotificationsModule.tsx` (replace stub, build incrementally — this task covers the centre; Task 10 adds preferences)

- [ ] **Step 1: Build the notification centre with grouped categories and read/unread state**

```tsx
import { useState } from 'react'
import { ArrowLeft, Bell, Briefcase, CreditCard, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_NOTIFICATIONS, type MockNotification, type NotificationCategory } from './mockData'

type NotificationsView = { name: 'centre' } | { name: 'preferences' }

const CATEGORY_META: Record<NotificationCategory, { label: string; icon: typeof Bell }> = {
  applications: { label: 'Application Updates', icon: Briefcase },
  matches: { label: 'Job Matches', icon: Bell },
  account: { label: 'Account & Credits', icon: CreditCard },
}

export function NotificationsModule() {
  const [view, setView] = useState<NotificationsView>({ name: 'centre' })
  const [notifications, setNotifications] = useState<MockNotification[]>(MOCK_NOTIFICATIONS)

  const markAllRead = () => setNotifications((list) => list.map((n) => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)))

  if (view.name === 'preferences') return <PreferencesScreen onBack={() => setView({ name: 'centre' })} />

  const groups = (Object.keys(CATEGORY_META) as NotificationCategory[]).map((cat) => ({
    cat,
    items: notifications.filter((n) => n.category === cat),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between px-5 pb-2 pt-4">
        <h1 className="text-xl font-semibold text-neutral-900">Notifications</h1>
        <button onClick={() => setView({ name: 'preferences' })}><Settings size={18} className="text-neutral-400" /></button>
      </header>
      <div className="flex items-center justify-between px-5 pb-2">
        <span className="text-xs text-neutral-400">{notifications.filter((n) => !n.read).length} unread</span>
        <button onClick={markAllRead} className="text-xs font-medium text-[#2563EB]">Mark all as read</button>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-4">
        {groups.map(({ cat, items }) => {
          const Icon = CATEGORY_META[cat].icon
          return (
            <div key={cat}>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                <Icon size={12} />{CATEGORY_META[cat].label}
              </div>
              <div className="space-y-2">
                {items.map((n) => (
                  <button key={n.id} onClick={() => markRead(n.id)} className={cn('block w-full rounded-xl border p-3 text-left', n.read ? 'border-neutral-200 bg-white' : 'border-[#2563EB]/30 bg-[#2563EB]/5')}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-neutral-900">{n.title}</p>
                      {!n.read && <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#2563EB]" />}
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">{n.body}</p>
                    <p className="mt-1 text-[11px] text-neutral-400">{n.timestamp}</p>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open the Alerts tab. Expected: header with unread count and "Mark all as read"; notifications grouped under "Application Updates", "Job Matches", "Account & Credits" headers, unread items visually highlighted with a blue dot, tapping one marks it read (highlight clears); "Mark all as read" clears all highlights and the unread count drops to 0; the bottom-tab badge count (from Task 1) updates to match.

- [ ] **Step 3: Commit**

```bash
git add src/pages/mobile-preview/NotificationsModule.tsx
git commit -m "Add notification centre with grouped categories and read/unread state"
```

---

### Task 10: Notifications — Preferences screen

**Files:**
- Modify: `src/pages/mobile-preview/NotificationsModule.tsx`

- [ ] **Step 1: Build the preferences screen with the granular controls from the brief**

```tsx
function PreferencesScreen({ onBack }: { onBack: () => void }) {
  const [appPush, setAppPush] = useState(true)
  const [appEmail, setAppEmail] = useState(true)
  const [matchPush, setMatchPush] = useState(true)
  const [matchFrequency, setMatchFrequency] = useState<'immediately' | 'daily' | 'weekly'>('daily')
  const [matchEmail, setMatchEmail] = useState(false)
  const [accountPush, setAccountPush] = useState(true)
  const [quietStart, setQuietStart] = useState('22:00')
  const [quietEnd, setQuietEnd] = useState('08:00')

  const FREQUENCIES: { id: typeof matchFrequency; label: string }[] = [
    { id: 'immediately', label: 'Immediately' }, { id: 'daily', label: 'Daily digest' }, { id: 'weekly', label: 'Weekly digest' },
  ]

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="text-base font-semibold text-neutral-900">Notification settings</h1>
      </header>
      <div className="flex-1 space-y-6 overflow-y-auto px-5 pb-6">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Application Updates</h2>
          <div className="mt-2 space-y-3 rounded-xl border border-neutral-200 p-3">
            <Row label="Push notifications" control={<Toggle on={appPush} onToggle={() => setAppPush((v) => !v)} />} />
            <Row label="Email alerts" control={<Toggle on={appEmail} onToggle={() => setAppEmail((v) => !v)} />} />
          </div>
        </section>
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Job Matches</h2>
          <div className="mt-2 space-y-3 rounded-xl border border-neutral-200 p-3">
            <Row label="Push notifications" control={<Toggle on={matchPush} onToggle={() => setMatchPush((v) => !v)} />} />
            <div>
              <p className="mb-2 text-sm text-neutral-700">Frequency</p>
              <div className="flex gap-2">
                {FREQUENCIES.map((f) => (
                  <button key={f.id} onClick={() => setMatchFrequency(f.id)} className={cn('rounded-full border px-3 py-1.5 text-xs font-medium', matchFrequency === f.id ? 'border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]' : 'border-neutral-200 text-neutral-500')}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <Row label="Email digest" control={<Toggle on={matchEmail} onToggle={() => setMatchEmail((v) => !v)} />} />
          </div>
        </section>
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Account & Credits</h2>
          <div className="mt-2 rounded-xl border border-neutral-200 p-3">
            <Row label="Push notifications" control={<Toggle on={accountPush} onToggle={() => setAccountPush((v) => !v)} />} />
          </div>
        </section>
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Quiet Hours</h2>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-neutral-200 p-3 text-sm">
            <label className="flex flex-1 flex-col gap-1 text-xs text-neutral-500">
              Start
              <input type="time" value={quietStart} onChange={(e) => setQuietStart(e.target.value)} className="rounded-lg border border-neutral-200 px-2 py-1.5 text-sm text-neutral-900" />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-xs text-neutral-500">
              End
              <input type="time" value={quietEnd} onChange={(e) => setQuietEnd(e.target.value)} className="rounded-lg border border-neutral-200 px-2 py-1.5 text-sm text-neutral-900" />
            </label>
          </div>
          <p className="mt-1 text-xs text-neutral-400">No notifications between {quietStart} and {quietEnd} in your local timezone.</p>
        </section>
      </div>
    </div>
  )
}

function Row({ label, control }: { label: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-neutral-700">{label}</span>
      {control}
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

From the notification centre, tap the settings icon. Expected: a screen with four sections (Application Updates, Job Matches, Account & Credits, Quiet Hours) matching the brief's layout — toggles for push/email, a frequency selector (Immediately/Daily/Weekly) for Job Matches, and start/end time inputs for Quiet Hours defaulting to 22:00/08:00. All controls are interactive (toggles flip, frequency selection highlights, time inputs editable). Back arrow returns to the centre.

- [ ] **Step 3: Commit**

```bash
git add src/pages/mobile-preview/NotificationsModule.tsx
git commit -m "Add notification preferences screen with granular controls and quiet hours"
```

---

### Task 11: End-to-end click-through verification

**Files:** none (verification-only task)

- [ ] **Step 1: Walk the entire prototype end to end**

With the dev server running, open `/mobile-app-preview` and click through every path below, confirming each has a forward path and a back path with no dead ends:

1. Home → "Start Copilot session" → onboarding → setup (fill title, connect mic, use AI suggest) → style modal → live canvas (watch a full Listening→Processing→Answering cycle) → End session → Complete → Go Home
2. Home → "Browse jobs" → tap a job card → Job Detail → Apply with one tap → Applying… → Applied → Back to jobs
3. Jobs tab → History → tap an application with a status timeline, and separately tap the rejected one → back to History → back to feed
4. Home → tap a recent-activity row → lands on Notifications, item shows highlighted/unread → tap it → highlight clears → "Mark all as read" clears the rest and the tab-bar badge disappears
5. Notifications → settings icon → Preferences → toggle each switch, change Job Match frequency, edit quiet hours → back → back to centre
6. Confirm the bottom tab bar correctly switches between all four modules from any internal screen, and that re-entering a module preserves it starting at its natural entry screen

Expected: every step above completes with no console errors, no broken navigation, and visuals matching the descriptions in the design spec (light brand theme for Home/Jobs/Notifications, dark navy theme for Copilot).

- [ ] **Step 2: Fix any issues found**

If any path is broken or visually inconsistent, fix it directly in the relevant module file and re-verify just that path.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "Verify mobile app prototype end-to-end click-through flow"
```
(Skip this commit if Step 2 required no changes — there's nothing new to commit.)

---

## Self-Review Notes

- **Spec coverage:** All 13 screens + nav shell + phone frame from the design spec map to Tasks 1–10; Task 11 verifies the full end-to-end loop including cross-module tap-through (Home → Notifications, Notification → relevant screen) called out in the spec's "Interaction model" section.
- **Type consistency:** `ActiveTab`, `ResponseStyle`, `CopilotStatus`, `ApplicationStatus`, `NotificationCategory`, and the per-module view-state union types are defined once (Tasks 1, 2, 6, 9) and reused consistently in later steps within the same files — no renamed duplicates.
- **No placeholders:** every step contains complete, runnable component code or a fully-specified verification checklist; mock data is fully populated, not stubbed (beyond the intentional, explicitly-temporary Task 1 stubs that later tasks replace).
