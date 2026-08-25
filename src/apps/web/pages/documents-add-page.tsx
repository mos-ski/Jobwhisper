import { DocumentsAddView } from '@/features/documents/documents-view'

export function DocumentsAddPage() {
  return (
    <DocumentsAddView
      homeHref="/v3/app"
      documentsHref="/v3/documents"
      manualHref="/v3/documents/manual"
    />
  )
}
