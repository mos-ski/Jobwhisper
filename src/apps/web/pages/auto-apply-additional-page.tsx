import { autoApplySetup } from '@/mocks/auto-apply'
import { AutoApplySetupStepView } from '@/features/auto-apply/auto-apply-view'

export function AutoApplyAdditionalPage() {
  return (
    <AutoApplySetupStepView
      homeHref="/v3/app"
      backHref="/v3/auto-apply/preferences"
      nextHref="/v3/auto-apply/review"
      setup={autoApplySetup}
      step="additional"
    />
  )
}
