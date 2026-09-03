import { DocumentsView } from '@/features/documents/documents-view'
import { authPlanFixtures, billingSnapshot } from '@/mocks/billing'
import { contextDocumentRows, knowledgeBaseLimitByPlan } from '@/mocks/documents'

export function DocumentsPage() {
  const plan = billingSnapshot.status === 'ready' ? billingSnapshot.plan : 'starter'
  const planName = authPlanFixtures.find((fixture) => fixture.id === plan)?.name ?? plan

  return (
    <DocumentsView
      homeHref="/v3/app"
      addHref="/v3/documents/add"
      rows={contextDocumentRows}
      limit={knowledgeBaseLimitByPlan[plan]}
      planName={planName}
    />
  )
}
