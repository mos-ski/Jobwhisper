import { DoneForYouView } from '@/features/billing/done-for-you-view'
import { CREDIT_WALLET } from '@/mocks/wallet'

export function BillingDoneForYouPage() {
  return (
    <DoneForYouView
      homeHref="/v3/app"
      backHref="/v3/billing"
      usageHref="/v3/billing/usage"
      creditUsage={{ remainingCents: CREDIT_WALLET.balanceCents, totalCents: CREDIT_WALLET.totalCents }}
    />
  )
}
