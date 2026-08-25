import { Video, Users, Code2, type LucideIcon } from 'lucide-react'

export type UseCaseId = 'interview' | 'meeting' | 'coding'
export type CanvasPattern = 'conversational' | 'screenshot-qa'
export type SetupFieldId =
  | 'position' | 'resume' | 'job-description'
  | 'context'
  | 'meeting-title' | 'agenda' | 'screen-share-note'
  | 'language'
  | 'audio-device'

export interface UseCaseConfig {
  id: UseCaseId
  label: string
  description: string
  icon: LucideIcon
  canvasPattern: CanvasPattern
  hasAnswerLength: boolean
  setupFields: SetupFieldId[]
  completeHeading: string
  completeBody: string
}

export const USE_CASES: UseCaseConfig[] = [
  {
    id: 'interview',
    label: 'Interview',
    description: 'Real-time answers during your job interview',
    icon: Video,
    canvasPattern: 'conversational',
    hasAnswerLength: true,
    setupFields: ['position', 'resume', 'job-description', 'audio-device'],
    completeHeading: '👏 Your Interview is complete!',
    completeBody: 'Thank you for completing your AI interview with Your Favorite Company.',
  },
  {
    id: 'meeting',
    label: 'Meeting',
    description: 'Live talking points, tracked by speaker',
    icon: Users,
    canvasPattern: 'conversational',
    hasAnswerLength: true,
    setupFields: ['meeting-title', 'agenda', 'screen-share-note', 'audio-device'],
    completeHeading: '📝 Your Meeting is complete!',
    completeBody: 'Your meeting notes have been saved.',
  },
  {
    id: 'coding',
    label: 'Coding',
    description: 'Code answers for technical interviews & tests',
    icon: Code2,
    canvasPattern: 'screenshot-qa',
    hasAnswerLength: false,
    setupFields: ['language'],
    completeHeading: '💻 Your Coding session is complete!',
    completeBody: 'Nice work — your session history is saved below.',
  },
]

export function getUseCase(id: UseCaseId): UseCaseConfig {
  const found = USE_CASES.find(u => u.id === id)
  if (!found) throw new Error(`Unknown use case: ${id}`)
  return found
}
