export type InterviewType = 'Recruiter Screen' | 'Hiring Manager' | 'Technical' | 'Culture Fit' | 'Final Round'
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert'
export type PrepView = 'gallery' | 'configure' | 'preparing' | 'studio' | 'processing' | 'report'

export interface InterviewerPersona {
  id: string
  name: string
  role: string
  company: string
  voice: string
  tone: string
  accentColor: string
  initials: string
  imageUrl: string
  tags: string[]
}

export interface InterviewScenario {
  id: string
  title: string
  type: InterviewType
  company: string
  targetRole: string
  difficulty: Difficulty
  durationMinutes: number
  interviewerId: string
  interviewerRole?: string
  summary: string
  context: string
}

export interface InterviewTranscriptTurn {
  id: string
  speaker: 'interviewer' | 'user'
  speakerName: string
  time: string
  text: string
}

export interface InterviewQuestion {
  id: string
  text: string
  focus: string
}

export interface InterviewAnswer {
  question: InterviewQuestion
  answer: string
}

export interface InterviewRubricItem {
  element: string
  status: 'Strong' | 'Partial' | 'Needs work'
  notes: string
}

export interface InterviewReport {
  score: number
  summary: string
  whatWentWell: string[]
  whatNeedsWork: string[]
  knowledgeGaps: string[]
  suggestedQuestions: string[]
  rubric: InterviewRubricItem[]
  talkTime: {
    user: number
    interviewer: number
  }
  transcript: InterviewTranscriptTurn[]
}

export interface InterviewSession {
  id: string
  scenario: InterviewScenario
  interviewer: InterviewerPersona
  startedAtLabel: string
  durationLabel: string
  report: InterviewReport
}
