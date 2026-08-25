export type ContextDocumentKind = 'PDF' | 'URL' | 'DOCX'

export type ContextDocumentRow = {
  readonly id: string
  readonly name: string
  readonly kind: ContextDocumentKind
  readonly sizeOrUrl: string
  readonly addedAtLabel: string
}
