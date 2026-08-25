import { autoApplySetup } from '@/mocks/auto-apply'
import { AutoApplySetupStepView } from '@/features/auto-apply/auto-apply-view'

export function AutoApplyPreferencesPage() {
  return (
    <AutoApplySetupStepView
      homeHref="/v3/app"
      backHref="/v3/auto-apply/contact"
      nextHref="/v3/auto-apply/additional"
      setup={autoApplySetup}
      step="preferences"
    />
  )
}
