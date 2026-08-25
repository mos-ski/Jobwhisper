import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Download, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAdmin'
import { USERS, TRANSACTIONS, OVERVIEW_STATS, MONTHLY_DATA, FEATURE_USAGE, TOP_CITIES } from '@/lib/adminMockData'
import { useSort } from '@/hooks/useSort'
import { SortableHeader } from '@/components/shared/SortableHeader'
import type { TimePeriod } from '@/components/shared/TimelineFilter'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'
import { AdminDetailModal } from '@/components/shared/AdminDetailModal'

type Period = TimePeriod

// ============================================================
// Animated number hook
// ============================================================
function useAnimatedValue(target: number, duration = 600) {
  const [display, setDisplay] = useState(target)
  const frameRef = useRef(0)
  const startRef = useState({ val: target, time: 0 })[0]

  useEffect(() => {
    const from = display
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setDisplay(Math.round(from + (target - from) * ease))
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return display
}

// ============================================================
// Period data generator — returns scaled data per period
// ============================================================
function getPeriodData(period: Period) {
  const factors: Record<Period, { revenue: number; signups: number; active: number; visitors: number; months: number }> = {
    '7d':  { revenue: 0.06, signups: 0.05, active: 0.35, visitors: 0.04, months: 1 },
    '30d': { revenue: 0.25, signups: 0.22, active: 0.55, visitors: 0.18, months: 1 },
    '90d': { revenue: 0.55, signups: 0.50, active: 0.75, visitors: 0.42, months: 3 },
    '12m': { revenue: 1.0,  signups: 1.0,  active: 1.0,  visitors: 1.0,  months: 7 },
    'all': { revenue: 1.15, signups: 1.20, active: 1.05, visitors: 1.10, months: 7 },
    'custom': { revenue: 1.15, signups: 1.20, active: 1.05, visitors: 1.10, months: 7 },
  }
  const f = factors[period]

  const monthlyRevenue = MONTHLY_DATA.map(m => ({
    ...m,
    revenue: Math.round(m.revenue * f.revenue / f.months * (f.months === 1 ? 1 : 1)),
    signups: Math.round(m.signups * f.signups / f.months * (f.months === 1 ? 1 : 1)),
    activeUsers: Math.round(m.activeUsers * f.active),
  }))

  // Trim months based on period
  const trimmed = period === '7d' ? monthlyRevenue.slice(-1) :
                  period === '30d' ? monthlyRevenue.slice(-1) :
                  period === '90d' ? monthlyRevenue.slice(-3) :
                  monthlyRevenue

  const totalRevenue = trimmed.reduce((s, m) => s + m.revenue, 0)
  const totalSignups = trimmed.reduce((s, m) => s + m.signups, 0)
  const latestActive = trimmed[trimmed.length - 1]?.activeUsers || 0
  const visitors = Math.round(45200 * f.visitors)

  const featureUsage = FEATURE_USAGE.map(fu => ({
    ...fu,
    users: Math.round(fu.users * f.active),
    percentage: Math.min(100, Math.round(fu.percentage * (0.8 + f.active * 0.2))),
  }))

  const topCities = TOP_CITIES.map(c => ({
    ...c,
    users: Math.round(c.users * f.active),
  }))

  const planDist = [
    { label: 'Premium', value: Math.round(USERS.filter(u => u.plan === 'premium').length * f.active), color: '#8b5cf6' },
    { label: 'Pro', value: Math.round(USERS.filter(u => u.plan === 'pro').length * f.active), color: '#3b82f6' },
    { label: 'Starter', value: Math.round(USERS.filter(u => u.plan === 'starter').length * f.active), color: '#2dd4bf' },
    { label: 'Non-subscriber', value: Math.round(USERS.filter(u => u.plan === 'non_subscriber').length * f.active), color: '#94a3b8' },
  ]

  const statusDist = [
    { label: 'Active', value: Math.round(USERS.filter(u => u.status === 'active').length * f.active), color: '#22c55e' },
    { label: 'Activation', value: Math.round(USERS.filter(u => u.status === 'activation').length * f.active), color: '#f59e0b' },
    { label: 'Suspended', value: Math.round(USERS.filter(u => u.status === 'suspended').length * f.active), color: '#ef4444' },
    { label: 'Cancelled', value: Math.round(USERS.filter(u => u.status === 'cancelled').length * f.active), color: '#94a3b8' },
  ]

  const txTypes = [
    { label: 'Subscriptions', value: Math.round(TRANSACTIONS.filter(t => t.type === 'subscription').length * f.revenue), color: '#3b82f6' },
    { label: 'One-time', value: Math.round(TRANSACTIONS.filter(t => t.type === 'one_time').length * f.revenue), color: '#8b5cf6' },
    { label: 'Refunds', value: Math.round(TRANSACTIONS.filter(t => t.type === 'refund').length * f.revenue), color: '#ef4444' },
  ]

  const funnel = [
    { label: 'Visitors', value: visitors, pct: 100 },
    { label: 'Signups', value: totalSignups, pct: Math.round((totalSignups / visitors) * 100) || 1 },
    { label: 'Activated', value: Math.round(totalSignups * 0.68), pct: Math.round(68 * f.active) },
    { label: 'First Purchase', value: Math.round(totalSignups * 0.246), pct: Math.round(25 * f.active) },
    { label: 'Retained (30d)', value: Math.round(totalSignups * 0.18), pct: Math.round(18 * f.active) },
  ]

  const changes: Record<Period, string> = {
    '7d': '+2.1%',
    '30d': '+8.4%',
    '90d': '+14.2%',
    '12m': '+12.4%',
    'all': '+18.7%',
    'custom': '+18.7%',
  }

  return { monthly: trimmed, totalRevenue, totalSignups, latestActive, visitors, featureUsage, topCities, planDist, statusDist, txTypes, funnel, change: changes[period] }
}

// ============================================================
// Components
// ============================================================
function MetricCard({ label, value, change, accent }: { label: string; value: string; change?: string; accent?: boolean }) {
  const isDown = change?.startsWith('-')
  return (
    <div className={`lf-panel p-5 transition-all duration-300 ${accent ? 'ring-1 ring-primary/20' : ''}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1.5 text-2xl font-bold tracking-tight transition-colors duration-300 ${accent ? 'text-primary' : 'text-foreground'}`}>{value}</p>
      {change && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isDown ? 'text-red-600' : 'text-emerald-600'}`}>
            {isDown ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
            {change}
          </span>
          <span className="text-xs text-muted-foreground">vs prev</span>
        </div>
      )}
    </div>
  )
}

function AnimatedNumber({ value, prefix = '', suffix = '', duration = 500 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const animated = useAnimatedValue(value, duration)
  return <>{prefix}{animated.toLocaleString()}{suffix}</>
}

function BarChart({ data, label, sublabel, animateKey }: { data: { label: string; value: number }[]; label: string; sublabel: string; animateKey: string }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="lf-panel p-6">
      <p className="lf-card-title">{label}</p>
      <p className="lf-body text-xs mb-4">{sublabel}</p>
      <div className="flex items-end gap-2 h-44">
        {data.map((d, i) => (
          <div key={`${animateKey}-${d.label}`} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[10px] font-semibold text-foreground tabular-nums">
              {d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}
            </span>
            <div
              className="w-full rounded-t bg-primary transition-all duration-700 ease-out"
              style={{
                height: `${(d.value / max) * 100}%`,
                minHeight: d.value > 0 ? 4 : 0,
                transitionDelay: `${i * 60}ms`,
              }}
            />
            <span className="text-[10px] text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HorizontalBarChart({ data, maxVal, animateKey }: { data: { label: string; value: number; color?: string }[]; maxVal?: number; animateKey: string }) {
  const max = maxVal || Math.max(...data.map(d => d.value), 1)
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={`${animateKey}-${d.label}`}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-foreground">{d.label}</span>
            <span className="text-xs text-muted-foreground tabular-nums">{d.value.toLocaleString()}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: d.color || 'hsl(var(--primary))',
                transitionDelay: `${i * 80}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ segments, animateKey, size = 140 }: { segments: { label: string; value: number; color: string }[]; animateKey: string; size?: number }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1
  const r = size / 2
  const circumference = 2 * Math.PI * r

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="rotate-[-90deg]">
          <circle cx={r} cy={r} r={r - 8} fill="none" stroke="hsl(var(--muted))" strokeWidth="16" />
          {segments.map((seg, i) => {
            const prevSum = segments.slice(0, i).reduce((s, x) => s + x.value, 0)
            const dashLen = (seg.value / total) * circumference
            const dashOff = -((prevSum / total) * circumference)
            return (
              <circle
                key={`${animateKey}-${seg.label}`}
                cx={r} cy={r} r={r - 8}
                fill="none"
                stroke={seg.color}
                strokeWidth="16"
                strokeDasharray={`${dashLen} ${circumference}`}
                strokeDashoffset={dashOff}
                className="transition-all duration-700 ease-out"
                style={{ transitionDelay: `${i * 100}ms` }}
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-foreground">{total.toLocaleString()}</span>
        </div>
      </div>
      <div className="space-y-2 flex-1">
        {segments.map((seg, i) => (
          <div key={`${animateKey}-${seg.label}`} className="flex items-center gap-2" style={{ animationDelay: `${i * 50}ms` }}>
            <span className="h-2.5 w-2.5 rounded-sm shrink-0 transition-colors duration-300" style={{ background: seg.color }} />
            <span className="text-sm text-foreground flex-1">{seg.label}</span>
            <span className="text-sm font-semibold text-foreground tabular-nums">{seg.value.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground tabular-nums">{((seg.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FunnelChart({ steps, animateKey }: { steps: { label: string; value: number; pct: number }[]; animateKey: string }) {
  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <div key={`${animateKey}-${step.label}`} className="flex items-center gap-3">
          <span className="text-sm text-foreground w-28 shrink-0">{step.label}</span>
          <div className="flex-1">
            <div className="h-8 rounded bg-muted overflow-hidden relative">
              <div
                className="h-full rounded bg-primary transition-all duration-700 ease-out flex items-center px-3"
                style={{ width: `${step.pct}%`, transitionDelay: `${i * 100}ms` }}
              >
                {step.pct > 15 && <span className="text-xs font-semibold text-white">{step.value.toLocaleString()}</span>}
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold text-foreground w-10 text-right tabular-nums">{step.pct}%</span>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// Main
// ============================================================
export default function AdminAnalytics() {
  const [period, setPeriod] = useState<TimePeriod>('12m')
  const [selectedFinding, setSelectedFinding] = useState<{ metric: string; value: string; change: string; positive: boolean; insight: string } | null>(null)
  const { data, isLoading } = useAnalytics()

  const periodData = useMemo(() => getPeriodData(period), [period])

  const keyFindingsData = useMemo(() => [
    { metric: 'Total Revenue', value: `$${periodData.totalRevenue.toLocaleString()}`, change: periodData.change, positive: true, insight: `Revenue for ${period === 'all' ? 'all time' : `last ${period}`}` },
    { metric: 'New Signups', value: periodData.totalSignups.toLocaleString(), change: periodData.change, positive: true, insight: `New user accounts in period` },
    { metric: 'Active Users', value: periodData.latestActive.toLocaleString(), change: '+8.7%', positive: true, insight: 'Current active user base' },
    { metric: 'Top Feature', value: periodData.featureUsage[0]?.feature || '—', change: `${periodData.featureUsage[0]?.percentage || 0}%`, positive: true, insight: 'Most adopted product feature' },
    { metric: 'Top City', value: periodData.topCities[0]?.city || '—', change: `${periodData.topCities[0]?.users?.toLocaleString() || 0} users`, positive: true, insight: 'Strongest geographic market' },
    { metric: 'Conversion Rate', value: `${OVERVIEW_STATS.conversionRate}%`, change: '+1.2%', positive: true, insight: 'Non-subscriber → paid conversion improving' },
    { metric: 'Churn Rate', value: `${OVERVIEW_STATS.churnRate}%`, change: '-0.3%', positive: true, insight: 'Retention efforts showing results' },
    { metric: 'Paid Users', value: OVERVIEW_STATS.paidUsers.toLocaleString(), change: '+12.5%', positive: true, insight: 'Growing paying customer base' },
  ], [periodData, period])

  const { sortKey, sortDirection, toggleSort, sorted: sortedFindings } = useSort({ data: keyFindingsData })

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Analytics" subtitle="Loading..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sticky header + period filter */}
      <div className="sticky top-0 z-30 bg-white border-b border-border mb-6 py-4">
        <AdminPageHeader
          title="Analytics"
          subtitle="Platform performance metrics and trends"
          period={period}
          onPeriodChange={setPeriod}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCard label="Total Revenue" value={`$${periodData.totalRevenue.toLocaleString()}`} change={periodData.change} accent />
        <MetricCard label="Total Users" value={OVERVIEW_STATS.totalUsers.toLocaleString()} change="+8.7%" />
        <MetricCard label="Conversion Rate" value={`${OVERVIEW_STATS.conversionRate}%`} change="+1.2%" />
        <MetricCard label="Churn Rate" value={`${OVERVIEW_STATS.churnRate}%`} change="-0.3%" />
        <MetricCard label="Active Users" value={periodData.latestActive.toLocaleString()} change={periodData.change} />
      </div>

      {/* Revenue + Signups */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BarChart
          data={periodData.monthly.map(m => ({ label: m.month.split(' ')[0], value: m.revenue }))}
          label="Revenue by Month"
          sublabel={`Period: ${period === 'all' ? 'All time' : period} · dollar amounts`}
          animateKey={`rev-${period}`}
        />
        <BarChart
          data={periodData.monthly.map(m => ({ label: m.month.split(' ')[0], value: m.signups }))}
          label="New Signups"
          sublabel={`Period: ${period === 'all' ? 'All time' : period} · new accounts`}
          animateKey={`sign-${period}`}
        />
      </div>

      {/* Active users + Funnel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BarChart
          data={periodData.monthly.map(m => ({ label: m.month.split(' ')[0], value: m.activeUsers }))}
          label="Monthly Active Users"
          sublabel={`Period: ${period === 'all' ? 'All time' : period} · unique users`}
          animateKey={`act-${period}`}
        />
        <div className="lf-panel p-6">
          <p className="lf-card-title">Conversion Funnel</p>
          <p className="lf-body text-xs mb-4">Visitor → Signup → Purchase → Retention</p>
          <FunnelChart steps={periodData.funnel} animateKey={`funnel-${period}`} />
        </div>
      </div>

      {/* Donuts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lf-panel p-6">
          <p className="lf-card-title mb-4">Plan Distribution</p>
          <DonutChart segments={periodData.planDist} animateKey={`plan-${period}`} />
        </div>
        <div className="lf-panel p-6">
          <p className="lf-card-title mb-4">User Status</p>
          <DonutChart segments={periodData.statusDist} animateKey={`status-${period}`} />
        </div>
        <div className="lf-panel p-6">
          <p className="lf-card-title mb-4">Transaction Types</p>
          <DonutChart segments={periodData.txTypes} animateKey={`tx-${period}`} />
        </div>
      </div>

      {/* Features + Session + Device */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lf-panel p-6">
          <p className="lf-card-title mb-1">Feature Adoption</p>
          <p className="lf-body text-xs mb-4">% of active users per feature</p>
          <HorizontalBarChart data={periodData.featureUsage.map(f => ({ label: f.feature, value: f.users }))} animateKey={`feat-${period}`} />
        </div>
        <div className="lf-panel p-6">
          <p className="lf-card-title mb-4">Session Metrics</p>
          <div className="space-y-4">
            {[
              { label: 'Avg Duration', value: '8m 24s', bar: 70 },
              { label: 'Bounce Rate', value: '18.4%', bar: 18 },
              { label: 'Pages/Session', value: '5.7', bar: 57 },
              { label: 'Return Rate', value: '63%', bar: 63 },
            ].map((m, i) => (
              <div key={m.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-foreground">{m.label}</span>
                  <span className="text-sm font-semibold text-foreground tabular-nums">{m.value}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-700 ease-out" style={{ width: `${m.bar}%`, transitionDelay: `${i * 100}ms` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lf-panel p-6">
          <p className="lf-card-title mb-4">Device Split</p>
          <div className="flex h-4 overflow-hidden rounded-full gap-0.5 mb-4">
            <div className="bg-primary rounded-l-full transition-all duration-700" style={{ width: '68%' }} />
            <div className="bg-primary/40 transition-all duration-700" style={{ width: '29%' }} />
            <div className="bg-primary/15 rounded-r-full flex-1 transition-all duration-700" />
          </div>
          <div className="space-y-2.5">
            {[['bg-primary', 'Desktop', '68%', '30,736'], ['bg-primary/40', 'Mobile', '29%', '13,108'], ['bg-primary/15', 'Tablet', '3%', '1,356']].map(([cls, label, pct, count]) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-sm ${cls}`} />
                  <span className="text-sm text-foreground">{label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
                  <span className="text-xs font-semibold text-foreground tabular-nums w-8 text-right">{pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Cities — Dotted Map Infographic */}
      <div className="lf-panel p-6">
        <p className="lf-card-title mb-1">Geographic Distribution</p>
        <p className="lf-body text-xs mb-4">Top cities by user count — pin size reflects volume</p>
        <div className="relative w-full overflow-hidden rounded-xl bg-white border border-border" style={{ aspectRatio: '3 / 1' }}>
          <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="0.8" fill="#d1d5db" />
              </pattern>
            </defs>

            {/* Dotted continent shapes */}
            {/* North America */}
            <ellipse cx="240" cy="155" rx="140" ry="90" fill="url(#dots)" />
            <ellipse cx="200" cy="200" rx="60" ry="40" fill="url(#dots)" />
            <ellipse cx="300" cy="130" rx="80" ry="55" fill="url(#dots)" />
            <ellipse cx="170" cy="170" rx="50" ry="35" fill="url(#dots)" />
            <ellipse cx="280" cy="195" rx="45" ry="30" fill="url(#dots)" />

            {/* South America */}
            <ellipse cx="280" cy="330" rx="55" ry="80" fill="url(#dots)" />
            <ellipse cx="265" cy="290" rx="40" ry="30" fill="url(#dots)" />
            <ellipse cx="295" cy="370" rx="35" ry="45" fill="url(#dots)" />

            {/* Europe */}
            <ellipse cx="500" cy="115" rx="55" ry="40" fill="url(#dots)" />
            <ellipse cx="530" cy="100" rx="30" ry="25" fill="url(#dots)" />
            <ellipse cx="475" cy="130" rx="25" ry="20" fill="url(#dots)" />

            {/* Africa */}
            <ellipse cx="520" cy="265" rx="60" ry="90" fill="url(#dots)" />
            <ellipse cx="510" cy="220" rx="40" ry="35" fill="url(#dots)" />
            <ellipse cx="535" cy="310" rx="40" ry="45" fill="url(#dots)" />

            {/* Asia */}
            <ellipse cx="700" cy="130" rx="130" ry="70" fill="url(#dots)" />
            <ellipse cx="750" cy="160" rx="80" ry="45" fill="url(#dots)" />
            <ellipse cx="640" cy="115" rx="70" ry="40" fill="url(#dots)" />
            <ellipse cx="820" cy="120" rx="50" ry="35" fill="url(#dots)" />

            {/* Australia */}
            <ellipse cx="810" cy="350" rx="50" ry="35" fill="url(#dots)" />

            {/* City pin markers */}
            {periodData.topCities.map((city) => {
              const coords: Record<string, [number, number]> = {
                'New York': [280, 175],
                'Lagos': [510, 258],
                'London': [495, 112],
                'Toronto': [260, 152],
                'Houston': [238, 200],
                'San Francisco': [170, 170],
                'Chicago': [252, 162],
                'Atlanta': [258, 192],
                'Dallas': [235, 198],
                'Nairobi': [545, 268],
              }
              const pos = coords[city.city]
              if (!pos) return null
              const maxUsers = Math.max(...periodData.topCities.map(c => c.users))
              const scale = maxUsers > 0 ? city.users / maxUsers : 0
              const pinH = 18 + scale * 14
              const pinW = 12 + scale * 8
              const dotR = 3 + scale * 3
              const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444', '#22c55e', '#06b6d4', '#f97316']
              const color = colors[periodData.topCities.indexOf(city) % colors.length]
              return (
                <g key={city.city}>
                  {/* Pin shadow */}
                  <ellipse cx={pos[0]} cy={pos[1] + 2} rx={pinW * 0.5} ry={3} fill="#00000015" />
                  {/* Pin body */}
                  <path
                    d={`M${pos[0]},${pos[1] - pinH} Q${pos[0] - pinW},${pos[1] - pinH * 0.5} ${pos[0] - pinW},${pos[1] - pinH * 0.3} A${pinW},${pinW} 0 0,1 ${pos[0] + pinW},${pos[1] - pinH * 0.3} Q${pos[0] + pinW},${pos[1] - pinH * 0.5} ${pos[0]},${pos[1] - pinH} Z`}
                    fill="white"
                    stroke={color}
                    strokeWidth={1.5}
                    filter="drop-shadow(0 1px 2px rgba(0,0,0,0.15))"
                  />
                  {/* Pin dot */}
                  <circle cx={pos[0]} cy={pos[1] - pinH * 0.55} r={dotR} fill={color} />
                  {/* Pulse ring */}
                  <circle cx={pos[0]} cy={pos[1] - pinH * 0.55} r={dotR + 2} fill="none" stroke={color} strokeWidth={1} opacity={0.4}>
                    <animate attributeName="r" from={dotR + 2} to={dotR + 10} dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0" dur="3s" repeatCount="indefinite" />
                  </circle>
                  {/* City label */}
                  <text
                    x={pos[0]}
                    y={pos[1] - pinH - 6}
                    textAnchor="middle"
                    className="fill-foreground"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="inherit"
                  >{city.city}</text>
                </g>
              )
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-3 right-3 rounded-lg bg-white/90 backdrop-blur-sm border border-border p-2.5 space-y-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Users</p>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-blue-500 opacity-40" />
              <span className="text-[10px] text-muted-foreground">Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-4 w-4 rounded-full bg-blue-500 opacity-70" />
              <span className="text-[10px] text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full bg-blue-500" />
              <span className="text-[10px] text-muted-foreground">High</span>
            </div>
          </div>
        </div>

        {/* City list below map */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-4">
          {periodData.topCities.map((city) => {
            const maxUsers = Math.max(...periodData.topCities.map(c => c.users))
            const pct = maxUsers > 0 ? (city.users / maxUsers) * 100 : 0
            return (
              <div key={city.city} className="flex items-center gap-2 py-1">
                <span className="text-xs font-medium text-foreground w-28 truncate">{city.city}</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[11px] font-semibold tabular-nums text-foreground w-12 text-right">{city.users.toLocaleString()}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Key Findings */}
      <div className="lf-panel overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="lf-card-title">Key Findings</p>
          <p className="lf-body text-xs mt-0.5">Auto-generated insights — updates with selected period</p>
        </div>
        <div className="overflow-x-auto">
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <SortableHeader label="Metric" sortKey="metric" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                <SortableHeader label="Value" sortKey="value" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                <SortableHeader label="Change" sortKey="change" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                <SortableHeader label="Insight" sortKey="insight" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden md:table-cell" />
              </tr>
            </thead>
            <tbody>
              {sortedFindings.map((row, i) => (
                <tr key={`${row.metric}-${period}`} className="lf-table-row cursor-pointer" onClick={() => setSelectedFinding(row)} style={{ animationDelay: `${i * 40}ms` }}>
                  <td className="lf-table-cell font-medium text-foreground">{row.metric}</td>
                  <td className="lf-table-cell font-semibold tabular-nums">{row.value}</td>
                  <td className="lf-table-cell">
                    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${row.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {row.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {row.change}
                    </span>
                  </td>
                  <td className="lf-table-cell hidden md:table-cell text-xs text-muted-foreground max-w-[200px]">{row.insight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedFinding && (
        <AdminDetailModal
          title={selectedFinding.metric}
          subtitle={`Period: ${period}`}
          onClose={() => setSelectedFinding(null)}
          fields={[
            { label: 'Value', value: selectedFinding.value },
            { label: 'Change', value: selectedFinding.change },
            { label: 'Direction', value: selectedFinding.positive ? 'Positive' : 'Needs attention' },
            { label: 'Insight', value: selectedFinding.insight },
          ]}
        />
      )}
    </div>
  )
}
