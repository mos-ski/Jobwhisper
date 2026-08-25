# Lightforth Frontend — Phase 1: Scaffold + Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the complete Lightforth React frontend and implement the Dashboard page with all three states (empty, dropdown open, resume uploaded with action cards).

**Architecture:** Vite + React 18 + TypeScript SPA. React Router v6 handles routing; all protected routes render inside `AppLayout` (Sidebar + TopNav). Auth state lives in a context that calls `GET /api/me` on mount. React Query handles server state. Dashboard manages its own local state for which of the three states to display.

**Tech Stack:** Vite 5, React 18, TypeScript, Tailwind CSS v3, shadcn/ui, React Router v6, TanStack React Query v5, Axios, Framer Motion, Lucide React, Instrument Sans, Vitest + React Testing Library, Sonner (toasts).

---

## File Map

| File | Responsibility |
|------|---------------|
| `vite.config.ts` | Vite + path alias `@/` + Vitest config |
| `tailwind.config.ts` | Design tokens, custom colors, Instrument Sans |
| `src/index.css` | CSS variables (HSL), font import, base styles |
| `src/main.tsx` | React root mount |
| `src/App.tsx` | QueryClient, AuthProvider, BrowserRouter, all routes |
| `src/lib/api.ts` | Axios instance — base URL, auth + 401 interceptors |
| `src/lib/utils.ts` | shadcn `cn()` helper |
| `src/hooks/useAuth.tsx` | AuthContext, AuthProvider, useAuth hook, ProtectedRoute |
| `src/components/layout/AppLayout.tsx` | Sidebar + TopNav wrapper |
| `src/components/layout/Sidebar.tsx` | Left nav: logo, links, UpgradeCard |
| `src/components/layout/TopNav.tsx` | Top bar: notifications, help, avatar |
| `src/components/shared/UpgradeCard.tsx` | Dark navy gradient sidebar CTA |
| `src/components/shared/CreditBanner.tsx` | Dismissible "0 credits" warning bar |
| `src/components/shared/ResumeUploadDropdown.tsx` | Upload CTA + dropdown (Upload / Use Lightforth Resume) |
| `src/components/shared/ActionCard.tsx` | Post-upload next-step card |
| `src/pages/Auth.tsx` | Login placeholder (full auth comes later) |
| `src/pages/Dashboard.tsx` | Dashboard — all 3 states |
| `src/pages/Placeholder.tsx` | Empty stub for not-yet-built routes |
| `src/test/setup.ts` | Vitest + jest-dom setup |
| `src/lib/api.test.ts` | API token key contract test |
| `src/hooks/useAuth.test.tsx` | Auth context behaviour tests |

---

## Task 1: Project Scaffold + Dependencies

**Files:** `package.json`, `tsconfig.json`, `.env.example`

- [ ] **Step 1: Create the Vite project**

Run inside `/Users/theoneglobal/Documents/Projects/NEW Lightforth (2)`:

```bash
npm create vite@latest . -- --template react-ts
```

When prompted "Current directory is not empty. Please choose how to proceed" → select **Ignore files and continue**.

- [ ] **Step 2: Install core runtime dependencies**

```bash
npm install react-router-dom @tanstack/react-query axios framer-motion lucide-react sonner date-fns
```

- [ ] **Step 3: Install Tailwind CSS v3 + tooling**

```bash
npm install -D tailwindcss@3 postcss autoprefixer tailwindcss-animate
npx tailwindcss init -p
```

- [ ] **Step 4: Install Vitest + React Testing Library**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 5: Create `.env.example`**

```bash
# .env.example
VITE_API_BASE_URL=https://api.lightforth.ai
```

Also create `.env.local`:
```bash
# .env.local
VITE_API_BASE_URL=https://api.lightforth.ai
```

- [ ] **Step 6: Verify install**

```bash
npm run dev
```

