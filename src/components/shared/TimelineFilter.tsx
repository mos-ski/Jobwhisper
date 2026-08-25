import { useEffect, useRef, useState } from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TimePeriod = '7d' | '30d' | '90d' | '12m' | 'all' | 'custom'

const PERIODS: { key: TimePeriod; label: string }[] = [
  { key: '7d', label: '7d' },
  { key: '30d', label: '30d' },
  { key: '90d', label: '90d' },
  { key: '12m', label: '12m' },
  { key: 'all', label: 'All time' },
]

export interface CustomDateRange {
  from: string
  to: string
}

function formatRangeLabel({ from, to }: CustomDateRange) {
  if (!from && !to) return 'Custom'
  const fmt = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  if (from && to) return `${fmt(from)} – ${fmt(to)}`
  return fmt(from || to)
}

interface TimelineFilterProps {
  value: TimePeriod
  onChange: (period: TimePeriod) => void
  className?: string
  customRange?: CustomDateRange
  onCustomRangeChange?: (range: CustomDateRange) => void
}

export function TimelineFilter({ value, onChange, className, customRange, onCustomRangeChange }: TimelineFilterProps) {
  const [open, setOpen] = useState(false)
  const [appliedRange, setAppliedRange] = useState<CustomDateRange>(customRange ?? { from: '', to: '' })
  const [draft, setDraft] = useState<CustomDateRange>(appliedRange)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    setDraft(appliedRange)
    const onClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  const apply = () => {
    setAppliedRange(draft)
    onCustomRangeChange?.(draft)
    onChange('custom')
    setOpen(false)
  }

  return (
    <div className={cn('flex items-center gap-1 flex-wrap', className)}>
      {PERIODS.map(p => (
        <button
          key={p.key}
          onClick={() => onChange(p.key)}
          className={cn(
            'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
            value === p.key
              ? 'bg-foreground text-white'
              : 'border border-border text-muted-foreground hover:text-foreground'
          )}
        >
          {p.label}
        </button>
      ))}

      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
            value === 'custom'
              ? 'bg-foreground text-white'
              : 'border border-border text-muted-foreground hover:text-foreground'
          )}
        >
          <Calendar className="h-3.5 w-3.5" />
          {value === 'custom' ? formatRangeLabel(appliedRange) : 'Custom'}
        </button>

        {open && (
          <div
            ref={popoverRef}
            className="absolute right-0 top-full z-30 mt-2 w-72 rounded-lg border border-border bg-white p-4 shadow-xl"
          >
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">From</label>
                <input
                  type="date"
                  value={draft.from}
                  max={draft.to || undefined}
                  onChange={e => setDraft(prev => ({ ...prev, from: e.target.value }))}
                  className="lf-input h-9"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">To</label>
                <input
                  type="date"
                  value={draft.to}
                  min={draft.from || undefined}
                  onChange={e => setDraft(prev => ({ ...prev, to: e.target.value }))}
                  className="lf-input h-9"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setOpen(false)}
                  className="lf-btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={apply}
                  disabled={!draft.from && !draft.to}
                  className="lf-btn flex-1"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
