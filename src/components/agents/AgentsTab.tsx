// src/components/agents/AgentsTab.tsx
import { useAgentSession } from '@/hooks/useAgentSession'
import AgentStatsSummary from './AgentStatsSummary'
import AgentStatusCards from './AgentStatusCards'
import AgentFeed from './AgentFeed'

interface Props {
  studentId: string
}

export default function AgentsTab({ studentId }: Props) {
  const session = useAgentSession(studentId)

  return (
    <div className="space-y-4">
      <AgentStatsSummary stats={session.stats} />
      <AgentStatusCards agents={session.agents} />
      <AgentFeed events={session.events} />
    </div>
  )
}
