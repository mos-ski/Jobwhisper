// src/components/agents/AgentStatusCards.tsx
import { cn } from '@/lib/utils'
import type { AgentStatus } from '@/hooks/useAgentSession'

export interface Props {
  agents: AgentStatus[]
}

const BADGE: Record<AgentStatus['status'], string> = {
  running: 'bg-green-50 text-green-700',
  working: 'bg-yellow-50 text-yellow-700',
  idle:    'bg-slate-100 text-slate-500',
}

export default function AgentStatusCards({ agents }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {agents.filter(a => a.name !== 'system').map(agent => (
        <div key={agent.name} className="lf-panel p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wide text-foreground">
              {agent.label}
            </span>
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', BADGE[agent.status])}>
              {agent.status}
            </span>
          </div>
          <p className="text-sm text-foreground">{agent.currentTask}</p>
        </div>
      ))}
    </div>
  )
}
