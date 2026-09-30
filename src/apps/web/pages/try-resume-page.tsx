import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import type { Session } from '@/contracts/identity'
import { FunnelResumeView, type FunnelResumeStep, type ResumeFunnelActivity } from '@/features/funnel/funnel-resume-view'
import { resumeFunnelReport, resumeFunnelRewrite } from '@/mocks/funnel'
import { anonymousSession, candidateSession } from '@/mocks/sessions'
import { resumeUploadError, useOnline } from '../funnel-page-state'

const STEPS: readonly FunnelResumeStep[] = ['upload', 'score', 'compare', 'gate', 'done']
// Review-only switches, carried through every step so a reviewer can walk a whole variant.
const REVIEW_PARAMS = ['session', 'offline'] as const

const RESUME_ACTIVITY: readonly ResumeFunnelActivity[] = [
  { id: 'jason-bake', name: 'Jason Bake', countryFlag: '🇺🇸', score: 57, timeLabel: 'Just now' },
  { id: 'amara-okafor', name: 'Amara Okafor', countryFlag: '🇳🇬', score: 81, timeLabel: 'Just now' },
  { id: 'sophie-martin', name: 'Sophie Martin', countryFlag: '🇫🇷', score: 74, timeLabel: 'Just now' },
  { id: 'kwame-mensah', name: 'Kwame Mensah', countryFlag: '🇬🇭', score: 69, timeLabel: 'Just now' },
  { id: 'daniel-kim', name: 'Daniel Kim', countryFlag: '🇰🇷', score: 88, timeLabel: 'Just now' },
  { id: 'priya-shah', name: 'Priya Shah', countryFlag: '🇮🇳', score: 76, timeLabel: 'Just now' },
]

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
  const [activityIndex, setActivityIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const interval = window.setInterval(() => {
      setActivityIndex((current) => (current + 1) % RESUME_ACTIVITY.length)
    }, 4200)
    return () => window.clearInterval(interval)
  }, [])

  function go(next: FunnelResumeStep, replace = false) {
    const search = new URLSearchParams()
    for (const key of REVIEW_PARAMS) {
      const value = params.get(key)
      if (value) search.set(key, value)
    }
    search.set('step', next)
    setParams(search, { replace })
  }

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
      liveActivity={RESUME_ACTIVITY[activityIndex]}
      onFile={(file) => {
        const error = resumeUploadError(file)
        setUploadError(error)
        setFileName(error ? undefined : file.name)
      }}
      onAnalyze={() => go('score')}
      onJobDescriptionChange={setJobDescription}
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
