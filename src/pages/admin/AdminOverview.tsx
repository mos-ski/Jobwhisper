import { useState } from 'react'
import { format } from 'date-fns'
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, UserCheck } from 'lucide-react'
import { useOverview } from '@/hooks/useAdmin'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'
import type { MonthlyData } from '@/lib/adminMockData'

type Period = '12m' | '30d' | '7d' | '24h'

function ChangeBadge({ value }: { value: string }) {
  const isDown = value.startsWith('-')
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
      isDown ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
    }`}>
      {isDown ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
      {value}
    </span>
  )
}

function StatCard({ label, value, change, hero, icon: Icon }: { label: string; value: string; change: string; hero?: boolean; icon: React.ElementType }) {
  return (
    <div className={`lf-panel p-5 ${hero ? 'ring-1 ring-primary/20' : ''}`}>
      <div className="flex items-center justify-between">
        <p className="lf-body text-xs">{label}</p>
        <Icon className={`h-4 w-4 ${hero ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
      <p className={`mt-1.5 text-2xl font-bold tracking-tight ${hero ? 'text-primary' : 'text-foreground'}`}>{value}</p>
      <div className="mt-2 flex items-center gap-2">
        <ChangeBadge value={change} />
        <span className="text-xs text-muted-foreground">vs last month</span>
      </div>
    </div>
  )
}

/* ─── Revenue line chart (USD + NGN) ───
 * Two currencies at very different orders of magnitude can't share a raw
 * linear axis without one line becoming a flat line at the bottom (or an
 * arbitrary divisor faking a comparison, which is what this chart did
 * before). Each series is indexed to its own monthly peak (0–100% of that
 * currency's high point), so both lines use the same honest axis and their
 * *shapes* are genuinely comparable — the real dollar/naira amounts live in
 * the hover tooltip, never implied by the shared scale. */
