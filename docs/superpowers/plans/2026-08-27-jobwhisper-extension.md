# Jobwhisper Browser Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real, loadable Manifest V3 browser extension popup for Jobwhisper (sign-in → Run/Jobs/Applications tabs), reusing the existing web app's design system and Auto-Apply mock data, per [docs/superpowers/specs/2026-08-27-jobwhisper-extension-design.md](../specs/2026-08-27-jobwhisper-extension-design.md).

**Architecture:** A new `src/apps/extension/` app-wiring target (mirroring the existing `src/apps/web/`) consumes shared `src/features/extension/*` view components and `src/ui/*` primitives. A separate `vite.extension.config.ts` builds it to `dist-extension/`, loadable via Chrome's "Load unpacked."

**Tech Stack:** React 18, TypeScript, Vite, Tailwind (existing config, no changes needed — content glob already covers `src/**/*.{ts,tsx}`), Vitest + Testing Library (existing setup), `sharp` (new devDependency, for icon rasterization only).

## Global Constraints

- No real job-board automation, no real auth, no real background service worker — every interaction is mocked local state (per spec Non-goals).
- Reuse `autoApplyJobs` from `src/mocks/auto-apply.ts` for Jobs/Applications — do not create a parallel jobs dataset (per spec Data section).
- Use the real `JobwhisperMark` / `JobwhisperIcon` components from `@/ui` for all branding — never recreate the old placeholder mark.
- Popup forces dark theme unconditionally (no light/system toggle) — matches the reference screenshots and keeps the popup visually consistent regardless of host page theme.

---

## File Structure

```
scripts/generate-extension-icons.mjs        # rasterizes favicon.svg → 3 PNG sizes
public/extension/manifest.json              # MV3 manifest
public/extension/icons/                     # generated PNGs (git-ignored, build output)
vite.extension.config.ts                    # separate Vite build for the popup
src/contracts/extension.draft.ts            # ExtensionJobBoard, ExtensionBoardState
src/mocks/extension.ts                      # extensionJobBoards mock data
src/lib/extension-applications.ts           # getAppliedJobs(jobs) filter
src/features/extension/sign-in-view.tsx     # ExtensionSignInView
src/features/extension/run-tab-view.tsx     # ExtensionRunTabView
src/features/extension/jobs-tab-view.tsx    # ExtensionJobsTabView
src/features/extension/applications-tab-view.tsx  # ExtensionApplicationsTabView
src/features/extension/extension-popup-view.tsx   # ExtensionPopupView (shell: header/tabs/footer)
src/apps/extension/App.tsx                  # signed-in/out state wiring
src/apps/extension/main.tsx                 # React root mount
src/apps/extension/popup.html               # HTML entry
package.json                                # + sharp devDependency, + 2 scripts
```

---

### Task 1: Extension contracts & mock job-board data

**Files:**
- Create: `src/contracts/extension.draft.ts`
- Create: `src/mocks/extension.ts`
- Test: `src/mocks/extension.test.ts`

**Interfaces:**
- Produces: `ExtensionBoardState = 'start' | 'connect' | 'in-progress'`, `ExtensionJobBoard = { id: string; name: string; state: ExtensionBoardState }`, `extensionJobBoards: readonly ExtensionJobBoard[]`

- [ ] **Step 1: Write the contract types**

```ts
// src/contracts/extension.draft.ts
export type ExtensionBoardState = 'start' | 'connect' | 'in-progress'

export type ExtensionJobBoard = {
  readonly id: string
  readonly name: string
  readonly state: ExtensionBoardState
}
```

- [ ] **Step 2: Write the mock data**

```ts
// src/mocks/extension.ts
import type { ExtensionJobBoard } from '@/contracts/extension.draft'

export const extensionJobBoards: readonly ExtensionJobBoard[] = [
  { id: 'indeed', name: 'Indeed', state: 'start' },
  { id: 'glassdoor', name: 'Glassdoor', state: 'start' },
  { id: 'workable', name: 'Workable', state: 'connect' },
  { id: 'linkedin', name: 'LinkedIn', state: 'in-progress' },
]
```

- [ ] **Step 3: Write the failing test**

```ts
// src/mocks/extension.test.ts
import { describe, it, expect } from 'vitest'
import { extensionJobBoards } from './extension'

describe('extensionJobBoards', () => {
  it('includes all three connection states', () => {
    const states = extensionJobBoards.map((board) => board.state)
    expect(states).toContain('start')
    expect(states).toContain('connect')
    expect(states).toContain('in-progress')
  })

  it('has unique board ids', () => {
    const ids = extensionJobBoards.map((board) => board.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
```

