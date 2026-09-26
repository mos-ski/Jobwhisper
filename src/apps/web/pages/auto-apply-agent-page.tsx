import { useSearchParams } from 'react-router-dom'

import { AutoApplyAgentView } from '@/features/auto-apply/auto-apply-view'
import { autoApplyFairUseRunning, autoApplyFairUseSpent } from '@/mocks/fair-use'

// Fair use is what "unlimited" means for the agent (PRICING.md §1.2): a run applies to 50
// jobs, then rests for five hours. `?fair-use=` picks which side of that to review.
const FAIR_USE_STATES = { running: autoApplyFairUseRunning, spent: autoApplyFairUseSpent } as const

export function AutoApplyAgentPage() {
  const [params] = useSearchParams()
  const key = params.get('fair-use')
  const fairUse = key !== null && key in FAIR_USE_STATES ? FAIR_USE_STATES[key as keyof typeof FAIR_USE_STATES] : undefined

  return (
    <AutoApplyAgentView
      homeHref="/v3/app"
      setupHref="/v3/auto-apply/contact"
      agentHref="/v3/auto-apply/agent"
      jobsHref="/v3/auto-apply/jobs"
      appliedHref="/v3/auto-apply/applied"
      fairUse={fairUse}
    />
  )
}