function RevenueLineChart({ data }: { data: MonthlyData[] }) {
  const W = 480, H = 180, PAD = { top: 16, right: 12, bottom: 26, left: 40 }
  const iw = W - PAD.left - PAD.right
  const ih = H - PAD.top - PAD.bottom
  const [hover, setHover] = useState<number | null>(null)

  const usd = data.map(d => d.revenueUsd)
  const ngn = data.map(d => d.revenueNgn)
  const usdMax = Math.max(...usd) * 1.15
  const ngnMax = Math.max(...ngn) * 1.15
  const usdPct = usd.map(v => v / usdMax)
  const ngnPct = ngn.map(v => v / ngnMax)

  const toX = (i: number) => PAD.left + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw)
  const toY = (pct: number) => PAD.top + ih - pct * ih

  const smooth = (vals: number[]) => {
    const pts = vals.map((v, i) => ({ x: toX(i), y: toY(v) }))
    let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = pts[Math.min(i + 2, pts.length - 1)]
      const t = 0.3
      d += ` C${(p1.x + (p2.x - p0.x) * t).toFixed(1)},${(p1.y + (p2.y - p0.y) * t).toFixed(1)} ${(p2.x - (p3.x - p1.x) * t).toFixed(1)},${(p2.y - (p3.y - p1.y) * t).toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
    }
    return d
  }

  const area = (vals: number[]) =>
    smooth(vals) + ` L${toX(vals.length - 1).toFixed(1)},${(PAD.top + ih).toFixed(1)} L${toX(0).toFixed(1)},${(PAD.top + ih).toFixed(1)} Z`

  const colWidth = data.length > 0 ? iw / data.length : iw
  const USD_COLOR = '#2563EB'
  const NGN_COLOR = '#8B5CF6'

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={USD_COLOR} stopOpacity={0.14} />
            <stop offset="100%" stopColor={USD_COLOR} stopOpacity={0} />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map(f => {
          const y = PAD.top + ih * (1 - f)
          return <line key={f} x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#E5E7EB" strokeWidth={0.5} />
        })}
        {hover !== null && (
          <line x1={toX(hover)} y1={PAD.top} x2={toX(hover)} y2={PAD.top + ih} stroke="#9CA3AF" strokeWidth={1} strokeDasharray="2,2" opacity={0.5} />
        )}
        <path d={area(usdPct)} fill="url(#areaBlue)" />
        <path d={smooth(ngnPct)} fill="none" stroke={NGN_COLOR} strokeWidth={2} strokeLinecap="round" strokeDasharray="4,3" />
        <path d={smooth(usdPct)} fill="none" stroke={USD_COLOR} strokeWidth={2} strokeLinecap="round" />
        {usdPct.map((v, i) => <circle key={`u${i}`} cx={toX(i)} cy={toY(v)} r={hover === i ? 4 : 3} fill={USD_COLOR} stroke="#fff" strokeWidth={1.5} className="transition-all" />)}
        {ngnPct.map((v, i) => <circle key={`n${i}`} cx={toX(i)} cy={toY(v)} r={hover === i ? 4 : 3} fill={NGN_COLOR} stroke="#fff" strokeWidth={1.5} className="transition-all" />)}
        {data.map((d, i) => (
          <rect
            key={`hit-${i}`}
            x={toX(i) - colWidth / 2}
            y={PAD.top}
            width={colWidth}
            height={ih}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
        {data.map((d, i) => (
          <text key={i} x={toX(i)} y={H - 8} textAnchor="middle" fill="#9CA3AF" fontSize={10}>
            {d.month.split(' ')[0]}
          </text>
        ))}
        {[0, 0.5, 1].map(f => (
          <text key={f} x={PAD.left - 8} y={PAD.top + ih * (1 - f) + 3} textAnchor="end" fill="#9CA3AF" fontSize={9}>
            {Math.round(f * 100)}%
          </text>
        ))}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg border border-border bg-white px-3 py-2 text-xs shadow-lg whitespace-nowrap"
          style={{ left: `${(toX(hover) / W) * 100}%`, top: `${(Math.min(toY(usdPct[hover]), toY(ngnPct[hover])) / H) * 100}%` }}
        >
          <p className="font-semibold text-foreground">{data[hover].month}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 rounded-full" style={{ background: USD_COLOR }} />${data[hover].revenueUsd.toLocaleString()} USD</p>
          <p className="flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 rounded-full" style={{ background: NGN_COLOR }} />₦{data[hover].revenueNgn.toLocaleString()} NGN</p>
        </div>
      )}
    </div>
  )
}

/* ─── Signups stacked bar chart ───
 * Segments now stack non-subscriber→premium bottom-to-top (largest, most-common tier
 * anchors the bar; the darkest, most-valuable tier caps it) instead of the
 * reverse, which left the lightest color dominating the top of every bar
 * and made the whole chart read as mostly-empty. A 2px surface gap now
 * separates each segment, and each bar gets a total label + hover tooltip
 * with the full tier breakdown. */
function SignupsStackedBarChart({ data }: { data: MonthlyData[] }) {
  const W = 480, H = 180, PAD = { top: 22, right: 8, bottom: 24, left: 8 }
  const iw = W - PAD.left - PAD.right
  const ih = H - PAD.top - PAD.bottom
  const gap = 10
  const segGap = 2
  const bw = (iw - gap * (data.length - 1)) / data.length
  const [hover, setHover] = useState<number | null>(null)

  const order: { key: keyof MonthlyData['signupsByPlan']; label: string; color: string }[] = [
    { key: 'nonSubscriber', label: 'Non-subscriber', color: '#E2E8F0' },
    { key: 'starter', label: 'Starter', color: '#93C5FD' },
    { key: 'pro', label: 'Pro', color: '#60A5FA' },
    { key: 'premium', label: 'Premium', color: '#2563EB' },
  ]

  const totals = data.map(d => order.reduce((s, seg) => s + d.signupsByPlan[seg.key], 0))
  const maxTotal = Math.max(...totals)
  const sc = ih / maxTotal

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" onMouseLeave={() => setHover(null)}>
        {data.map((d, i) => {
          const x = PAD.left + i * (bw + gap)
          let cum = 0
          return (
            <g key={d.month} onMouseEnter={() => setHover(i)} className="cursor-pointer">
              <rect x={x} y={PAD.top - 14} width={bw} height={ih + 14} fill="transparent" />
              <text x={x + bw / 2} y={PAD.top - 8} textAnchor="middle" fill="#1F2937" fontSize={10} fontWeight={600}>
                {totals[i] >= 1000 ? `${(totals[i] / 1000).toFixed(1)}k` : totals[i]}
              </text>
              {order.map(seg => {
                const raw = d.signupsByPlan[seg.key]
                const fullH = raw * sc
                const y = PAD.top + ih - cum - fullH
                cum += fullH
                const sh = Math.max(fullH - segGap, 0.5)
                return (
                  <rect
                    key={seg.key}
                    x={x}
                    y={y + segGap / 2}
                    width={bw}
                    height={sh}
                    rx={2}
                    fill={seg.color}
                    opacity={hover !== null && hover !== i ? 0.45 : 1}
                    className="transition-opacity"
                  />
                )
              })}
              <text x={x + bw / 2} y={H - 6} textAnchor="middle" fill="#9CA3AF" fontSize={10}>
                {d.month.split(' ')[0]}
              </text>
            </g>
          )
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-lg border border-border bg-white px-3 py-2 text-xs shadow-lg"
          style={{
            left: `${((PAD.left + hover * (bw + gap) + bw / 2) / W) * 100}%`,
            top: `${((PAD.top + ih - totals[hover] * sc) / H) * 100}%`,
          }}
        >
          <p className="mb-1 font-semibold text-foreground">{data[hover].month}</p>
          {order.slice().reverse().map(seg => (
            <div key={seg.key} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-sm" style={{ background: seg.color }} />
                {seg.label}
              </span>
              <span className="font-medium tabular-nums text-foreground">{data[hover].signupsByPlan[seg.key].toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Feature adoption radar chart ───
 * Labels were anchored at a single point with no allowance for their own
 * rendered width, so multi-word labels ("Career Specialist", "Resume
 * Builder") ran past the viewBox edge and got hard-clipped by the SVG.
 * Fixed by wrapping every label onto up to two short lines (each line is
 * short enough to fit even at the widest anchor point) and giving the
 * canvas a bigger, non-square margin so the label ring never approaches
 * the edge. */
function wrapFeatureLabel(label: string): string[] {
  const words = label.split(' ')
  if (words.length <= 1) return [label]
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

function FeatureRadarChart({ data }: { data: { feature: string; users: number; percentage: number }[] }) {
  const W = 380, H = 340
  const cx = W / 2
  const cy = H / 2
  const R = 78
  const n = data.length
  const step = (2 * Math.PI) / n
  const start = -Math.PI / 2
  const [hover, setHover] = useState<number | null>(null)

  const pt = (i: number, r: number) => {
    const a = start + i * step
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  }

  const dataPts = data.map((d, i) => pt(i, (d.percentage / 100) * R))
  const poly = dataPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z'

  return (
    <div className="relative mx-auto max-w-[300px]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible" onMouseLeave={() => setHover(null)}>
        {[0.2, 0.4, 0.6, 0.8, 1].map(f => {
          const pts = Array.from({ length: n }, (_, i) => pt(i, f * R))
          const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z'
          return <path key={f} d={path} fill="none" stroke="#E5E7EB" strokeWidth={0.5} />
        })}
        {/* Ring scale labels, up the top spoke — only 3 stops (not 5) so the
            pills have room to breathe instead of overlapping each other */}
        {[0.33, 0.66, 1].map(f => {
          const y = cy - f * R
          const label = `${Math.round(f * 100)}%`
          return (
            <g key={`ring-${f}`}>
              <rect x={cx - 13} y={y - 6.5} width={26} height={13} rx={6.5} fill="#fff" stroke="#E5E7EB" strokeWidth={0.75} />
              <text x={cx} y={y + 3} textAnchor="middle" fill="#9CA3AF" fontSize={7.5} fontWeight={600}>{label}</text>
            </g>
          )
        })}
        {data.map((_, i) => {
          const p = pt(i, R)
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#E5E7EB" strokeWidth={0.5} />
        })}
        <path d={poly} fill="#2563EB" fillOpacity={0.12} />
        <path d={poly} fill="none" stroke="#2563EB" strokeWidth={2} strokeLinejoin="round" />
        {dataPts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hover === i ? 5 : 3}
            fill="#2563EB"
            stroke="#fff"
            strokeWidth={1.5}
            className="cursor-pointer transition-all"
            onMouseEnter={() => setHover(i)}
          />
        ))}
        {data.map((d, i) => {
          const lp = pt(i, R + 38)
          const anchor = lp.x < cx - 8 ? 'end' : lp.x > cx + 8 ? 'start' : 'middle'
          const above = lp.y < cy - 4
          const lines = wrapFeatureLabel(d.feature)
          const baseY = above ? lp.y - (lines.length - 1) * 11 : lp.y
          return (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setHover(i)}>
              {lines.map((line, li) => (
                <text key={li} x={lp.x} y={baseY + li * 11} textAnchor={anchor} fill={hover === i ? '#2563EB' : '#1F2937'} fontSize={10} fontWeight={500}>
                  {line}
                </text>
              ))}
              <text x={lp.x} y={baseY + lines.length * 11 + 2} textAnchor={anchor} fill="#9CA3AF" fontSize={9}>
                {d.users.toLocaleString()} users
              </text>
            </g>
          )
        })}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute right-0 top-0 rounded-lg border border-border bg-white px-3 py-2 text-xs shadow-lg">
          <p className="font-semibold text-foreground">{data[hover].feature}</p>
          <p className="mt-0.5 text-muted-foreground">{data[hover].percentage}% adoption · {data[hover].users.toLocaleString()} users</p>
        </div>
      )}
    </div>
  )
}

/* ─── Top cities dotted world map ───
 * Was a hand-drawn ASCII-mask approximation of the continents (blobby,
 * not very recognizable). Swapped for a real dotted-world-map asset
 * (public/world-map-dots.png, transparent background) with pins overlaid
 * in percentage-space so they still line up with the same city
 * coordinates. Pins previously had no way to identify which city was
 * which — a hover tooltip now names it and gives the exact count. */
function WorldMapDots({ cities }: { cities: { city: string; users: number; x: number; y: number }[] }) {
  const maxU = Math.max(...cities.map(c => c.users))
  const [hover, setHover] = useState<number | null>(null)
  const sorted = cities.map((c, i) => ({ ...c, i })).sort((a, b) => a.y - b.y)

  return (
    <div className="relative mx-auto max-w-[420px]" style={{ aspectRatio: '2099 / 1000' }}>
      <img src="/world-map-dots.png" alt="" className="absolute inset-0 h-full w-full object-contain opacity-90" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" onMouseLeave={() => setHover(null)}>
        <defs>
          <radialGradient id="glow">
            <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* Render top-to-bottom so lower pins' halos layer over higher ones', not vice-versa */}
        {sorted.map(c => {
          const i = c.i
          const r = 1.4 + (c.users / maxU) * 1.4
          const isHover = hover === i
          return (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setHover(i)}>
              <circle cx={c.x} cy={c.y} r={r * 2.2} fill="url(#glow)" />
              <circle cx={c.x} cy={c.y} r={r} fill="none" stroke="#2563EB" strokeWidth={0.3} opacity={isHover ? 0.7 : 0.35} />
              <circle cx={c.x} cy={c.y} r={isHover ? r * 0.55 : r * 0.45} fill="#2563EB" className="transition-all" />
              {/* Larger transparent hit area, easier to hover than the dot alone */}
              <circle cx={c.x} cy={c.y} r={Math.max(r * 1.8, 3.5)} fill="transparent" />
            </g>
          )
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg border border-border bg-white px-3 py-2 text-xs shadow-lg whitespace-nowrap"
          style={{ left: `${cities[hover].x}%`, top: `${cities[hover].y}%` }}
        >
          <p className="font-semibold text-foreground">{cities[hover].city}</p>
          <p className="text-muted-foreground tabular-nums">{cities[hover].users.toLocaleString()} users</p>
        </div>
      )}
    </div>
  )
}

export default function AdminOverview() {
  const [period, setPeriod] = useState<Period>('30d')
  const { data, isLoading } = useOverview()

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Overview" subtitle="Loading..." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="lf-panel p-5 animate-pulse">
              <div className="h-3 bg-muted rounded w-20" />
              <div className="h-7 bg-muted rounded w-24 mt-2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const { stats, revenue, users, monthlyData, featureUsage } = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Overview"
        subtitle={`${format(new Date(), 'EEEE, MMMM d, yyyy')} · Q3 2026`}
        extra={<span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">Live</span>}
      />

      {/* Time filter */}
      <div className="flex items-center gap-1.5">
        {(['12m', '30d', '7d', '24h'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              period === p ? 'bg-foreground text-white' : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Revenue */}
      <section>
        <h2 className="lf-section-title mb-3">Revenue</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Earned" value={`$${stats.totalRevenue.toLocaleString()}`} change={`+${stats.revenueGrowthMoM}%`} hero icon={DollarSign} />
          <StatCard label="MRR" value={`$${stats.mrr.toLocaleString()}`} change={`+${stats.revenueGrowthMoM}%`} icon={DollarSign} />
          <StatCard label="ARR" value={`$${stats.arr.toLocaleString()}`} change={`+${stats.revenueGrowthMoM}%`} icon={DollarSign} />
          <StatCard label="Avg Revenue/User" value={`$${stats.avgRevenuePerUser.toFixed(2)}`} change="+5.2%" icon={DollarSign} />
        </div>
      </section>

      {/* Users */}
      <section>
        <h2 className="lf-section-title mb-3">Users</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Users" value={stats.totalUsers.toLocaleString()} change={`+${stats.userGrowthMoM}%`} icon={Users} />
          <StatCard label="Paid Users" value={stats.paidUsers.toLocaleString()} change="+12.3%" icon={UserCheck} />
          <StatCard label="Activation Users" value={users.activation.toLocaleString()} change="+8.1%" icon={Activity} />
          <StatCard label="Conversion Rate" value={`${stats.conversionRate}%`} change="+1.2%" hero icon={UserCheck} />
        </div>
      </section>

      {/* Charts row 1: Revenue + Sign Ups */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="lf-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="lf-card-title">Revenue by Month</p>
              <p className="lf-body text-xs">Jan – Jul 2026 · % of each currency's monthly peak</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[#2563EB]" /> USD</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[#8B5CF6]" /> NGN</span>
            </div>
          </div>
          <RevenueLineChart data={monthlyData} />
        </div>

        <div className="lf-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="lf-card-title">Sign Ups</p>
              <p className="lf-body text-xs">{stats.totalUsers.toLocaleString()} total users</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-[#E2E8F0] ring-1 ring-inset ring-border" /> Non-subscriber</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-[#93C5FD]" /> Starter</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-[#60A5FA]" /> Pro</span>
              <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-[#2563EB]" /> Premium</span>
            </div>
          </div>
          <SignupsStackedBarChart data={monthlyData} />
        </div>
      </div>

      {/* Charts row 2: Radar + Map — items-start so neither card stretches to match a taller sibling and strands its chart in dead space */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <div className="lf-panel p-6">
          <p className="lf-card-title mb-2">Feature Adoption</p>
          <FeatureRadarChart data={featureUsage} />
        </div>

        <div className="lf-panel p-6">
          <p className="lf-card-title mb-4">Top Cities</p>
          <WorldMapDots
            cities={[
              { city: 'New York', users: 1523, x: 28.5, y: 33 },
              { city: 'Lagos', users: 1247, x: 49, y: 55 },
              { city: 'London', users: 987, x: 48.5, y: 26 },
              { city: 'Toronto', users: 756, x: 26, y: 31 },
              { city: 'Houston', users: 634, x: 22, y: 41 },
              { city: 'San Francisco', users: 523, x: 14, y: 36 },
              { city: 'Nairobi', users: 312, x: 58, y: 58 },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
