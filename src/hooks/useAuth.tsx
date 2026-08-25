// src/hooks/useAuth.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import api, { TOKEN_KEY } from '../lib/api'
import { getAccount } from '@/pages/desktopCopilot/mockAccounts'

export const DEMO_EMAIL = 'demo@lightforth.ai'

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
  /** Updates the signed-in demo user's plan in place — used right after checkout completes, so the app reflects the plan just purchased without a reload. */
  setPlan: (plan: User['plan']) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** The whole app is a single mocked demo identity — resolve its plan from whatever checkout last recorded for it, falling back to 'pro' for a fresh session. */
function resolveDemoPlan(): User['plan'] {
  return getAccount(DEMO_EMAIL)?.planId ?? 'pro'
}

function demoUser(): User {
  return {
    id: 'demo',
    name: 'Darnell Smith',
    email: DEMO_EMAIL,
    plan: resolveDemoPlan(),
    credits: 0,
    creditsUsed: 30,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // DEV bypass — skip login gate during testing
    setUser(demoUser())
    setIsLoading(false)
  }, [])

  const login = async (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
    try {
      const res = await api.get<User>('/me')
      setUser(res.data)
    } catch {
      // Demo fallback — no backend available yet
      setUser(demoUser())
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  const setPlan = (plan: User['plan']) => {
    setUser(u => (u ? { ...u, plan } : u))
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setPlan }}>
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
    return <Navigate to="/v3/auth/sign-in" state={{ from: location }} replace />
  }

  return <>{children}</>
}
