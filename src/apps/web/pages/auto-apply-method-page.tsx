import { AutoApplyMethodView } from '@/features/auto-apply/auto-apply-view'

export function AutoApplyMethodPage() {
  return (
    <AutoApplyMethodView
      homeHref="/v3/app"
      backHref="/v3/auto-apply/review"
      agentHref="/v3/auto-apply/agent"
      jobsHref="/v3/auto-apply/jobs"
      extensionHref="/v3/extension"
      isPremiumUser={false}
    />
  )
}
