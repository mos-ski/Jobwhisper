export interface ContextSource {
  id: string
  name: string
  type: string
}

export const MOCK_CONTEXT_SOURCES: ContextSource[] = [
  { id: '1', name: 'Darnell_Smith_Resume.pdf', type: 'PDF' },
  { id: '2', name: 'github.com/darnellsmith', type: 'GitHub' },
  { id: '3', name: 'linkedin.com/in/darnellsmith', type: 'LinkedIn' },
  { id: '4', name: 'Interview Prep Notes', type: 'Note' },
  { id: '5', name: 'Cover_Letter_Template.docx', type: 'DOCX' },
]
