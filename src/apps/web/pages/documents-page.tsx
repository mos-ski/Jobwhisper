import { DocumentsView } from '@/features/documents/documents-view'
import { contextDocumentRows } from '@/mocks/documents'

export function DocumentsPage() {
  return <DocumentsView homeHref="/v3/app" addHref="/v3/documents/add" rows={contextDocumentRows} />
}
