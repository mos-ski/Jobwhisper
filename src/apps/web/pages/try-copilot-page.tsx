import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { FunnelCopilotView, type CopilotInterviewStage, type FunnelCopilotDateOption, type FunnelCopilotStep } from '@/features/funnel/funnel-copilot-view'
import { resumeUploadError } from '../funnel-page-state'

const STEPS: readonly FunnelCopilotStep[] = ['landing', 'role', 'upload', 'stage', 'offer']

function parseStep(value: string | null): FunnelCopilotStep {
  return STEPS.find((step) => step === value) ?? 'landing'
}

function localDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function interviewWeek(today: Date): readonly FunnelCopilotDateOption[] {
  const sunday = new Date(today)
  sunday.setHours(12, 0, 0, 0)
  sunday.setDate(today.getDate() - today.getDay())
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sunday)
    date.setDate(sunday.getDate() + index)
    return {
      value: localDateValue(date),
      weekday: date.toLocaleDateString(undefined, { weekday: 'short' }),
      month: date.toLocaleDateString(undefined, { month: 'short' }),
      day: String(date.getDate()),
    }
  })
}

export function TryCopilotPage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [titles, setTitles] = useState<readonly string[]>(() => params.getAll('role').slice(0, 5))
  const [fileName, setFileName] = useState<string | undefined>()
  const [uploadError, setUploadError] = useState<string | undefined>()
  const [selectedStage, setSelectedStage] = useState<CopilotInterviewStage | undefined>()
  const [selectedDate, setSelectedDate] = useState(() => localDateValue(new Date()))
  const [dates] = useState(() => interviewWeek(new Date()))
  const step = parseStep(params.get('step'))

  function go(next: FunnelCopilotStep) {
    const search = new URLSearchParams({ step: next })
    titles.forEach((title) => search.append('role', title))
    setParams(search)
  }

  return <FunnelCopilotView
    step={step}
    titles={titles}
    fileName={fileName}
    uploadError={uploadError}
    selectedStage={selectedStage}
    dates={dates}
    selectedDate={selectedDate}
    onDateChange={setSelectedDate}
    onLandingContinue={() => go('role')}
    onTitlesChange={setTitles}
    onRoleContinue={() => go('upload')}
    onFile={(file) => {
      const error = resumeUploadError(file)
      setUploadError(error)
      setFileName(error ? undefined : file.name)
      if (!error) go('stage')
    }}
    onUploadContinue={() => go('stage')}
    onStageSelect={(stage) => { setSelectedStage(stage); go('offer') }}
    onStartTrial={() => navigate('/v3/interview-copilot')}
  />
}
