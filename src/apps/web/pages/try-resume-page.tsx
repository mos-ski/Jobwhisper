import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import type { Session } from '@/contracts/identity'
import { FunnelResumeView, type FunnelResumeStep } from '@/features/funnel/funnel-resume-view'
import { resumeFunnelReport, resumeFunnelRewrite } from '@/mocks/funnel'
import { anonymousSession, candidateSession } from '@/mocks/sessions'
import { resumeUploadError, useOnline } from '../funnel-page-state'

const STEPS: readonly FunnelResumeStep[] = ['upload', 'working', 'score', 'compare', 'gate', 'done']
// Review-only switches, carried through every step so a reviewer can walk a whole variant.
const REVIEW_PARAMS = ['session', 'offline'] as const

function parseStep(value: string | null): FunnelResumeStep {
  return STEPS.find((step) => step === value) ?? 'upload'
}

export function TryResumePage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const step = parseStep(params.get('step'))
  const online = useOnline(params.get('offline') === '1')

  const [fileName, setFileName] = useState<string | undefined>()
  const [uploadError, setUploadError] = useState<string | undefined>(() =>
    params.get('upload') === 'error' ? 'That file type is not supported. Upload a PDF, DOC, DOCX or TXT file.' : undefined,
  )
  const [jobDescription, setJobDescription] = useState('')
  const [session, setSession] = useState<Session>(() => (params.get('session') === 'signed-in' ? candidateSession : anonymousSession))

  function go(next: FunnelResumeStep, replace = false) {
    const search = new URLSearchParams()
    for (const key of REVIEW_PARAMS) {
      const value = params.get(key)
      if (value) search.set(key, value)
    }
    search.set('step', next)
    setParams(search, { replace })
  }

  useEffect(() => {
    if (step !== 'working') return
    // Replaced rather than pushed, so Back from the score returns to the upload, not to a spinner.
    const timer = window.setTimeout(() => go('score', true), 1600)
    return () => window.clearTimeout(timer)
  }, [step])

  function signedUp() {
    setSession(candidateSession)
    go('done')
  }

  return (
    <FunnelResumeView
      step={step}
      fileName={fileName}
      uploadError={uploadError}
      jobDescription={jobDescription}
      online={online}
      report={resumeFunnelReport}
      rewrite={resumeFunnelRewrite}
      onFile={(file) => {
        const error = resumeUploadError(file)
        setUploadError(error)
        setFileName(error ? undefined : file.name)
      }}
      onJobDescriptionChange={setJobDescription}
      onScore={() => go('working')}
      onBack={() => navigate('/')}
      onClose={() => navigate('/')}
      onShowRewrite={() => go('compare')}
      onDownload={() => go(session.status === 'authenticated' ? 'done' : 'gate')}
      onCreateAccount={signedUp}
      onGoogleSignUp={signedUp}
      onOpenEditor={() => navigate('/v3/resume/editor')}
    />
  )
}
