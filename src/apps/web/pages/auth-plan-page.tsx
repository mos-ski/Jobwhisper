import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { Plan } from '@/contracts/billing'
import { PlanSelectionView, type BillingCadence } from '@/features/billing/plan-selection-view'
import { authPlanFixtures } from '@/mocks/billing'

export function AuthPlanPage() {
  const navigate = useNavigate()
  const [cadence, setCadence] = useState<BillingCadence>('annual')
  const [selectedPlanId, setSelectedPlanId] = useState<Plan>('pro')

  const selectPlan = (plan: Plan) => {
    setSelectedPlanId(plan)
    navigate('/v3/onboarding/profile')
  }

  return (
    <PlanSelectionView
      cadence={cadence}
      plans={authPlanFixtures}
      selectedPlanId={selectedPlanId}
      laterHref="/v3"
      onToggleCadence={() => setCadence((current) => (current === 'monthly' ? 'annual' : 'monthly'))}
      onSelectPlan={selectPlan}
    />
  )
}