- [ ] **Step 4: Run the test**

Run: `npm run test:run -- src/mocks/extension.test.ts`
Expected: PASS (types + data were written together with the test since there's no meaningful "fails first" step for a static data file — confirm the assertions actually hold)

- [ ] **Step 5: Commit**

```bash
git add src/contracts/extension.draft.ts src/mocks/extension.ts src/mocks/extension.test.ts
git commit -m "feat(extension): add job-board contract and mock data"
```

---

### Task 2: Applied-jobs filter utility

**Files:**
- Create: `src/lib/extension-applications.ts`
- Test: `src/lib/extension-applications.test.ts`

**Interfaces:**
- Consumes: `AutoApplyJob` from `src/contracts/auto-apply.draft.ts` (existing — has `status: 'applied' | 'new'`)
- Produces: `getAppliedJobs(jobs: readonly AutoApplyJob[]): readonly AutoApplyJob[]`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/extension-applications.test.ts
import { describe, it, expect } from 'vitest'
import { getAppliedJobs } from './extension-applications'
import type { AutoApplyJob } from '@/contracts/auto-apply.draft'

function makeJob(overrides: Partial<AutoApplyJob>): AutoApplyJob {
  return {
    id: 'job-1',
    title: 'Product Manager',
    company: 'Acme',
    location: 'Remote',
    type: 'Full-Time',
    matchPercent: 90,
    source: 'LinkedIn',
    dateLabel: 'Aug 1',
    status: 'new',
    listingUrl: 'https://example.com',
    resumeFileName: 'resume.pdf',
    description: 'Great role',
    tags: [],
    creditsRemaining: 10,
    creditsTotal: 10,
    ...overrides,
  }
}

describe('getAppliedJobs', () => {
  it('returns only jobs with status "applied"', () => {
    const jobs = [makeJob({ id: '1', status: 'applied' }), makeJob({ id: '2', status: 'new' }), makeJob({ id: '3', status: 'applied' })]
    expect(getAppliedJobs(jobs).map((job) => job.id)).toEqual(['1', '3'])
  })

  it('returns an empty array when no jobs are applied', () => {
    expect(getAppliedJobs([makeJob({ id: '1', status: 'new' })])).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/lib/extension-applications.test.ts`
Expected: FAIL with "Failed to resolve import ./extension-applications" (module doesn't exist yet)

- [ ] **Step 3: Write the implementation**

```ts
// src/lib/extension-applications.ts
import type { AutoApplyJob } from '@/contracts/auto-apply.draft'

export function getAppliedJobs(jobs: readonly AutoApplyJob[]): readonly AutoApplyJob[] {
  return jobs.filter((job) => job.status === 'applied')
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/lib/extension-applications.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/extension-applications.ts src/lib/extension-applications.test.ts
git commit -m "feat(extension): add getAppliedJobs filter utility"
```

---

### Task 3: Extension toolbar icons & manifest

**Files:**
- Create: `scripts/generate-extension-icons.mjs`
- Create: `public/extension/manifest.json`
- Test: `scripts/generate-extension-icons.test.mjs`
- Modify: `package.json` (add `sharp` devDependency + `icons:extension` script)

**Interfaces:**
- Consumes: `public/favicon.svg` (existing — blue square + white icon, the correct "app icon" format)
- Produces: `generateIcons(): Promise<string>` (returns the output directory), `ICON_SIZES: readonly number[]`, PNG files at `public/extension/icons/icon-{16,48,128}.png`

- [ ] **Step 1: Install sharp**

```bash
npm install -D sharp
```

- [ ] **Step 2: Write the failing test**

```js
// scripts/generate-extension-icons.test.mjs
import { describe, it, expect } from 'vitest'
import sharp from 'sharp'
import path from 'node:path'
import { generateIcons, ICON_SIZES } from './generate-extension-icons.mjs'

describe('generateIcons', () => {
  it('writes a correctly sized PNG for each icon size', async () => {
    const outputDir = await generateIcons()
    for (const size of ICON_SIZES) {
      const metadata = await sharp(path.join(outputDir, `icon-${size}.png`)).metadata()
      expect(metadata.width).toBe(size)
      expect(metadata.height).toBe(size)
      expect(metadata.format).toBe('png')
    }
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test:run -- scripts/generate-extension-icons.test.mjs`
Expected: FAIL with "Failed to resolve import ./generate-extension-icons.mjs"

- [ ] **Step 4: Write the icon-generation script**

```js
// scripts/generate-extension-icons.mjs
import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir } from 'node:fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SOURCE_SVG = path.resolve(__dirname, '../public/favicon.svg')
const OUTPUT_DIR = path.resolve(__dirname, '../public/extension/icons')

export const ICON_SIZES = [16, 48, 128]

export async function generateIcons() {
  await mkdir(OUTPUT_DIR, { recursive: true })
  await Promise.all(
    ICON_SIZES.map((size) =>
      sharp(SOURCE_SVG, { density: 384 })
        .resize(size, size)
        .png()
        .toFile(path.join(OUTPUT_DIR, `icon-${size}.png`)),
    ),
  )
  return OUTPUT_DIR
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await generateIcons()
  console.log('Generated extension icons at', OUTPUT_DIR)
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:run -- scripts/generate-extension-icons.test.mjs`
Expected: PASS

- [ ] **Step 6: Write the manifest**

```json
// public/extension/manifest.json
{
  "manifest_version": 3,
  "name": "Jobwhisper",
  "version": "1.0.0",
  "description": "Jobwhisper AI job-search copilot — auto-apply, jobs, and applications at a glance.",
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon-16.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  },
  "icons": {
    "16": "icons/icon-16.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  }
}
```

- [ ] **Step 7: Add the `icons:extension` script to package.json**

In the `"scripts"` block of `package.json`, add:

```json
"icons:extension": "node scripts/generate-extension-icons.mjs"
```

- [ ] **Step 8: Run the script once to generate real icon files**

```bash
npm run icons:extension
```

Expected: `public/extension/icons/icon-16.png`, `icon-48.png`, `icon-128.png` now exist on disk.

- [ ] **Step 9: Commit**

```bash
git add scripts/generate-extension-icons.mjs scripts/generate-extension-icons.test.mjs public/extension/manifest.json package.json package-lock.json
git commit -m "feat(extension): add manifest and icon generation script"
```

---

### Task 4: Extension Vite build config & HTML/JS entry

**Files:**
- Create: `vite.extension.config.ts`
- Create: `src/apps/extension/popup.html`
- Create: `src/apps/extension/main.tsx`
- Modify: `package.json` (add `build:extension` script)

**Interfaces:**
- Consumes: `src/apps/extension/App.tsx` (built in Task 8 — `main.tsx` imports it, so this task's build will fail to compile until Task 8 lands; that's expected and noted in Step 3 below)

- [ ] **Step 1: Write the Vite config**

```ts
// vite.extension.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'src/apps/extension'),
  publicDir: path.resolve(__dirname, 'public/extension'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist-extension'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/apps/extension/popup.html'),
    },
  },
})
```

- [ ] **Step 2: Write the popup HTML entry**

```html
<!-- src/apps/extension/popup.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <script>
      document.documentElement.dataset.theme = 'dark'
    </script>
    <title>Jobwhisper</title>
    <style>
      html, body { margin: 0; width: 375px; }
      #root { min-height: 480px; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Write the React entry point**

```tsx
// src/apps/extension/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '../../index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Note: `./App` does not exist until Task 8 — this is expected. This task only establishes the build plumbing; the build itself is verified in Task 8's Step 9.

- [ ] **Step 4: Add the `build:extension` script to package.json**

In the `"scripts"` block of `package.json`, add:

```json
"build:extension": "npm run icons:extension && vite build --config vite.extension.config.ts"
```

- [ ] **Step 5: Commit**

```bash
git add vite.extension.config.ts src/apps/extension/popup.html src/apps/extension/main.tsx package.json
git commit -m "feat(extension): add Vite build config and HTML/JS entry"
```

---

### Task 5: Sign-in screen

**Files:**
- Create: `src/features/extension/sign-in-view.tsx`
- Test: `src/features/extension/sign-in-view.test.tsx`

**Interfaces:**
- Consumes: `Button`, `TextField`, `JobwhisperIcon` from `@/ui` (all existing)
- Produces: `ExtensionSignInView({ onSignIn: () => void })`

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/extension/sign-in-view.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ExtensionSignInView } from './sign-in-view'

describe('ExtensionSignInView', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the heading and device-scope helper text', () => {
    render(<ExtensionSignInView onSignIn={() => {}} />)
    expect(screen.getByText('Sign in to Jobwhisper')).toBeInTheDocument()
    expect(screen.getByText('This signs in the extension only. Your other devices stay as they are.')).toBeInTheDocument()
  })

  it('disables Sign In until both fields have a value', async () => {
    const user = userEvent.setup({ delay: null })
    render(<ExtensionSignInView onSignIn={() => {}} />)
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeDisabled()
    await user.type(screen.getByLabelText('Email'), 'demo@jobwhisper.ai')
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeDisabled()
    await user.type(screen.getByLabelText('Password'), 'password123')
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeEnabled()
  })

  it('calls onSignIn after submitting', async () => {
    const onSignIn = vi.fn()
    const user = userEvent.setup({ delay: null })
    render(<ExtensionSignInView onSignIn={onSignIn} />)
    await user.type(screen.getByLabelText('Email'), 'demo@jobwhisper.ai')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))
    await vi.advanceTimersByTimeAsync(600)
    expect(onSignIn).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/features/extension/sign-in-view.test.tsx`
Expected: FAIL with "Failed to resolve import ./sign-in-view"

- [ ] **Step 3: Write the implementation**

```tsx
// src/features/extension/sign-in-view.tsx
import { useState, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Button, JobwhisperIcon, TextField } from '@/ui'

export type ExtensionSignInViewProps = {
  readonly onSignIn: () => void
}

export function ExtensionSignInView({ onSignIn }: ExtensionSignInViewProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<'idle' | 'signing-in'>('idle')

  const canSubmit = email.trim().length > 0 && password.length > 0 && status === 'idle'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return
    setStatus('signing-in')
    window.setTimeout(() => {
      onSignIn()
    }, 600)
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-canvas px-6 py-10 text-center">
      <JobwhisperIcon className="size-10 text-brand-mark" />
      <div>
        <h1 className="text-lg font-semibold text-ink">Sign in to Jobwhisper</h1>
        <p className="mt-1 text-sm text-ink-muted">This signs in the extension only. Your other devices stay as they are.</p>
      </div>
      <form onSubmit={handleSubmit} className="grid w-full gap-3 text-left">
        <TextField
          id="extension-email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
        />
        <div className="relative">
          <TextField
            id="extension-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-9 text-ink-muted hover:text-ink"
          >
            {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
          </button>
        </div>
        <Button type="submit" disabled={!canSubmit} loading={status === 'signing-in'}>
          Sign In
        </Button>
      </form>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/features/extension/sign-in-view.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/extension/sign-in-view.tsx src/features/extension/sign-in-view.test.tsx
git commit -m "feat(extension): add sign-in screen"
```

---

### Task 6: Run tab

**Files:**
- Create: `src/features/extension/run-tab-view.tsx`
- Test: `src/features/extension/run-tab-view.test.tsx`

**Interfaces:**
- Consumes: `ExtensionJobBoard` from `src/contracts/extension.draft.ts` (Task 1), `Badge`, `Button` from `@/ui`
- Produces: `ExtensionRunTabView({ boards: readonly ExtensionJobBoard[]; onBoardAction: (boardId: string) => void })`

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/extension/run-tab-view.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ExtensionRunTabView } from './run-tab-view'
import type { ExtensionJobBoard } from '@/contracts/extension.draft'

const boards: readonly ExtensionJobBoard[] = [
  { id: 'indeed', name: 'Indeed', state: 'start' },
  { id: 'workable', name: 'Workable', state: 'connect' },
  { id: 'linkedin', name: 'LinkedIn', state: 'in-progress' },
]

describe('ExtensionRunTabView', () => {
  it('renders the correct control for each board state', () => {
    render(<ExtensionRunTabView boards={boards} onBoardAction={() => {}} />)
    expect(screen.getByRole('button', { name: 'Start AutoApply' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Connect to Jobwhisper' })).toBeInTheDocument()
    expect(screen.getByText('Application in progress')).toBeInTheDocument()
  })

  it('calls onBoardAction with the board id when Start AutoApply is clicked', async () => {
    const onBoardAction = vi.fn()
    render(<ExtensionRunTabView boards={boards} onBoardAction={onBoardAction} />)
    await userEvent.click(screen.getByRole('button', { name: 'Start AutoApply' }))
    expect(onBoardAction).toHaveBeenCalledWith('indeed')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/features/extension/run-tab-view.test.tsx`
Expected: FAIL with "Failed to resolve import ./run-tab-view"

- [ ] **Step 3: Write the implementation**

```tsx
// src/features/extension/run-tab-view.tsx
import type { ComponentType } from 'react'
import { Loader2 } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import { SiGlassdoor, SiIndeed } from 'react-icons/si'

import { Badge, Button } from '@/ui'
import type { ExtensionJobBoard } from '@/contracts/extension.draft'

const BOARD_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  indeed: SiIndeed,
  glassdoor: SiGlassdoor,
  linkedin: FaLinkedin,
}

export type ExtensionRunTabViewProps = {
  readonly boards: readonly ExtensionJobBoard[]
  readonly onBoardAction: (boardId: string) => void
}

export function ExtensionRunTabView({ boards, onBoardAction }: ExtensionRunTabViewProps) {
  return (
    <ul className="grid gap-2">
      {boards.map((board) => {
        const Icon = BOARD_ICONS[board.id]
        return (
          <li key={board.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-md bg-surface-subtle text-ink">
                {Icon ? <Icon className="size-4" /> : <span className="text-xs font-semibold">{board.name.charAt(0)}</span>}
              </span>
              <span className="text-sm font-medium text-ink">{board.name}</span>
            </div>
            {board.state === 'in-progress' ? (
              <Badge variant="neutral" className="inline-flex items-center gap-1.5">
                <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
                Application in progress
              </Badge>
            ) : (
              <Button type="button" size="sm" variant={board.state === 'connect' ? 'secondary' : 'primary'} onClick={() => onBoardAction(board.id)}>
                {board.state === 'connect' ? 'Connect to Jobwhisper' : 'Start AutoApply'}
              </Button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/features/extension/run-tab-view.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/extension/run-tab-view.tsx src/features/extension/run-tab-view.test.tsx
git commit -m "feat(extension): add Run tab"
```

---

### Task 7: Jobs & Applications tabs

**Files:**
- Create: `src/features/extension/jobs-tab-view.tsx`
- Create: `src/features/extension/applications-tab-view.tsx`
- Test: `src/features/extension/jobs-tab-view.test.tsx`
- Test: `src/features/extension/applications-tab-view.test.tsx`

**Interfaces:**
- Consumes: `AutoApplyJob` from `src/contracts/auto-apply.draft.ts` (existing), `Badge`, `EmptyState` from `@/ui`
- Produces: `ExtensionJobsTabView({ jobs: readonly AutoApplyJob[] })`, `ExtensionApplicationsTabView({ applications: readonly AutoApplyJob[] })`

- [ ] **Step 1: Write the failing tests**

```tsx
// src/features/extension/jobs-tab-view.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { ExtensionJobsTabView } from './jobs-tab-view'
import type { AutoApplyJob } from '@/contracts/auto-apply.draft'

function makeJob(overrides: Partial<AutoApplyJob>): AutoApplyJob {
  return {
    id: 'job-1',
    title: 'Product Manager',
    company: 'Acme',
    location: 'Remote',
    type: 'Full-Time',
    matchPercent: 90,
    source: 'LinkedIn',
    dateLabel: 'Aug 1',
    status: 'new',
    listingUrl: 'https://example.com',
    resumeFileName: 'resume.pdf',
    description: 'Great role',
    tags: [],
    creditsRemaining: 10,
    creditsTotal: 10,
    ...overrides,
  }
}

describe('ExtensionJobsTabView', () => {
  it('shows the empty state when there are no jobs', () => {
    render(<ExtensionJobsTabView jobs={[]} />)
    expect(screen.getByText('No matched jobs yet')).toBeInTheDocument()
    expect(screen.getByText('Start a run and the scout will fill this in.')).toBeInTheDocument()
  })

  it('lists each job with its match percentage when jobs are present', () => {
    render(<ExtensionJobsTabView jobs={[makeJob({ id: '1', title: 'Senior PM', matchPercent: 87 })]} />)
    expect(screen.getByText('Senior PM')).toBeInTheDocument()
    expect(screen.getByText('87% match')).toBeInTheDocument()
  })
})
```

```tsx
// src/features/extension/applications-tab-view.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { ExtensionApplicationsTabView } from './applications-tab-view'
import type { AutoApplyJob } from '@/contracts/auto-apply.draft'

function makeJob(overrides: Partial<AutoApplyJob>): AutoApplyJob {
  return {
    id: 'job-1',
    title: 'Product Manager',
    company: 'Acme',
    location: 'Remote',
    type: 'Full-Time',
    matchPercent: 90,
    source: 'LinkedIn',
    dateLabel: 'Aug 1',
    status: 'applied',
    listingUrl: 'https://example.com',
    resumeFileName: 'resume.pdf',
    description: 'Great role',
    tags: [],
    creditsRemaining: 10,
    creditsTotal: 10,
    ...overrides,
  }
}

describe('ExtensionApplicationsTabView', () => {
  it('shows the empty state when there are no applications', () => {
    render(<ExtensionApplicationsTabView applications={[]} />)
    expect(screen.getByText('Nothing applied for yet')).toBeInTheDocument()
    expect(screen.getByText('Every attempt shows up here, including the ones that did not work.')).toBeInTheDocument()
  })

  it('lists each application with its outcome', () => {
    render(<ExtensionApplicationsTabView applications={[makeJob({ id: '1', title: 'Backend Engineer', outcome: 'failed' })]} />)
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument()
    expect(screen.getByText('Did not work')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- src/features/extension/jobs-tab-view.test.tsx src/features/extension/applications-tab-view.test.tsx`
Expected: FAIL with "Failed to resolve import" for both

- [ ] **Step 3: Write the Jobs tab implementation**

```tsx
// src/features/extension/jobs-tab-view.tsx
import { Briefcase } from 'lucide-react'

import { Badge, EmptyState } from '@/ui'
import type { AutoApplyJob } from '@/contracts/auto-apply.draft'

export type ExtensionJobsTabViewProps = {
  readonly jobs: readonly AutoApplyJob[]
}

export function ExtensionJobsTabView({ jobs }: ExtensionJobsTabViewProps) {
  if (jobs.length === 0) {
    return <EmptyState icon={<Briefcase aria-hidden="true" />} title="No matched jobs yet" description="Start a run and the scout will fill this in." />
  }

  return (
    <ul className="grid gap-2">
      {jobs.map((job) => (
        <li key={job.id} className="rounded-lg border border-border bg-surface px-3 py-2.5">
          <p className="text-sm font-medium text-ink">{job.title}</p>
          <p className="text-xs text-ink-muted">
            {job.company} &middot; {job.location}
          </p>
          <Badge variant="accent" size="sm" className="mt-1.5">
            {job.matchPercent}% match
          </Badge>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 4: Write the Applications tab implementation**

```tsx
// src/features/extension/applications-tab-view.tsx
import { Inbox } from 'lucide-react'

import { Badge, EmptyState } from '@/ui'
import type { AutoApplyJob } from '@/contracts/auto-apply.draft'

export type ExtensionApplicationsTabViewProps = {
  readonly applications: readonly AutoApplyJob[]
}

const OUTCOME_LABEL: Record<NonNullable<AutoApplyJob['outcome']>, string> = {
  success: 'Submitted',
  'needs-review': 'Needs review',
  failed: 'Did not work',
  closed: 'Closed',
}

export function ExtensionApplicationsTabView({ applications }: ExtensionApplicationsTabViewProps) {
  if (applications.length === 0) {
    return (
      <EmptyState
        icon={<Inbox aria-hidden="true" />}
        title="Nothing applied for yet"
        description="Every attempt shows up here, including the ones that did not work."
      />
    )
  }

  return (
    <ul className="grid gap-2">
      {applications.map((job) => (
        <li key={job.id} className="rounded-lg border border-border bg-surface px-3 py-2.5">
          <p className="text-sm font-medium text-ink">{job.title}</p>
          <p className="text-xs text-ink-muted">
            {job.company} &middot; {job.dateLabel}
          </p>
          <Badge variant={job.outcome === 'failed' ? 'danger' : 'neutral'} size="sm" className="mt-1.5">
            {job.outcome ? OUTCOME_LABEL[job.outcome] : 'Submitted'}
          </Badge>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test:run -- src/features/extension/jobs-tab-view.test.tsx src/features/extension/applications-tab-view.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/features/extension/jobs-tab-view.tsx src/features/extension/jobs-tab-view.test.tsx src/features/extension/applications-tab-view.tsx src/features/extension/applications-tab-view.test.tsx
git commit -m "feat(extension): add Jobs and Applications tabs"
```

---

### Task 8: Popup shell, App wiring, and final build verification

**Files:**
- Create: `src/features/extension/extension-popup-view.tsx`
- Create: `src/apps/extension/App.tsx`
- Test: `src/features/extension/extension-popup-view.test.tsx`
- Test: `src/apps/extension/App.test.tsx`

**Interfaces:**
- Consumes: `ExtensionRunTabView` (Task 6), `ExtensionJobsTabView`/`ExtensionApplicationsTabView` (Task 7), `getAppliedJobs` (Task 2), `extensionJobBoards` (Task 1), `autoApplyJobs` from `@/mocks/auto-apply` (existing), `JobwhisperMark`, `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent` from `@/ui`, `ExtensionSignInView` (Task 5)
- Produces: `ExtensionPopupView({ boards, jobs, creditBalance, onSignOut })`, default-exported `App` (the extension's root component, wired by `main.tsx` from Task 4)

- [ ] **Step 1: Write the failing popup shell test**

```tsx
// src/features/extension/extension-popup-view.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ExtensionPopupView } from './extension-popup-view'
import type { AutoApplyJob } from '@/contracts/auto-apply.draft'
import type { ExtensionJobBoard } from '@/contracts/extension.draft'

const boards: readonly ExtensionJobBoard[] = [{ id: 'indeed', name: 'Indeed', state: 'start' }]
const jobs: readonly AutoApplyJob[] = []

describe('ExtensionPopupView', () => {
  it('shows the Run tab by default with the credit balance', () => {
    render(<ExtensionPopupView boards={boards} jobs={jobs} creditBalance={10} onSignOut={() => {}} />)
    expect(screen.getByText('10 credits')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start AutoApply' })).toBeInTheDocument()
  })

  it('switches to the Jobs tab and shows its empty state', async () => {
    const user = userEvent.setup()
    render(<ExtensionPopupView boards={boards} jobs={jobs} creditBalance={10} onSignOut={() => {}} />)
    await user.click(screen.getByRole('tab', { name: 'Jobs' }))
    expect(screen.getByText('No matched jobs yet')).toBeInTheDocument()
  })

  it('calls onSignOut when Sign out is clicked', async () => {
    const onSignOut = vi.fn()
    const user = userEvent.setup()
    render(<ExtensionPopupView boards={boards} jobs={jobs} creditBalance={10} onSignOut={onSignOut} />)
    await user.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(onSignOut).toHaveBeenCalledTimes(1)
  })

  it('flips a board from start to in-progress when Start AutoApply is clicked', async () => {
    const user = userEvent.setup()
    render(<ExtensionPopupView boards={boards} jobs={jobs} creditBalance={10} onSignOut={() => {}} />)
    await user.click(screen.getByRole('button', { name: 'Start AutoApply' }))
    expect(screen.getByText('Application in progress')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/features/extension/extension-popup-view.test.tsx`
Expected: FAIL with "Failed to resolve import ./extension-popup-view"

- [ ] **Step 3: Write the popup shell implementation**

```tsx
// src/features/extension/extension-popup-view.tsx
import { useState } from 'react'
import { Maximize2 } from 'lucide-react'

import { JobwhisperMark, Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui'
import type { AutoApplyJob } from '@/contracts/auto-apply.draft'
import type { ExtensionJobBoard } from '@/contracts/extension.draft'
import { getAppliedJobs } from '@/lib/extension-applications'
import { ExtensionApplicationsTabView } from './applications-tab-view'
import { ExtensionJobsTabView } from './jobs-tab-view'
import { ExtensionRunTabView } from './run-tab-view'

export type ExtensionPopupViewProps = {
  readonly boards: readonly ExtensionJobBoard[]
  readonly jobs: readonly AutoApplyJob[]
  readonly creditBalance: number
  readonly onSignOut: () => void
}

export function ExtensionPopupView({ boards: initialBoards, jobs, creditBalance, onSignOut }: ExtensionPopupViewProps) {
  const [boards, setBoards] = useState(initialBoards)
  const applications = getAppliedJobs(jobs)

  function handleBoardAction(boardId: string) {
    setBoards((prev) =>
      prev.map((board) => (board.id === boardId ? { ...board, state: board.state === 'connect' ? 'start' : 'in-progress' } : board)),
    )
  }

  return (
    <div className="flex min-h-full flex-col bg-canvas text-ink">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <JobwhisperMark className="h-5 w-auto text-brand-mark" />
        <div className="flex items-center gap-2">
          <span className="rounded-pill border border-border px-2 py-0.5 text-xs font-semibold text-ink-muted">{creditBalance} credits</span>
          <button type="button" aria-label="Open in a full tab" className="text-ink-muted hover:text-ink">
            <Maximize2 aria-hidden="true" className="size-4" />
          </button>
        </div>
      </header>

      <Tabs defaultValue="run" className="flex flex-1 flex-col px-4 pt-3">
        <TabsList>
          <TabsTrigger value="run">Run</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="run" className="flex-1 pb-4">
          <ExtensionRunTabView boards={boards} onBoardAction={handleBoardAction} />
        </TabsContent>
        <TabsContent value="jobs" className="flex-1 pb-4">
          <ExtensionJobsTabView jobs={jobs} />
        </TabsContent>
        <TabsContent value="applications" className="flex-1 pb-4">
          <ExtensionApplicationsTabView applications={applications} />
        </TabsContent>
      </Tabs>

      <footer className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs">
        <span className="text-ink-muted">Extension</span>
        <button type="button" onClick={onSignOut} className="font-semibold text-accent-text hover:underline">
          Sign out
        </button>
      </footer>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/features/extension/extension-popup-view.test.tsx`
Expected: PASS

- [ ] **Step 5: Write the failing App test**

```tsx
// src/apps/extension/App.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

describe('extension App', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts on the sign-in screen and moves to the popup shell after signing in', async () => {
    const user = userEvent.setup({ delay: null })
    render(<App />)
    expect(screen.getByText('Sign in to Jobwhisper')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Email'), 'demo@jobwhisper.ai')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))
    await vi.advanceTimersByTimeAsync(600)

    expect(await screen.findByRole('tab', { name: 'Run' })).toBeInTheDocument()
  })

  it('returns to sign-in after signing out', async () => {
    const user = userEvent.setup({ delay: null })
    render(<App />)
    await user.type(screen.getByLabelText('Email'), 'demo@jobwhisper.ai')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))
    await vi.advanceTimersByTimeAsync(600)
    await screen.findByRole('tab', { name: 'Run' })

    await user.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(screen.getByText('Sign in to Jobwhisper')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm run test:run -- src/apps/extension/App.test.tsx`
Expected: FAIL with "Failed to resolve import ./App"

- [ ] **Step 7: Write the App implementation**

```tsx
// src/apps/extension/App.tsx
import { useState } from 'react'

import { autoApplyJobs } from '@/mocks/auto-apply'
import { extensionJobBoards } from '@/mocks/extension'
import { ExtensionPopupView } from '@/features/extension/extension-popup-view'
import { ExtensionSignInView } from '@/features/extension/sign-in-view'

export default function App() {
  const [signedIn, setSignedIn] = useState(false)

  if (!signedIn) {
    return <ExtensionSignInView onSignIn={() => setSignedIn(true)} />
  }

  return <ExtensionPopupView boards={extensionJobBoards} jobs={autoApplyJobs} creditBalance={10} onSignOut={() => setSignedIn(false)} />
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm run test:run -- src/apps/extension/App.test.tsx`
Expected: PASS

- [ ] **Step 9: Run the full extension build and confirm it produces a valid unpacked extension**

```bash
npm run build:extension
ls dist-extension dist-extension/icons
```

Expected: `dist-extension/manifest.json`, `dist-extension/popup.html`, a JS bundle, and `dist-extension/icons/icon-{16,48,128}.png` all exist.

- [ ] **Step 10: Manually verify in Chrome**

1. Open `chrome://extensions`, enable Developer mode, click "Load unpacked," select `dist-extension/`.
2. Confirm the Jobwhisper icon appears in the toolbar and clicking it opens the popup.
3. Click through: sign in → toggle a board on the Run tab → Jobs tab → Applications tab → Sign out. Confirm no dead ends and the real Jobwhisper mark renders (not the old placeholder).

- [ ] **Step 11: Run the full test suite**

Run: `npm run test:run`
Expected: PASS — every test in the repo, including all extension tests added in this plan

- [ ] **Step 12: Commit**

```bash
git add src/features/extension/extension-popup-view.tsx src/features/extension/extension-popup-view.test.tsx src/apps/extension/App.tsx src/apps/extension/App.test.tsx
git commit -m "feat(extension): add popup shell and App wiring"
```
