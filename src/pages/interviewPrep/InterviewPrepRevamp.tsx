import { useCallback, useState } from 'react'
import { buildInterviewReport, createCustomScenario, getScenarioPersona, report, scenarios as presetScenarios } from './mockData'
import { InterviewAnswer, InterviewReport, InterviewScenario, PrepView } from './types'
import { PreparingScreen, ProcessingScreen, ReportScreen, ScenarioBuilder, ScenarioGallery, StudioScreen } from './components'

export default function InterviewPrepRevamp() {
  const [view, setView] = useState<PrepView>('gallery')
  const [selectedScenario, setSelectedScenario] = useState<InterviewScenario>(presetScenarios[0])
  const [sessionReport, setSessionReport] = useState<InterviewReport>(report)

  const openConfigure = useCallback((scenario: InterviewScenario) => {
    setSelectedScenario({ ...scenario })
    setView('configure')
  }, [])

  const createScenario = useCallback(() => {
    setSelectedScenario(createCustomScenario())
    setView('configure')
  }, [])

  const startInterview = useCallback(() => {
    setSessionReport(report)
    setView('preparing')
    window.setTimeout(() => setView('studio'), 800)
  }, [])

  const openReport = useCallback((scenario: InterviewScenario) => {
    setSelectedScenario({ ...scenario })
    setSessionReport(report)
    setView('report')
  }, [])

  const persona = getScenarioPersona(selectedScenario)

  const finishInterview = useCallback((answers: InterviewAnswer[]) => {
    setSessionReport(buildInterviewReport(selectedScenario, persona, answers))
    setView('processing')
  }, [persona, selectedScenario])

  if (view === 'configure') {
    return (
      <ScenarioBuilder
        scenario={selectedScenario}
        onScenarioChange={setSelectedScenario}
        onBack={() => setView('gallery')}
        onStart={startInterview}
      />
    )
  }

  if (view === 'preparing') {
    return <PreparingScreen scenario={selectedScenario} />
  }

  if (view === 'studio') {
    return <StudioScreen scenario={selectedScenario} persona={persona} onEnd={finishInterview} />
  }

  if (view === 'processing') {
    return <ProcessingScreen onDone={() => setView('report')} />
  }

  if (view === 'report') {
    return (
      <ReportScreen
        scenario={selectedScenario}
        persona={persona}
        report={sessionReport}
        onBack={() => setView('gallery')}
        onRetry={() => setView('configure')}
      />
    )
  }

  return (
    <ScenarioGallery
      scenarios={presetScenarios}
      onCreate={createScenario}
      onConfigure={openConfigure}
      onOpenReport={openReport}
    />
  )
}
