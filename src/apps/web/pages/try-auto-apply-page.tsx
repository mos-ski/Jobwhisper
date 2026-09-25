import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import type { FunnelAnswers } from '@/contracts/funnel.draft'
import type { Session } from '@/contracts/identity'
import { FunnelAutoApplyView, type FunnelAutoApplyStep } from '@/features/funnel/funnel-auto-apply-view'
import { autoApplyFunnelMatches, autoApplyFunnelQuestions } from '@/mocks/funnel'
import { anonymousSession, candidateSession } from '@/mocks/sessions'
import { resumeUploadError, useOnline } from '../funnel-page-state'

const STEPS: readonly FunnelAutoApplyStep[] = ['upload', 'quiz', 'working', 'matches', 'gate']
// Review-only switches, carried through every step so a reviewer can walk a whole variant.
const REVIEW_PARAMS = ['session', 'offline', 'matches'] as const
const LAST_QUESTION = autoApplyFunnelQuestions.length - 1

function parseStep(value: string | null): FunnelAutoApplyStep {
  return STEPS.find((step) => step === value) ?? 'upload'
}

export function TryAutoApplyPage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const step = parseStep(params.get('step'))
  const questionIndex = Math.min(Math.max(Number(params.get('q') ?? 0) || 0, 0), LAST_QUESTION)
  const online = useOnline(params.get('offline') === '1')
  const matches = params.get('matches') === 'none' ? [] : autoApplyFunnelMatches

  const [fileName, setFileName] = useState<string | undefined>()
  const [uploadError, setUploadError] = useState<string | undefined>()
  const [answers, setAnswers] = useState<FunnelAnswers>({})
  const [session] = useState<Session>(() => (params.get('session') === 'signed-in' ? candidateSession : anonymousSession))

  function go(next: FunnelAutoApplyStep, extra: Readonly<Record<string, string>> = {}, replace = false) {
    const search = new URLSearchParams()
    for (const key of REVIEW_PARAMS) {
      const value = params.get(key)
      if (value) search.set(key, value)
    }
    search.set('step', next)
    for (const [key, value] of Object.entries(extra)) search.set(key, value)
    setParams(search, { replace })
  }

  useEffect(() => {
    if (step !== 'working') return
    // Replaced rather than pushed, so Back from the matches returns to the last question.
    const timer = window.setTimeout(() => go('matches', {}, true), 1800)
    return () => window.clearTimeout(timer)
  }, [step])

  function apply(target: string) {
    // Signed-in visitors skip the gate; the real flow picks their answers up from the account.
    if (session.status === 'authenticated') return navigate('/v3/auto-apply/review')
    go('gate', { apply: target })
  }

  return (
    <FunnelAutoApplyView
      step={step}
      questions={autoApplyFunnelQuestions}
      questionIndex={questionIndex}
      answers={answers}
      fileName={fileName}
      uploadError={uploadError}
      online={online}
      matches={matches}
      selectedJobId={params.get('job') ?? undefined}
      applyTarget={params.get('apply') ?? undefined}
      onFile={(file) => {
        const error = resumeUploadError(file)
        setUploadError(error)
        setFileName(error ? undefined : file.name)
      }}
      onAnswer={(id, value) => setAnswers((previous) => ({ ...previous, [id]: value }))}
      onBack={() => {
        if (step === 'upload') return navigate('/')
        if (questionIndex === 0) return go('upload')
        go('quiz', { q: String(questionIndex - 1) })
      }}
      onContinue={() => {
        if (step === 'upload') return go('quiz', { q: '0' })
        if (questionIndex < LAST_QUESTION) return go('quiz', { q: String(questionIndex + 1) })
        go('working')
      }}
      onClose={() => navigate('/')}
      onSelectJob={(jobId) => go('matches', jobId ? { job: jobId } : {})}
      onApply={apply}
      onEditAnswer={(questionId) => {
        const index = autoApplyFunnelQuestions.findIndex((question) => question.id === questionId)
        go('quiz', { q: String(Math.max(index, 0)) })
      }}
      onCreateAccount={() => navigate('/v3/auto-apply/review')}
      onGoogleSignUp={() => navigate('/v3/auto-apply/review')}
    />
  )
}
