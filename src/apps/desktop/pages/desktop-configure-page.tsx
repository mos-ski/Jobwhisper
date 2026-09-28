import { useNavigate, useSearchParams } from 'react-router-dom'

import type { DesktopSessionKind } from '@/contracts/desktop.draft'
import { DesktopConfigureView } from '@/features/desktop/desktop-configure-view'
import { desktopKnowledgeBase, desktopRoles, desktopSuggestedContext } from '@/mocks/desktop'
import { resumeDocument } from '@/mocks/resume'

export function readDesktopKind(value: string | null): DesktopSessionKind {
  return value === 'coding' || value === 'meeting' ? value : 'interview'
}

export function DesktopConfigurePage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const kind = readDesktopKind(params.get('kind'))
  return (
    <DesktopConfigureView
      key={kind}
      kind={kind}
      step={params.get('step') === '2' ? 2 : 1}
      onStepChange={(step) => {
        const next = new URLSearchParams(params)
        next.set('step', String(step))
        setParams(next)
      }}
      roles={desktopRoles}
      knowledgeBase={desktopKnowledgeBase}
      resume={{ name: 'Adedamola PM Resume Sept 26', document: resumeDocument }}
      suggestedContext={desktopSuggestedContext}
      models={['OpenAI (GPT 5.6 Sol)', 'Claude (Sonnet 5)', 'Gemini (3 Pro)']}
      languages={['English', 'French', 'Spanish', 'Portuguese', 'German']}
      onBack={() => navigate('/desktop/home')}
      onStart={(config) => navigate(`/desktop/session?kind=${config.kind}&title=${encodeURIComponent([config.role, config.company].filter(Boolean).join(' · '))}`)}
    />
  )
}
