import { autoApplySetup } from '@/mocks/auto-apply'
import { AutoApplyReviewView } from '@/features/auto-apply/auto-apply-view'

export function AutoApplyReviewPage() {
  return (
    <AutoApplyReviewView
      homeHref="/v3/app"
      contactHref="/v3/auto-apply/contact"
      additionalHref="/v3/auto-apply/additional"
      methodHref="/v3/auto-apply/method"
      setup={autoApplySetup}
    />
  )
}
