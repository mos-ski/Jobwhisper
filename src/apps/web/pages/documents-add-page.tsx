import { DocumentsAddView } from '@/features/documents/documents-view'
import { authPlanFixtures, billingSnapshot } from '@/mocks/billing'
import { contextDocumentRows, knowledgeBaseLimitByPlan } from '@/mocks/documents'

export function DocumentsAddPage() {
  const plan = billingSnapshot.status === 'ready' ? billingSnapshot.plan : 'starter'
  const planName = authPlanFixtures.find((fixture) => fixture.id === plan)?.name ?? plan

  return (
    <DocumentsAddView
      homeHref="/v3/app"
      documentsHref="/v3/documents"
      manualHref="/v3/documents/manual"
      documentCount={contextDocumentRows.length}
      limit={knowledgeBaseLimitByPlan[plan]}
      planName={planName}
    />
  )
}
