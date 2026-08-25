import { useNavigate, useParams } from 'react-router-dom'
import { CheckoutFlow } from './CheckoutFlow'
import { setAccount } from '@/pages/desktopCopilot/mockAccounts'
import { getPlan, type PlanId } from '@/pages/desktopCopilot/plans'
import { useAuth, DEMO_EMAIL } from '@/hooks/useAuth'

const VALID_PLAN_IDS: PlanId[] = ['starter', 'pro', 'premium']

export default function RegularCheckoutPage() {
  const { planId } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const { setPlan } = useAuth()
  const plan = getPlan(VALID_PLAN_IDS.includes(planId as PlanId) ? (planId as PlanId) : 'pro')

  return (
    <CheckoutFlow
      productLabel={`the ${plan.label} plan`}
      lineItems={[{ label: `${plan.label} Plan — monthly`, amount: `$${plan.monthlyPrice}/mo` }]}
      totalLabel={`$${plan.monthlyPrice}`}
      payButtonLabel={`Subscribe — $${plan.monthlyPrice}/mo`}
      onCancel={() => navigate('/')}
      onComplete={() => {
        // The web app and the desktop Copilot app share one mocked demo identity —
        // record the purchase against it (not the checkout form's own email) so
        // both surfaces immediately agree on which plan was just bought.
        setAccount(DEMO_EMAIL, { accountType: 'regular', planId: plan.id })
        setPlan(plan.id)
        navigate('/app')
      }}
    />
  )
}
