import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  USERS, TRANSACTIONS, TICKETS, ACTIVITY_LOGS, TEMPLATES, COUPONS, BROADCASTS,
  MONTHLY_DATA, FEATURE_USAGE, TOP_CITIES, OVERVIEW_STATS, SYSTEM_STATUS, ACTIVE_ALERTS,
  getRevenueStats, getUserStats,
  type AdminUser, type Transaction, type SupportTicket, type ActivityLog,
  type ResumeTemplate, type Coupon, type Broadcast,
} from '@/lib/adminMockData'

// ============================================================
// Simulated async delay
// ============================================================
function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ============================================================
// OVERVIEW
// ============================================================
export function useOverview() {
  return useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: async () => {
      await delay(200)
      return {
        stats: OVERVIEW_STATS,
        revenue: getRevenueStats(),
        users: getUserStats(),
        monthlyData: MONTHLY_DATA,
        featureUsage: FEATURE_USAGE,
      }
    },
  })
}

// ============================================================
// USERS
// ============================================================
export function useUsers(filters?: { search?: string; plan?: string; status?: string }) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: async () => {
      await delay(200)
      let result = [...USERS]
      if (filters?.search) {
        const q = filters.search.toLowerCase()
        result = result.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      }
      if (filters?.plan && filters.plan !== 'all') {
        result = result.filter(u => u.plan === filters.plan)
      }
      if (filters?.status && filters.status !== 'all') {
        result = result.filter(u => u.status === filters.status)
      }
      return { users: result, total: result.length, stats: getUserStats() }
    },
  })
}

export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: async () => {
      await delay(200)
      const user = USERS.find(u => u.id === userId)
      if (!user) throw new Error('User not found')
      return user
    },
    enabled: !!userId,
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AdminUser> }) => {
      await delay(400)
      const idx = USERS.findIndex(u => u.id === id)
      if (idx === -1) throw new Error('User not found')
      Object.assign(USERS[idx], updates)
      return USERS[idx]
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      qc.invalidateQueries({ queryKey: ['admin', 'user'] })
    },
  })
}

// ============================================================
// TRANSACTIONS / REVENUE
// ============================================================
export function useTransactions(filters?: { search?: string; type?: string; status?: string }) {
  return useQuery({
    queryKey: ['admin', 'transactions', filters],
    queryFn: async () => {
      await delay(200)
      let result = [...TRANSACTIONS]
      if (filters?.search) {
        const q = filters.search.toLowerCase()
        result = result.filter(t =>
          t.userName.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
        )
      }
      if (filters?.type && filters.type !== 'all') {
        result = result.filter(t => t.type === filters.type)
      }
      if (filters?.status && filters.status !== 'all') {
        result = result.filter(t => t.status === filters.status)
      }
      return { transactions: result, total: result.length, revenue: getRevenueStats() }
    },
  })
}

// ============================================================
// ANALYTICS
// ============================================================
export function useAnalytics() {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => {
      await delay(200)
      return {
        monthlyData: MONTHLY_DATA,
        featureUsage: FEATURE_USAGE,
        topCities: TOP_CITIES,
        sessionStats: {
          avgDuration: '8m 24s',
          bounceRate: '18.4%',
          pagesPerSession: 5.7,
          returnRate: 63,
        },
      }
    },
  })
}

// ============================================================
// SUPPORT TICKETS
// ============================================================
export function useTickets(filters?: { search?: string; status?: string; priority?: string }) {
  return useQuery({
    queryKey: ['admin', 'tickets', filters],
    queryFn: async () => {
      await delay(200)
      let result = [...TICKETS]
      if (filters?.search) {
        const q = filters.search.toLowerCase()
        result = result.filter(t =>
          t.subject.toLowerCase().includes(q) ||
          t.userName.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q)
        )
      }
      if (filters?.status && filters.status !== 'all') {
        result = result.filter(t => t.status === filters.status)
      }
      if (filters?.priority && filters.priority !== 'all') {
        result = result.filter(t => t.priority === filters.priority)
      }
      const stats = {
        open: result.filter(t => t.status === 'open' || t.status === 'in_progress').length,
        resolved: result.filter(t => t.status === 'resolved').length,
        closed: result.filter(t => t.status === 'closed').length,
      }
      return { tickets: result, total: result.length, stats }
    },
  })
}

