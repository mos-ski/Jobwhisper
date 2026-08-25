import { autoApplySetup } from '@/mocks/auto-apply'
import { AutoApplySetupStepView } from '@/features/auto-apply/auto-apply-view'

export function AutoApplyContactPage() {
  return (
    <AutoApplySetupStepView
      homeHref="/v3/app"
      backHref="/v3/auto-apply"
      nextHref="/v3/auto-apply/preferences"
      setup={autoApplySetup}
      step="contact"
    />
  )
}
