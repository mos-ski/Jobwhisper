import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import type { FunnelAnswers, FunnelCardStatus } from '@/contracts/funnel.draft'
import type { Session } from '@/contracts/identity'
import { FunnelCreditsView, type FunnelCreditsStep } from '@/features/funnel/funnel-credits-view'
import { creditsFunnelOffer, creditsFunnelQuestions } from '@/mocks/funnel'
import { anonymousSession, candidateSession } from '@/mocks/sessions'

const STEPS: readonly FunnelCreditsStep[] = ['quiz', 'working', 'reward', 'account', 'card', 'done']
// Review-only switches, carried through every step so a reviewer can walk a whole variant.
const REVIEW_PARAMS = ['session', 'offline', 'card'] as const

function parseStep(value: string | null): FunnelCreditsStep {
  return STEPS.find((step) => step === value) ?? 'quiz'
}

function resumeNameFrom(state: unknown): string | undefined {
  if (typeof state === 'object' && state !== null && 'resumeName' in state && typeof state.resumeName === 'string') return state.resumeName
  return undefined
}

export function TryCreditsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const step = parseStep(params.get('step'))
  const questionIndex = Math.min(Math.max(Number(params.get('q') ?? 0) || 0, 0), creditsFunnelQuestions.length - 1)
  const declines = params.get('card') === 'declined'

  // Search-param navigation drops router state, so the handed-over file name is read once.
  const [resumeName] = useState(() => resumeNameFrom(location.state))
  const [answers, setAnswers] = useState<FunnelAnswers>({})
  const [session, setSession] = useState<Session>(() => (params.get('session') === 'signed-in' ? candidateSession : anonymousSession))
  const [cardStatus, setCardStatus] = useState<FunnelCardStatus>(() => (declines && step === 'card' ? 'declined' : 'idle'))
  const [networkOnline, setNetworkOnline] = useState(() => navigator.onLine)
  const online = networkOnline && params.get('offline') !== '1'

  function go(next: FunnelCreditsStep, nextQuestion = 0, replace = false) {
    const search = new URLSearchParams()
    for (const key of REVIEW_PARAMS) {
      const value = params.get(key)
      if (value) search.set(key, value)
    }
    search.set('step', next)
    if (next === 'quiz') search.set('q', String(nextQuestion))
    setParams(search, { replace })
  }

  useEffect(() => {
    const up = () => setNetworkOnline(true)
    const down = () => setNetworkOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])

  useEffect(() => {
    if (step !== 'working') return
    // Replaced rather than pushed, so Back from the reward returns to the quiz, not to a spinner.
    const timer = window.setTimeout(() => go('reward', 0, true), 1400)
    return () => window.clearTimeout(timer)
  }, [step])

  useEffect(() => {
    if (cardStatus !== 'processing') return
    const timer = window.setTimeout(() => {
      if (declines) {
        setCardStatus('declined')
        return
      }
      setCardStatus('idle')
      go('done')
    }, 1200)
    return () => window.clearTimeout(timer)
  }, [cardStatus])

  return (
    <FunnelCreditsView
      step={step}
      questions={creditsFunnelQuestions}
      questionIndex={questionIndex}
      answers={answers}
      offer={creditsFunnelOffer}
      session={session}
      online={online}
      cardStatus={cardStatus}
      cardError={cardStatus === 'declined' ? 'Your bank declined this card. Try another card, or ask your bank to allow the payment.' : undefined}
      resumeName={resumeName}
      onAnswer={(id, value) => setAnswers((previous) => ({ ...previous, [id]: value }))}
      onBack={() => (questionIndex > 0 ? go('quiz', questionIndex - 1) : navigate('/'))}
      onContinue={() => (questionIndex < creditsFunnelQuestions.length - 1 ? go('quiz', questionIndex + 1) : go('working'))}
      onClose={() => navigate('/')}
      onClaim={() => go(session.status === 'authenticated' ? 'card' : 'account')}
      onCreateAccount={() => {
        setSession(candidateSession)
        go('card')
      }}
      onGoogleSignUp={() => {
        setSession(candidateSession)
        go('card')
      }}
      onSubmitCard={() => setCardStatus('processing')}
      onStart={() => navigate('/v3/app')}
    />
  )
}
