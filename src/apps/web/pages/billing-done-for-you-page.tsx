import { DoneForYouView } from '@/features/billing/done-for-you-view'
import { autoApplySetup } from '@/mocks/auto-apply'

export function BillingDoneForYouPage() {
  return (
    <DoneForYouView
      homeHref="/v3/app"
      backHref="/v3/billing"
      usageHref="/v3/billing/usage"
      setupHref="/v3/auto-apply/contact"
      profile={{ country: autoApplySetup.country, desiredRole: autoApplySetup.desiredRole, locations: autoApplySetup.locations }}
      savedCard={{ label: 'Mastercard •••• 4242', expiryLabel: '08/29' }}
    />
  )
}
