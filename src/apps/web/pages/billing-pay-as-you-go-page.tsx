import { PayAsYouGoView } from '@/features/billing/pay-as-you-go-view'
import { billingStandalonePurchases } from '@/mocks/account'
import { CREDIT_WALLET } from '@/mocks/wallet'

export function BillingPayAsYouGoPage() {
  return (
    <PayAsYouGoView
      homeHref="/v3/app"
      backHref="/v3/billing"
      purchases={billingStandalonePurchases}
      creditUsage={{ remainingCents: CREDIT_WALLET.balanceCents, totalCents: CREDIT_WALLET.totalCents }}
    />
  )
}
