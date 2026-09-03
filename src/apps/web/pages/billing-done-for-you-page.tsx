import { DoneForYouView } from '@/features/billing/done-for-you-view'

export function BillingDoneForYouPage() {
  return (
    <DoneForYouView
      homeHref="/v3/app"
      backHref="/v3/billing"
      usageHref="/v3/billing/usage"
    />
  )
}
