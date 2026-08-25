import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { InterviewUploadView } from '@/features/interview/interview-prep-view'
import { getDefaultResumePreference } from '@/lib/resume-preference'
import { interviewSession } from '@/mocks/interview'
import { resumeHistoryRows } from '@/mocks/resume'

export function InterviewUploadPage() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (getDefaultResumePreference()) {
      navigate('/v3/interview-prep/configure', { replace: true })
      return
    }
    setReady(true)
  }, [navigate])

  if (!ready) return null

  return (
    <InterviewUploadView
      homeHref="/v3/app"
      configureHref="/v3/interview-prep/configure"
      historyHref="/v3/interview-prep/history"
      uploadedFileName={interviewSession.uploadedFileName}
      savedResumes={resumeHistoryRows}
    />
  )
}
