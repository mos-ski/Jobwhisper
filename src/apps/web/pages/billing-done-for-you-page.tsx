import { useSearchParams } from 'react-router-dom'

import type { SuccessManagerDirectory } from '@/contracts/done-for-you.draft'
import { DoneForYouView } from '@/features/billing/done-for-you-view'
import { autoApplySetup } from '@/mocks/auto-apply'
import { successManagers } from '@/mocks/done-for-you'

function readDirectory(state: string | null): SuccessManagerDirectory {
  if (state === 'loading') return { status: 'loading' }
  if (state === 'error') return { status: 'error' }
  if (state === 'empty') return { status: 'ready', managers: successManagers.map((manager) => ({ ...manager, nextOpening: '2026-10-14' })) }
  return { status: 'ready', managers: successManagers }
}

const profile = { country: autoApplySetup.country, desiredRole: autoApplySetup.desiredRole, locations: autoApplySetup.locations }
const savedCard = { label: 'Mastercard •••• 4242', expiryLabel: '08/29' }

/** Billing entry: every success manager and what they charge. */
export function BillingDoneForYouPage() {
  const [params, setParams] = useSearchParams()
  return (
    <DoneForYouView
      homeHref="/v3/app"
      parent={{ href: '/v3/billing', label: 'Billing & subscription' }}
      setupHref="/v3/auto-apply/contact"
      profile={profile}
      savedCard={savedCard}
      directory={readDirectory(params.get('state'))}
      onRetry={() => setParams({})}
    />
  )
}
