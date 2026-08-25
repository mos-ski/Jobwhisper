import { DocumentsManualView } from '@/features/documents/documents-view'

export function DocumentsManualPage() {
  return (
    <DocumentsManualView
      homeHref="/v3/app"
      backHref="/v3/documents/add"
      nextHref="/v3/documents"
    />
  )
}
