import { MOCK_CONTEXT_SOURCES } from '@/lib/mockContextSources'

export interface ContextDoc {
  id: string
  name: string
  type: string
}

const PERSONAL_CONTEXT_DOCS: ContextDoc[] = MOCK_CONTEXT_SOURCES.map(s => ({ id: s.id, name: s.name, type: s.type }))

export function resolveContextDocs(_email: string): ContextDoc[] {
  return PERSONAL_CONTEXT_DOCS
}
