import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AutoApplyUploadView } from '@/features/auto-apply/auto-apply-view'
import { getDefaultResumePreference } from '@/lib/resume-preference'
import { autoApplySetup } from '@/mocks/auto-apply'
import { resumeHistoryRows } from '@/mocks/resume'

export function AutoApplyUploadPage() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (getDefaultResumePreference()) {
      navigate('/v3/auto-apply/contact', { replace: true })
      return
    }
    setReady(true)
  }, [navigate])

  if (!ready) return null

  return (
    <AutoApplyUploadView
      homeHref="/v3/app"
      contactHref="/v3/auto-apply/contact"
      agentHref="/v3/auto-apply/agent"
      uploadedFileName={autoApplySetup.uploadedFileName}
      savedResumes={resumeHistoryRows}
    />
  )
}
