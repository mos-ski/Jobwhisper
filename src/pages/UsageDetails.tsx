import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CREDIT_TRANSACTIONS, CREDIT_RULES, featureColor, type CreditFeature, type CreditTransaction } from '@/data/creditHistory'

const TODAY = new Date('2026-06-23T23:59:59')
const RANGE_OPTIONS = [7, 30, 90] as const
const FEATURE_OPTIONS: Array<{ value: CreditFeature | 'all'; label: string }> = [
  { value: 'all', label: 'All features' },
  { value: 'resume-builder', label: CREDIT_RULES['resume-builder'].label },
  { value: 'interview-prep', label: CREDIT_RULES['interview-prep'].label },
  { value: 'interview-copilot', label: CREDIT_RULES['interview-copilot'].label },
  { value: 'auto-apply', label: CREDIT_RULES['auto-apply'].label },
]

function daysAgo(timestamp: string) {
  const ms = TODAY.getTime() - new Date(timestamp).getTime()
  return ms / (1000 * 60 * 60 * 24)
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp)
  const isToday = date.toDateString() === TODAY.toDateString()
  const yesterday = new Date(TODAY)
  yesterday.setDate(TODAY.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  if (isToday) return `Today, ${time}`
  if (isYesterday) return `Yesterday, ${time}`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function UsageDetails() {
  const navigate = useNavigate()
  const [range, setRange] = useState<typeof RANGE_OPTIONS[number]>(30)
  const [feature, setFeature] = useState<CreditFeature | 'all'>('all')

  const transactions = useMemo(
    () => CREDIT_TRANSACTIONS.filter((tx) => daysAgo(tx.timestamp) <= range),
    [range],
  )

  const visibleTransactions = useMemo(
    () => (feature === 'all' ? transactions : transactions.filter((tx) => tx.feature === feature)),
    [transactions, feature],
  )

  const totalUsed = useMemo(
    () => transactions.filter((tx) => tx.kind === 'used' && (feature === 'all' || tx.feature === feature)).reduce((sum, tx) => sum + Math.abs(tx.amount), 0),
    [transactions, feature],
  )

  // Group "used" transactions into per-day stacked bars
  const chartDays = useMemo(() => {
    const byDay = new Map<string, Partial<Record<CreditFeature, number>>>()
    transactions
      .filter((tx) => tx.kind === 'used' && tx.feature && (feature === 'all' || tx.feature === feature))
      .forEach((tx) => {
        const dayKey = new Date(tx.timestamp).toISOString().slice(0, 10)
        const entry = byDay.get(dayKey) ?? {}
        entry[tx.feature!] = (entry[tx.feature!] ?? 0) + Math.abs(tx.amount)
        byDay.set(dayKey, entry)
      })
    return Array.from(byDay.entries())
      .map(([day, segments]) => ({ day, segments, total: Object.values(segments).reduce((a, b) => a + (b ?? 0), 0) }))
      .sort((a, b) => a.day.localeCompare(b.day))
  }, [transactions, feature])

  const maxTotal = Math.max(1, ...chartDays.map((d) => d.total))
  const activeFeatures = feature === 'all'
    ? (Object.keys(CREDIT_RULES) as CreditFeature[])
    : [feature]

  return (
    <div className="lf-page-shell">
      <button
        onClick={() => navigate('/billing')}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Billing
      </button>

      <div className="mb-6">
        <h1 className="lf-page-title">Usage details</h1>
        <p className="lf-body mt-0.5">A breakdown of how your credits were earned and spent.</p>
      </div>

      <div className="lf-panel p-5 sm:p-6">
        <p className="text-3xl font-black text-foreground">{totalUsed} credits</p>
        <p className="text-sm text-muted-foreground">used in last {range} days</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select
            value={feature}
            onChange={(e) => setFeature(e.target.value as CreditFeature | 'all')}
            className="lf-select w-auto min-w-[160px]"
          >
            {FEATURE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={range}
            onChange={(e) => setRange(Number(e.target.value) as typeof RANGE_OPTIONS[number])}
            className="lf-select ml-auto w-auto min-w-[140px]"
          >
            {RANGE_OPTIONS.map((r) => (
              <option key={r} value={r}>Last {r} days</option>
            ))}
          </select>
        </div>

        {/* Chart */}
        <div className="mt-6 overflow-x-auto">
          {chartDays.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No usage in this period.</p>
          ) : (
            <div className="flex min-w-[480px] items-end gap-2 border-b border-slate-100 pb-2" style={{ height: 180 }}>
              {chartDays.map(({ day, segments, total }) => (
                <div key={day} className="group relative flex flex-1 flex-col items-center justify-end" style={{ height: '100%' }}>
                  <div className="flex w-full max-w-[28px] flex-col-reverse overflow-hidden rounded-sm" style={{ height: `${(total / maxTotal) * 100}%` }}>
                    {activeFeatures.map((f) => {
                      const value = segments[f]
                      if (!value) return null
                      return (
                        <div
                          key={f}
                          style={{ height: `${(value / total) * 100}%`, backgroundColor: featureColor(f) }}
                          title={`${CREDIT_RULES[f].label}: ${value}`}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-2 flex min-w-[480px] gap-2">
            {chartDays.map(({ day }) => (
              <span key={day} className="flex-1 text-center text-[10px] text-muted-foreground">
                {new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4">
          {activeFeatures.map((f) => (
            <span key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: featureColor(f) }} />
              {CREDIT_RULES[f].label}
            </span>
          ))}
        </div>
      </div>

      {/* Transaction feed */}
      <div className="lf-panel mt-5 p-0">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-bold text-foreground">Credit History</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {visibleTransactions.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">No transactions in this period.</p>
          ) : (
            visibleTransactions.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
          )}
        </div>
      </div>
    </div>
  )
}

function TransactionRow({ tx }: { tx: CreditTransaction }) {
  const positive = tx.amount > 0
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3.5">
      <div className="flex min-w-0 items-start gap-3">
        {tx.feature && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: featureColor(tx.feature) }} />}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{tx.label}</p>
          <p className="text-xs leading-5 text-muted-foreground">{tx.kind === 'used' ? (tx.detail ?? tx.sublabel) : tx.sublabel}</p>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <span
          className={cn(
            'inline-flex h-6 min-w-[2.25rem] items-center justify-center rounded-full border px-2 text-xs font-bold',
            positive ? 'border-primary/30 bg-primary/5 text-primary' : 'border-border text-muted-foreground',
          )}
        >
          {positive ? `+${tx.amount}` : tx.amount}
        </span>
        <p className="mt-1 text-[11px] text-muted-foreground">{formatTimestamp(tx.timestamp)}</p>
      </div>
    </div>
  )
}
