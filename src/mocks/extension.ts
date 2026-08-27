import type { ExtensionJobBoard } from '@/contracts/extension.draft'

export const extensionJobBoards: readonly ExtensionJobBoard[] = [
  { id: 'indeed', name: 'Indeed', state: 'start' },
  { id: 'glassdoor', name: 'Glassdoor', state: 'start' },
  { id: 'workable', name: 'Workable', state: 'connect' },
  { id: 'linkedin', name: 'LinkedIn', state: 'in-progress' },
]
