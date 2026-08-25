import { InterviewVoiceView } from '@/features/interview/interview-prep-view'
import { interviewerVoices } from '@/mocks/interview'

export function InterviewVoicePage() {
  return (
    <InterviewVoiceView
      homeHref="/v3/app"
      configureHref="/v3/interview-prep/configure"
      sessionHref="/v3/interview-prep/session"
      voices={interviewerVoices}
    />
  )
}
