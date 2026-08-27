import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom'
import {
  CopilotUploadView,
  CopilotConfigureView,
  CopilotPermissionView,
  CopilotLiveView,
  CopilotReportView,
} from '@/features/copilot/interview-copilot-view'
import {
  copilotInterviewTranscript,
  copilotLiveSession,
  copilotReport,
  copilotSetup,
  copilotShareSteps,
} from '@/mocks/copilot'
import { resumeHistoryRows } from '@/mocks/resume'

function DemoLinkInterceptor({
  onClose,
  children,
}: {
  readonly onClose: () => void
  readonly children: React.ReactNode
}) {
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    function handleClick(e: MouseEvent) {
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href]')
      if (!link || !el!.contains(link)) return
      const href = link.getAttribute('href') ?? ''
      e.preventDefault()
      if (!href || href === '/' || href === '#') {
        onClose()
      } else if (href.startsWith('/v3') || href.startsWith('http')) {
        // ignore out-of-demo links
      } else {
        navigate(href)
      }
    }
    el.addEventListener('click', handleClick, true)
    return () => el.removeEventListener('click', handleClick, true)
  }, [navigate, onClose])

  return <div ref={ref}>{children}</div>
}

function DemoRoutes({ onClose }: { readonly onClose: () => void }) {
  return (
    <DemoLinkInterceptor onClose={onClose}>
      <Routes>
        <Route
          path="/upload"
          element={
            <CopilotUploadView
              homeHref="/"
              configureHref="/configure"
              historyHref="/"
              mode="interview"
              uploadedFileName={copilotSetup.uploadedFileName}
              savedResumes={resumeHistoryRows}
            />
          }
        />
        <Route
          path="/configure"
          element={
            <CopilotConfigureView
              homeHref="/"
              uploadHref="/upload"
              preferencesHref="/share"
              setup={copilotSetup}
              knowledgeBaseDocuments={[]}
            />
          }
        />
        <Route
          path="/share"
          element={
            <CopilotPermissionView
              homeHref="/"
              backHref="/configure"
              nextHref="/live"
              steps={copilotShareSteps}
              actionLabel="Start Interview"
              mode="interview"
            />
          }
        />
        <Route
          path="/live"
          element={
            <CopilotLiveView
              completeHref="/report"
              session={copilotLiveSession}
              transcriptBank={copilotInterviewTranscript}
            />
          }
        />
        <Route
          path="/report"
          element={
            <CopilotReportView
              homeHref="/"
              historyHref="/"
              report={copilotReport}
              mode="interview"
            />
          }
        />
      </Routes>
    </DemoLinkInterceptor>
  )
}

function DemoModalContent({ onClose }: { readonly onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto" role="dialog" aria-modal="true">
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[210] -translate-x-1/2">
        <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white/60 backdrop-blur-sm">
          Interactive Demo
        </span>
      </div>
      <MemoryRouter initialEntries={['/upload']}>
        <DemoRoutes onClose={onClose} />
      </MemoryRouter>
    </div>
  )
}

export function DemoModal({ open, onClose }: { readonly open: boolean; readonly onClose: () => void }) {
  if (!open) return null
  return createPortal(<DemoModalContent onClose={onClose} />, document.body)
}
