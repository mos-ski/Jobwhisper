import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Play, X } from 'lucide-react'
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

  // A React onClick, not a native addEventListener: the resume picker (and other dialogs
  // the embedded views open) render through a Portal straight to document.body, so they're
  // outside this wrapper's DOM subtree — a native listener bound to a ref never sees clicks
  // inside them. React's synthetic event system bubbles portaled content through the
  // component tree regardless of DOM placement, so a plain onClick here still catches it.
  function handleClick(e: ReactMouseEvent<HTMLDivElement>) {
    const link = (e.target as Element).closest<HTMLAnchorElement>('a[href]')
    if (!link) return
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

  return <div onClick={handleClick}>{children}</div>
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
              demoMode
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

// The demo embeds real product screens that navigate with both <a href> and imperative
// useNavigate() calls. It needs a real <MemoryRouter> for both to work — but the landing
// page already lives inside the app's own <BrowserRouter>, and react-router throws if a
// second <Router> mounts anywhere in the same component tree (portals don't help: a portal
// changes DOM placement, not React context, so an ancestor Router is still found). Mounting
// a fully separate React root breaks that tree connection entirely, so the MemoryRouter here
// is genuinely isolated — this is not just DOM placement, it's a second render tree.
function DemoRootMount({ runKey, onClose }: { readonly runKey: number; readonly onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<Root | null>(null)

  // React 18 StrictMode replays a component's mount as mount → cleanup → mount, synchronously,
  // purely to surface bugs like this one (dev only). Guarding root creation with a ref wasn't
  // enough on its own: the replay's cleanup unmounted the root while its render was still
  // committing, and the second createRoot on the same node never recovered a visible tree.
  // Deferring the actual create+render past the current synchronous pass (via setTimeout 0)
  // fixes it structurally — the replay's own cleanup cancels the pending timer before it ever
  // fires, so the fake mount never touches the DOM at all, and only the real, final mount's
  // timer creates a root — with no unmount left to race it.
  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const timer = window.setTimeout(() => {
      if (!rootRef.current) {
        rootRef.current = createRoot(node)
      }
      // key={runKey}: re-rendering an already-mounted MemoryRouter with the same
      // initialEntries does NOT reset it — it keeps its own internal history state. The
      // key forces React to discard and remount the subtree (within this same root) on
      // restart, which is what actually resets the walkthrough back to /upload.
      rootRef.current.render(
        <MemoryRouter key={runKey} initialEntries={['/upload']}>
          <DemoRoutes onClose={onClose} />
        </MemoryRouter>,
      )
    }, 0)
    return () => window.clearTimeout(timer)
  }, [runKey, onClose])

  useEffect(() => {
    return () => {
      rootRef.current?.unmount()
      rootRef.current = null
    }
  }, [])

  return <div ref={containerRef} className="h-full" />
}

function DemoSignupPanel({ email, onEmailChange, onRestart }: { readonly email: string; readonly onEmailChange: (value: string) => void; readonly onRestart: () => void }) {
  return (
    <div className="flex w-full shrink-0 flex-col justify-center gap-6 border-t border-border bg-canvas p-6 sm:p-8 lg:w-[30%] lg:border-l lg:border-t-0">
      <div>
        <h2 className="text-xl font-semibold text-ink">See Jobwhisper in action</h2>
        <p className="mt-2 text-sm text-ink-muted">Walk through it yourself — tailor a resume, share your screen, and see the AI respond live.</p>
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="demo-email" className="text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="demo-email"
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="you@company.com"
          className="min-h-11 rounded-lg border border-input bg-surface px-3 py-2.5 text-sm text-ink shadow-control outline-none focus:border-focus focus:ring-2 focus:ring-focus"
        />
      </div>
      <button
        type="button"
        onClick={onRestart}
        className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover"
      >
        <Play aria-hidden="true" className="size-4" fill="currentColor" />
        Start Demo
      </button>
      <p className="text-xs text-ink-muted">
        By continuing, you agree to our <a href="#" className="underline underline-offset-2 hover:text-ink">Privacy Policy</a>.
      </p>
    </div>
  )
}

function DemoModalContent({ onClose }: { readonly onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [runKey, setRunKey] = useState(0)

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
    // z-[35]: between the design system's z-sticky (30) and z-modal (40) tokens — the demo
    // is a full-page takeover, but the interactive product it embeds can open its own real
    // dialogs (e.g. the resume picker), which use z-modal and must render above this.
    <div className="fixed inset-0 z-[35]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div className="absolute inset-4 flex flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl sm:inset-8 lg:inset-12 lg:flex-row">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close demo"
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
        <div className="relative flex-1 overflow-y-auto bg-white lg:w-[70%] lg:flex-none">
          <DemoRootMount runKey={runKey} onClose={onClose} />
        </div>
        <DemoSignupPanel email={email} onEmailChange={setEmail} onRestart={() => setRunKey((prev) => prev + 1)} />
      </div>
    </div>
  )
}

export function DemoModal({ open, onClose }: { readonly open: boolean; readonly onClose: () => void }) {
  if (!open) return null
  return createPortal(<DemoModalContent onClose={onClose} />, document.body)
}
