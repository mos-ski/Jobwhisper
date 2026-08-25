import { AutoApplyAgentView } from '@/features/auto-apply/auto-apply-view'

export function AutoApplyAgentPage() {
  return (
    <AutoApplyAgentView
      homeHref="/v3/app"
      setupHref="/v3/auto-apply/contact"
      agentHref="/v3/auto-apply/agent"
      jobsHref="/v3/auto-apply/jobs"
      appliedHref="/v3/auto-apply/applied"
    />
  )
}
