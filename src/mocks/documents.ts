import type { Plan } from '@/contracts/billing'
import type { ContextDocumentRow } from '@/contracts/documents.draft'

export const contextDocumentRows: readonly ContextDocumentRow[] = [
  { id: 'context-document-1', name: 'Darnell_Smith_Resume.pdf', kind: 'PDF', sizeOrUrl: '124 KB', addedAtLabel: 'August 13th 2026, 12:49 pm' },
  { id: 'context-document-2', name: 'Darnell_Smith_Portfolio_Case_Studies.pdf', kind: 'PDF', sizeOrUrl: '3.8 MB', addedAtLabel: 'August 10th 2026, 6:22 am' },
  { id: 'context-document-3', name: 'Coinbase - CX Automation Team Research.docx', kind: 'DOCX', sizeOrUrl: '58 KB', addedAtLabel: 'August 7th 2026, 2:15 pm' },
  { id: 'context-document-4', name: 'coinbase.com/careers/positions/8001275', kind: 'URL', sizeOrUrl: 'coinbase.com/careers/positions/8001275', addedAtLabel: 'August 6th 2026, 11:48 am' },
]

// How many Knowledge Base documents each tier can have uploaded at once — a flat storage
// ceiling, not credit-metered. See PRICING.md §1/§1.1.
export const knowledgeBaseLimitByPlan: Readonly<Record<Plan, number>> = {
  starter: 3,
  pro: 5,
  premium: 10,
}