Expected: Vite dev server starts on `http://localhost:5173`, browser shows default Vite + React page.

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold vite react-ts project with dependencies"
```

---

## Task 2: Tailwind Config + Design Tokens + Instrument Sans

**Files:** `tailwind.config.ts`, `src/index.css`

- [ ] **Step 1: Replace `tailwind.config.ts`**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: '#16A34A',
          foreground: '#FFFFFF',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

- [ ] **Step 2: Replace `src/index.css`**

```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 210 40% 98%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 221 83% 53%;
    --primary-foreground: 0 0% 100%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 221 83% 53%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
}
```

- [ ] **Step 3: Verify font loads**

```bash
npm run dev
```

Open browser → DevTools → Elements → `body` → computed font-family should include "Instrument Sans".

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts src/index.css
git commit -m "feat: add tailwind design tokens and Instrument Sans font"
```

---

## Task 3: shadcn/ui Setup + Components

**Files:** `components.json`, `src/lib/utils.ts`, `src/components/ui/*`

- [ ] **Step 1: Init shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted, answer:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**
- Where is your global CSS file?: `src/index.css`
- Where is your tailwind.config?: `tailwind.config.ts`
- Configure aliases?: **Yes** — `@/components`, `@/lib`, `@/hooks`
- React Server Components: **No**

- [ ] **Step 2: Add required components**

```bash
npx shadcn@latest add button card dropdown-menu separator badge progress tooltip
```

- [ ] **Step 3: Verify `src/lib/utils.ts` exists with content**

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

If shadcn did not generate it, create it manually and run:
```bash
npm install clsx tailwind-merge
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add shadcn/ui with button, card, dropdown, badge, progress components"
```

---

## Task 4: Vite Config + Vitest Setup

**Files:** `vite.config.ts`, `src/test/setup.ts`

- [ ] **Step 1: Replace `vite.config.ts`**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

- [ ] **Step 2: Create `src/test/setup.ts`**

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 3: Add test script to `package.json`**

Open `package.json` and add to the `"scripts"` block:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 4: Run tests to confirm setup**

```bash
npm run test:run
```

Expected: `No test files found` or `0 tests passed` — no failures, setup works.

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts src/test/setup.ts package.json
git commit -m "feat: configure vitest with jsdom and jest-dom"
```

---

## Task 5: API Layer

**Files:** `src/lib/api.ts`, `src/lib/api.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/api.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { TOKEN_KEY } from './api'

describe('TOKEN_KEY', () => {
  it('is the string lf_token', () => {
    expect(TOKEN_KEY).toBe('lf_token')
  })
})

