import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ResumeUploadView } from '@/features/resume/resume-builder-view'
import { getDefaultResumePreference } from '@/lib/resume-preference'
import { resumeBuilderSession, resumeHistoryRows } from '@/mocks/resume'

export function ResumeUploadPage() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (getDefaultResumePreference()) {
      navigate('/v3/resume/configure', { replace: true })
      return
    }
    setReady(true)
  }, [navigate])

  if (!ready) return null

  return (
    <ResumeUploadView
      homeHref="/v3/app"
      configureHref="/v3/resume/configure"
      historyHref="/v3/resume/history"
      uploadedFileName={resumeBuilderSession.uploadedFileName}
      uploadedFileUrl={resumeBuilderSession.uploadedFileUrl}
      savedResumes={resumeHistoryRows}
    />
  )
}