export function useUpdateTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SupportTicket> }) => {
      await delay(300)
      const idx = TICKETS.findIndex(t => t.id === id)
      if (idx === -1) throw new Error('Ticket not found')
      Object.assign(TICKETS[idx], updates, { updatedAt: new Date().toISOString() })
      return TICKETS[idx]
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'tickets'] })
    },
  })
}

// ============================================================
// ACTIVITY LOGS
// ============================================================
export function useActivityLogs(filters?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'logs', filters],
    queryFn: async () => {
      await delay(200)
      let result = [...ACTIVITY_LOGS]
      if (filters?.category && filters.category !== 'all') {
        result = result.filter(l => l.category === filters.category)
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase()
        result = result.filter(l =>
          l.userName.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
        )
      }
      return { logs: result, total: result.length }
    },
  })
}

// ============================================================
// RESUME TEMPLATES
// ============================================================
export function useTemplates() {
  return useQuery({
    queryKey: ['admin', 'templates'],
    queryFn: async () => {
      await delay(200)
      const active = TEMPLATES.filter(t => t.active).length
      const usedThisMonth = TEMPLATES.filter(t => t.active).reduce((s, t) => s + Math.round(t.usageCount * 0.12), 0)
      const avgAts = Math.round(TEMPLATES.reduce((s, t) => s + t.atsScore, 0) / TEMPLATES.length)
      return { templates: TEMPLATES, total: TEMPLATES.length, active, usedThisMonth, avgAts }
    },
  })
}

export function useToggleTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200)
      const t = TEMPLATES.find(t => t.id === id)
      if (t) t.active = !t.active
      return t
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'templates'] })
    },
  })
}

// ============================================================
// COUPONS / PROMOTIONS
// ============================================================
export function useCoupons(filters?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: ['admin', 'coupons', filters],
    queryFn: async () => {
      await delay(200)
      let result = [...COUPONS]
      if (filters?.search) {
        const q = filters.search.toLowerCase()
        result = result.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
        )
      }
      if (filters?.status && filters.status !== 'all') {
        result = result.filter(c => c.status === filters.status)
      }
      return { coupons: result, total: result.length }
    },
  })
}

export function useCreateCoupon() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (coupon: Omit<Coupon, 'id' | 'createdAt' | 'usageCount'>) => {
      await delay(400)
      const newCoupon: Coupon = {
        ...coupon,
        id: String(COUPONS.length + 1),
        createdAt: new Date().toISOString(),
        usageCount: 0,
      }
      COUPONS.push(newCoupon)
      return newCoupon
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'coupons'] })
    },
  })
}

export function useUpdateCoupon() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Coupon> }) => {
      await delay(300)
      const idx = COUPONS.findIndex(c => c.id === id)
      if (idx === -1) throw new Error('Coupon not found')
      Object.assign(COUPONS[idx], updates)
      return COUPONS[idx]
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'coupons'] })
    },
  })
}

// ============================================================
// BROADCASTS
// ============================================================
export function useBroadcasts() {
  return useQuery({
    queryKey: ['admin', 'broadcasts'],
    queryFn: async () => {
      await delay(200)
      return { broadcasts: BROADCASTS, total: BROADCASTS.length }
    },
  })
}

export function useCreateBroadcast() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (broadcast: Omit<Broadcast, 'id' | 'sentAt'>) => {
      await delay(400)
      const newBroadcast: Broadcast = {
        ...broadcast,
        id: String(BROADCASTS.length + 1),
        sentAt: new Date().toISOString(),
      }
      BROADCASTS.unshift(newBroadcast)
      return newBroadcast
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'broadcasts'] })
    },
  })
}

// ============================================================
// SYSTEM STATUS / NOTIFICATIONS
// ============================================================
export function useSystemStatus() {
  return useQuery({
    queryKey: ['admin', 'system'],
    queryFn: async () => {
      await delay(200)
      return { services: SYSTEM_STATUS, alerts: ACTIVE_ALERTS }
    },
  })
}

// ============================================================
// SETTINGS
// ============================================================
export function useSettings() {
  const [flags, setFlags] = useState({
    autoApply: true,
    interviewCopilot: true,
    careerSpecialist: true,
    mobileApp: true,
    resumeAI: true,
    maintenance: false,
  })

  const toggleFlag = useCallback((key: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  return useMemo(() => ({ flags, toggleFlag }), [flags, toggleFlag])
}
