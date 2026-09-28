import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { DesktopCompleteView } from '@/features/desktop/desktop-complete-view'

import { readDesktopKind } from './desktop-configure-page'

export function DesktopCompletePage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  return <DesktopCompleteView kind={readDesktopKind(params.get('kind'))} feedback={feedback} onFeedback={setFeedback} onHome={() => navigate('/desktop/home')} />
}
