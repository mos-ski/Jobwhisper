import type { AgentSessionStats } from '@/hooks/useAgentSession'

export interface Props {
  stats: AgentSessionStats
}

const STATS = [
  { key: 'found'    as const, label: 'Found' },
  { key: 'matched'  as const, label: 'Matched' },
  { key: 'tailored' as const, label: 'Tailored' },
  { key: 'applied'  as const, label: 'Applied' },
]

export default function AgentStatsSummary({ stats }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {STATS.map(({ key, label }) => (
        <div key={key} className="lf-panel p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">{stats[key]}</p>
        </div>
      ))}
    </div>
  )
}
