import { useNavigate, useSearchParams } from 'react-router-dom'

import type { SuccessManagerDirectory } from '@/contracts/done-for-you.draft'
import { DoneForYouView } from '@/features/billing/done-for-you-view'
import { autoApplySetup } from '@/mocks/auto-apply'
import { doneForYouEngagement, successManagers } from '@/mocks/done-for-you'

function readDirectory(state: string | null): SuccessManagerDirectory {
  if (state === 'loading') return { status: 'loading' }
  if (state === 'error') return { status: 'error' }
  return { status: 'ready', managers: successManagers }
}

/** Dashboard entry: the subscriber's own package, manager and applications. */
export function DoneForYouPage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  return (
    <DoneForYouView
      homeHref="/v3/app"
      parent={{ href: '/v3/app', label: 'Dashboard' }}
      setupHref="/v3/auto-apply/contact"
      profile={{ country: autoApplySetup.country, desiredRole: autoApplySetup.desiredRole, locations: autoApplySetup.locations }}
      savedCard={{ label: 'Mastercard •••• 4242', expiryLabel: '08/29' }}
      directory={readDirectory(params.get('state'))}
      engagement={doneForYouEngagement}
      onMessageManager={() => navigate('/v3/support')}
      onRetry={() => setParams({})}
    />
  )
}
