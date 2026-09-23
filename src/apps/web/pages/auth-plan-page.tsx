import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { Plan } from '@/contracts/billing'
import { PlanSelectionView } from '@/features/billing/plan-selection-view'
import { authPlanFixtures } from '@/mocks/billing'

export function AuthPlanPage() {
  const navigate = useNavigate()
  const [selectedPlanId, setSelectedPlanId] = useState<Plan>('pro')

  const selectPlan = (plan: Plan) => {
    setSelectedPlanId(plan)
    navigate('/v3/onboarding/profile')
  }

  return (
    <PlanSelectionView
      plans={authPlanFixtures}
      selectedPlanId={selectedPlanId}
      laterHref="/v3"
      onSelectPlan={selectPlan}
    />
  )
}
