import { AutoApplyFullAutoConsentView } from '@/features/auto-apply/auto-apply-view'

export function AutoApplyFullAutoConsentPage() {
  return (
    <AutoApplyFullAutoConsentView
      homeHref="/v3/app"
      backHref="/v3/auto-apply/method"
      agentHref="/v3/auto-apply/agent"
    />
  )
}