describe('localStorage integration', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('stores and retrieves a token under TOKEN_KEY', () => {
    localStorage.setItem(TOKEN_KEY, 'abc123')
    expect(localStorage.getItem(TOKEN_KEY)).toBe('abc123')
  })

  it('returns null when no token is stored', () => {
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module './api'`

- [ ] **Step 3: Create `src/lib/api.ts`**

```typescript
// src/lib/api.ts
import axios from 'axios'

export const TOKEN_KEY = 'lf_token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://api.lightforth.ai',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  },
)

export default api
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm run test:run
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/api.ts src/lib/api.test.ts
git commit -m "feat: add axios api layer with auth interceptors"
```

---

## Task 6: Auth Context + ProtectedRoute

**Files:** `src/hooks/useAuth.tsx`, `src/hooks/useAuth.test.tsx`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/hooks/useAuth.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './useAuth'

vi.mock('../lib/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        plan: 'non_subscriber' as const,
        credits: 3,
        creditsUsed: 0,
      },
    }),
  },
  TOKEN_KEY: 'lf_token',
}))

function TestConsumer() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div>Loading...</div>
  return <div>{user ? `Hello ${user.name}` : 'No user'}</div>
}

function Wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('useAuth', () => {
  beforeEach(() => localStorage.clear())

  it('shows loading on initial render', () => {
    render(<TestConsumer />, { wrapper: Wrapper })
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows No user when no token in localStorage', async () => {
    render(<TestConsumer />, { wrapper: Wrapper })
    await waitFor(() => expect(screen.getByText('No user')).toBeInTheDocument())
  })

  it('fetches and shows user when token exists', async () => {
    localStorage.setItem('lf_token', 'valid-token')
    render(<TestConsumer />, { wrapper: Wrapper })
    await waitFor(() => expect(screen.getByText('Hello Test User')).toBeInTheDocument())
  })
})
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npm run test:run
```

Expected: FAIL — `Cannot find module './useAuth'`

- [ ] **Step 3: Create `src/hooks/useAuth.tsx`**

```typescript
// src/hooks/useAuth.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import api, { TOKEN_KEY } from '../lib/api'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  plan: 'non_subscriber' | 'starter' | 'pro' | 'premium'
  credits: number
  creditsUsed: number
}

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setIsLoading(false)
      return
    }
    api
      .get<User>('/me')
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
    const res = await api.get<User>('/me')
    setUser(res.data)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return <>{children}</>
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npm run test:run
```

Expected: 6 tests pass (3 from api.test.ts + 3 from useAuth.test.tsx).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useAuth.tsx src/hooks/useAuth.test.tsx
git commit -m "feat: add auth context, useAuth hook, and ProtectedRoute"
```

---

## Task 7: App Router + Entry Point

**Files:** `src/App.tsx`, `src/main.tsx`, `src/pages/Placeholder.tsx`, `src/pages/Auth.tsx`

- [ ] **Step 1: Create `src/pages/Placeholder.tsx`**

```typescript
// src/pages/Placeholder.tsx
interface Props {
  title: string
}

export default function Placeholder({ title }: Props) {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">{title} — coming soon</p>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/pages/Auth.tsx`**

```typescript
// src/pages/Auth.tsx
import { useNavigate, useLocation } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Auth() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'

  const handleDemoLogin = async () => {
    await login('demo-token')
    navigate(from, { replace: true })
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm rounded-xl border border-border bg-white p-8">
        <div className="mb-6 flex items-center gap-2">
          <Zap className="h-6 w-6 fill-primary text-primary" />
          <span className="text-lg font-bold text-primary">Lightforth</span>
        </div>
        <h1 className="mb-1 text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="mb-6 text-sm text-muted-foreground">Sign in to your account to continue</p>
        <button
          onClick={handleDemoLogin}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          Sign In (Demo)
        </button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Full auth UI coming in Sign Up flow
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `src/App.tsx`**

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider, ProtectedRoute } from '@/hooks/useAuth'
import AppLayout from '@/components/layout/AppLayout'
import Auth from '@/pages/Auth'
import Dashboard from '@/pages/Dashboard'
import Placeholder from '@/pages/Placeholder'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function AppRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<AppRoute><Dashboard /></AppRoute>} />
            <Route path="/documents" element={<AppRoute><Placeholder title="My Documents" /></AppRoute>} />
            <Route path="/resume-builder" element={<AppRoute><Placeholder title="Resume Builder" /></AppRoute>} />
            <Route path="/auto-apply" element={<AppRoute><Placeholder title="Auto-Apply" /></AppRoute>} />
            <Route path="/interview-prep" element={<AppRoute><Placeholder title="Interview Prep" /></AppRoute>} />
            <Route path="/interview-copilot" element={<AppRoute><Placeholder title="Interview Copilot" /></AppRoute>} />
            <Route path="/billing" element={<AppRoute><Placeholder title="Billing" /></AppRoute>} />
            <Route path="/settings" element={<AppRoute><Placeholder title="Settings" /></AppRoute>} />
            <Route path="/job-profile" element={<AppRoute><Placeholder title="Job Profile" /></AppRoute>} />
            <Route path="/explore" element={<AppRoute><Placeholder title="Explore" /></AppRoute>} />
            <Route path="/downloads" element={<AppRoute><Placeholder title="Download Apps" /></AppRoute>} />
          </Routes>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
```

- [ ] **Step 4: Replace `src/main.tsx`**

```typescript
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 5: Delete unused Vite default files**

```bash
rm -rf src/assets src/App.css
```

- [ ] **Step 6: Create stubs so the app compiles**

```typescript
// src/components/layout/AppLayout.tsx
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen">{children}</div>
}
```

```typescript
// src/pages/Dashboard.tsx  (stub — replaced fully in Task 12)
export default function Dashboard() {
  return <div className="p-6 text-muted-foreground">Dashboard — coming soon</div>
}
```

- [ ] **Step 7: Run dev server and verify routing**

```bash
npm run dev
```

Navigate to `http://localhost:5173` — should redirect to `/auth`. Click "Sign In (Demo)" — should reach `/` which renders `AppLayout` stub with nothing inside yet.

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx src/main.tsx src/pages/ src/components/layout/AppLayout.tsx
git commit -m "feat: add react router, auth page placeholder, and route structure"
```

---

## Task 8: UpgradeCard + CreditBanner

**Files:** `src/components/shared/UpgradeCard.tsx`, `src/components/shared/CreditBanner.tsx`

- [ ] **Step 1: Create `src/components/shared/UpgradeCard.tsx`**

```typescript
// src/components/shared/UpgradeCard.tsx
import { Sparkles, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function UpgradeCard() {
  const navigate = useNavigate()

  return (
    <div className="rounded-xl bg-gradient-to-b from-[#1E3A5F] to-[#1D4ED8] p-4 text-white">
      <div className="mb-2 flex items-center gap-1">
        <Sparkles className="h-4 w-4" />
        <span className="text-sm">✦</span>
      </div>
      <p className="mb-1 text-sm font-semibold">Upgrade to Premium!</p>
      <p className="mb-3 text-xs leading-relaxed text-blue-200">
        You're currently on a starter credit. Upgrade to Premium to unlock more credits and get the
        most out of Lightforth's tools.
      </p>
      <button
        onClick={() => navigate('/billing')}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-primary hover:bg-blue-50 transition-colors"
      >
        <User className="h-3.5 w-3.5" />
        Upgrade Now
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/shared/CreditBanner.tsx`**

```typescript
// src/components/shared/CreditBanner.tsx
import { useState } from 'react'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

export default function CreditBanner({ className }: Props) {
  const [dismissed, setDismissed] = useState(false)
  const navigate = useNavigate()

  if (dismissed) return null

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg bg-muted px-4 py-2.5 text-sm',
        className,
      )}
    >
      <span className="text-muted-foreground">0 credits remaining today</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/billing')}
          className="font-medium text-foreground hover:underline"
        >
          Upgrade
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/
git commit -m "feat: add UpgradeCard and CreditBanner shared components"
```

---

## Task 9: Sidebar

**Files:** `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Create `src/components/layout/Sidebar.tsx`**

```typescript
// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Target,
  Headphones,
  User,
  Compass,
  Download,
  CreditCard,
  Settings,
  ChevronDown,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import UpgradeCard from '@/components/shared/UpgradeCard'

const PRIMARY_NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/documents', icon: FileText, label: 'My Documents', chevron: true },
  { to: '/auto-apply', icon: Briefcase, label: 'Auto-Apply' },
  { to: '/interview-prep', icon: Target, label: 'Interview Prep' },
  { to: '/interview-copilot', icon: Headphones, label: 'Interview Co-Pilot' },
]

const SECONDARY_NAV = [
  { to: '/job-profile', icon: User, label: 'Job Profile' },
  { to: '/explore', icon: Compass, label: 'Explore', redDot: true },
  { to: '/downloads', icon: Download, label: 'Download Apps' },
  { to: '/billing', icon: CreditCard, label: 'Billing & subscription' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

function NavItem({
  to,
  icon: Icon,
  label,
  end,
  chevron,
  redDot,
}: {
  to: string
  icon: React.ElementType
  label: string
  end?: boolean
  chevron?: boolean
  redDot?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary/5 text-primary'
            : 'text-foreground hover:bg-muted',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-4 w-4 flex-shrink-0',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )}
          />
          <span className="flex-1 truncate">{label}</span>
          {redDot && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />}
          {chevron && (
            <ChevronDown className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
          )}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-56 flex-shrink-0 flex-col border-r border-border bg-white">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-4">
        <Zap className="h-6 w-6 fill-primary text-primary" />
        <span className="text-base font-bold text-primary">Lightforth</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2">
        {PRIMARY_NAV.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <div className="my-2 border-t border-border" />

        {SECONDARY_NAV.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <div className="my-2 border-t border-border" />

        {/* How to use — YouTube-style */}
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <span className="flex h-5 w-7 flex-shrink-0 items-center justify-center rounded bg-red-600">
            <span className="border-y-[5px] border-l-[8px] border-y-transparent border-l-white" />
          </span>
          How to use
        </a>
      </nav>

      {/* Upgrade card */}
      <div className="p-3">
        <UpgradeCard />
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Sidebar.tsx
git commit -m "feat: add sidebar with nav links, active states, and upgrade card"
```

---

## Task 10: TopNav + AppLayout

**Files:** `src/components/layout/TopNav.tsx`, `src/components/layout/AppLayout.tsx`

- [ ] **Step 1: Create `src/components/layout/TopNav.tsx`**

```typescript
// src/components/layout/TopNav.tsx
import { Bell, HelpCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function TopNav() {
  const { user } = useAuth()

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-end gap-2 border-b border-border bg-white px-6">
      {/* Notification bell */}
      <button className="relative rounded-full p-2 hover:bg-muted transition-colors">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          20
        </span>
      </button>

      {/* Help */}
      <button className="rounded-full p-2 hover:bg-muted transition-colors">
        <HelpCircle className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* Avatar */}
      <button className="h-8 w-8 overflow-hidden rounded-full bg-muted flex-shrink-0">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </span>
        )}
      </button>
    </header>
  )
}
```

- [ ] **Step 2: Replace `src/components/layout/AppLayout.tsx`**

```typescript
// src/components/layout/AppLayout.tsx
import Sidebar from './Sidebar'
import TopNav from './TopNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Sign in → should see full layout: sidebar on left (logo, nav items, upgrade card), top nav on right (bell, help, avatar), and main area with "coming soon" text.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/TopNav.tsx src/components/layout/AppLayout.tsx
git commit -m "feat: add TopNav and complete AppLayout with sidebar + topnav"
```

---

## Task 11: ResumeUploadDropdown + ActionCard

**Files:** `src/components/shared/ResumeUploadDropdown.tsx`, `src/components/shared/ActionCard.tsx`

- [ ] **Step 1: Create `src/components/shared/ResumeUploadDropdown.tsx`**

```typescript
// src/components/shared/ResumeUploadDropdown.tsx
import { useRef, useState } from 'react'
import { Upload, Zap } from 'lucide-react'

export interface UploadedResume {
  name: string
  size: string
}

interface Props {
  onUpload: (resume: UploadedResume) => void
}

export default function ResumeUploadDropdown({ onUpload }: Props) {
  const [open, setOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
    onUpload({ name: file.name, size: `${sizeMB}MB` })
    setOpen(false)
    // reset so the same file can be re-selected
    e.target.value = ''
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-foreground hover:bg-blue-100 transition-colors"
      >
        <span className="flex items-center gap-2 text-muted-foreground">
          <span className="text-lg font-light">+</span>
          <span className="font-medium text-foreground">Upload a Resume</span>
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            fileRef.current?.click()
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:bg-muted transition-colors"
        >
          <Upload className="h-4 w-4 text-muted-foreground" />
        </button>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-lg border border-border bg-white shadow-lg">
            <button
              onClick={() => {
                setOpen(false)
                fileRef.current?.click()
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Upload className="h-4 w-4 text-muted-foreground" />
              Upload a Resume
            </button>
            <button
              onClick={() => {
                onUpload({ name: 'Lightforth_Resume.pdf', size: '1.2MB' })
                setOpen(false)
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Zap className="h-4 w-4 fill-primary text-primary" />
              Use Lightforth Resume
            </button>
          </div>
        </>
      )}

      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/shared/ActionCard.tsx`**

```typescript
// src/components/shared/ActionCard.tsx
import { Link } from 'react-router-dom'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  Icon: LucideIcon
  title: string
  description: string
  to: string
  active?: boolean
}

export default function ActionCard({ Icon, title, description, to, active }: Props) {
  return (
    <Link
      to={to}
      className={cn(
        'flex flex-col rounded-xl border p-4 transition-all hover:shadow-sm',
        active
          ? 'border-primary/40 bg-primary/5'
          : 'border-border bg-white hover:border-primary/20 hover:bg-primary/5',
      )}
    >
      <Icon
        className={cn('mb-3 h-5 w-5', active ? 'text-primary' : 'text-muted-foreground')}
      />
      <p
        className={cn(
          'mb-1.5 flex items-center gap-1 text-sm font-medium',
          active ? 'text-primary' : 'text-foreground',
        )}
      >
        {title}
        <ArrowRight className="h-3.5 w-3.5" />
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
    </Link>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/ResumeUploadDropdown.tsx src/components/shared/ActionCard.tsx
git commit -m "feat: add ResumeUploadDropdown and ActionCard components"
```

---

## Task 12: Dashboard Page — All 3 States

**Files:** `src/pages/Dashboard.tsx` (replace the stub from Task 7)

- [ ] **Step 1: Replace `src/pages/Dashboard.tsx` with full implementation**

```typescript
// src/pages/Dashboard.tsx
import { useState } from 'react'
import { format } from 'date-fns'
import { ChevronDown, FileText, Monitor, Briefcase, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import ResumeUploadDropdown, { type UploadedResume } from '@/components/shared/ResumeUploadDropdown'
import ActionCard from '@/components/shared/ActionCard'
import CreditBanner from '@/components/shared/CreditBanner'

export default function Dashboard() {
  const { user } = useAuth()
  const [resume, setResume] = useState<UploadedResume | null>(null)
  const [howItWorksOpen, setHowItWorksOpen] = useState(false)

  const hasNoCredits = (user?.credits ?? 1) === 0
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="mx-auto max-w-3xl">
      {/* Main card */}
      <div className="mb-4 rounded-xl border border-border bg-white p-6">
        {/* Date + greeting */}
        <p className="mb-1 text-sm text-muted-foreground">
          {format(new Date(), 'EEEE, MMMM do')}
        </p>
        <h1 className="mb-6 text-2xl font-bold text-foreground">
          Welcome {firstName}, let's get you hired.
        </h1>

        {resume ? (
          /* State 3: Resume uploaded */
          <div>
            {/* File chip */}
            <div className="mb-2 flex items-center gap-3 rounded-lg bg-[#1E3A5F] px-4 py-3">
              <span className="text-2xl">📄</span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white">{resume.name}</p>
                <p className="text-xs text-blue-300">{resume.size}</p>
              </div>
              <button
                onClick={() => setResume(null)}
                className="flex-shrink-0 rounded-full p-1 text-white/60 hover:text-white transition-colors"
                aria-label="Remove resume"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">Now, select an action</p>
          </div>
        ) : (
          /* State 1 & 2: Empty + dropdown */
          <div>
            <ResumeUploadDropdown onUpload={setResume} />
            <p className="mt-2 text-sm text-muted-foreground">
              We'll analyze your resume and tailor it to your next job application.
            </p>
          </div>
        )}
      </div>

      {/* Credits banner — shown after upload when credits = 0 */}
      {resume && hasNoCredits && <CreditBanner className="mb-4" />}

      {resume ? (
        /* Action cards */
        <div>
          <p className="mb-3 text-sm font-medium text-foreground">
            Resume uploaded. What do you want to do next?
          </p>
          <div className="grid grid-cols-3 gap-4">
            <ActionCard
              Icon={FileText}
              title="Tailor my Resume"
              description="Let Lightforth craft your perfect resume tailored to every role and optimized for results."
              to="/resume-builder"
              active
            />
            <ActionCard
              Icon={Monitor}
              title="Practice For Interview"
              description="Practice with AI interviewers, get actionable feedback, and walk into interviews more confident than ever."
              to="/interview-prep"
            />
            <ActionCard
              Icon={Briefcase}
              title="Start Interview Copilot"
              description="From resume reviews to job matches and strategy tips, Copilot gives you smart insights at every step."
              to="/interview-copilot"
            />
          </div>
        </div>
      ) : (
        /* How it works — shown when no resume */
        <div className="rounded-xl border border-border bg-white p-6">
          <button
            className="flex w-full items-center justify-between text-sm font-medium text-foreground"
            onClick={() => setHowItWorksOpen((o) => !o)}
          >
            <span>How it works</span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                howItWorksOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {howItWorksOpen && (
            <div className="mt-4 space-y-2 border-t border-border pt-4">
              <a
                href="https://help.lightforth.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-medium text-primary hover:underline"
              >
                Visit Help Desk{' '}
                <span className="font-normal text-muted-foreground">(help.lightforth.ai)</span>
              </a>
              <a
                href="#"
                className="block text-sm font-medium text-primary hover:underline"
              >
                Watch Quick Tutorial
              </a>
              <a
                href="mailto:support@lightforth.org"
                className="block text-sm font-medium text-primary hover:underline"
              >
                Contact us for support{' '}
                <span className="font-normal text-muted-foreground">(support@lightforth.org)</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Run dev server and test all 3 states**

```bash
npm run dev
```

1. Sign in → see Dashboard empty state (upload CTA + How it works collapsed).
2. Click "How it works" → expands with links.
3. Click "Upload a Resume" button → dropdown appears with two options.
4. Select a PDF file → file chip appears, "Now, select an action" text shows, 3 action cards appear.
5. Click ✕ on file chip → returns to empty state.
6. Click "Use Lightforth Resume" → sets mock resume, same uploaded state appears.
7. Verify sidebar active state shows "Dashboard" highlighted in blue.
8. Click nav links → verify routing to placeholder pages.

- [ ] **Step 3: Run all tests**

```bash
npm run test:run
```

Expected: 6 tests pass, 0 failures.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Dashboard.tsx
git commit -m "feat: implement Dashboard with all 3 states (empty, dropdown, uploaded)"
```

---

## Task 13: Save memory + final verification

- [ ] **Step 1: Final test run**

```bash
npm run test:run
```

Expected output:
```
 ✓ src/lib/api.test.ts (3)
 ✓ src/hooks/useAuth.test.tsx (3)

 Test Files  2 passed (2)
      Tests  6 passed (6)
```

- [ ] **Step 2: Final build check**

```bash
npm run build
```

Expected: Build completes with no TypeScript errors. Output in `dist/`.

- [ ] **Step 3: Final commit**

```bash
git add .
git commit -m "feat: phase 1 complete — scaffold + dashboard with all 3 states"
```

---

## Done

Phase 1 delivers:
- Full project scaffold (Vite + React + TS + Tailwind + shadcn + React Query)
- Instrument Sans font + design tokens matching the Figma
- Axios API layer with auth interceptors
- Auth context + ProtectedRoute
- Complete routing structure (all pages as placeholders)
- Sidebar, TopNav, AppLayout
- Dashboard: empty state → dropdown → uploaded state with action cards
- 6 passing tests covering API layer and auth context

**Next:** Send the Resume Builder screenshots to implement Phase 2.
