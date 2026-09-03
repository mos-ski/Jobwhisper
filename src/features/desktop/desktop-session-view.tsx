import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Settings } from 'lucide-react'

import { CopilotTranscriptPanel } from '@/features/copilot/interview-copilot-view'
import { copilotInterviewTranscript, copilotLiveSession } from '@/mocks/copilot'
import { Button, Checkbox, Dialog, DialogClose, DialogPopup, DialogTitle, ThemeSwitch } from '@/ui'

function formatElapsed(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export function DesktopSessionView() {
  const navigate = useNavigate()
  const [seconds, setSeconds] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activityLabel, setActivityLabel] = useState(copilotLiveSession.activityLabel)
  const [meetingDetect, setMeetingDetect] = useState(false)

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((prev) => prev + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="flex h-full min-h-[520px] flex-col bg-live-workspace text-white">
      <header className="flex min-h-[57px] shrink-0 items-center justify-between border-b border-white/10 bg-live-header px-5 py-3">
        <div className="flex items-center gap-3">
          <ArrowLeft aria-hidden="true" className="size-4 text-white/60" />
          <h1 className="truncate text-sm font-medium leading-5">{copilotLiveSession.title}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <span className="text-sm font-medium leading-5 text-slate-300">{formatElapsed(seconds)}</span>
          <button
            type="button"
            onClick={() => navigate('/desktop/complete')}
            className="inline-flex min-h-[30px] items-center rounded-lg bg-[#ef4444] px-4 text-sm font-semibold text-white"
          >
            End Session
          </button>
        </div>
      </header>

      <div className="flex min-h-9 shrink-0 items-center justify-between bg-live-strip px-5">
        <div className="flex items-center gap-4">
          <span className="flex items-end gap-[3px]" aria-label={copilotLiveSession.signalLabel}>
            <span className="h-[5px] w-[3px] rounded bg-[#4ade80]" />
            <span className="h-2 w-[3px] rounded bg-[#4ade80]" />
            <span className="h-[11px] w-[3px] rounded bg-[#4ade80]" />
            <span className="h-3.5 w-[3px] rounded bg-[#4ade80]" />
          </span>
          <span className="text-sm font-medium leading-5 text-[#4ade80]">{copilotLiveSession.signalLabel}</span>
          <span className="text-sm italic leading-5 text-slate-400">{activityLabel}</span>
        </div>
        <button type="button" onClick={() => setSettingsOpen(true)} className="flex items-center gap-3 text-sm font-medium text-white">
          <Settings aria-hidden="true" className="size-4" />
          Settings
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-hidden p-3">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#1e2d45] bg-[#0d1929]">
          <div className="flex min-h-[57px] items-center justify-between border-b border-[#1e2d45] px-4 py-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold leading-5">
              Live Response
              <span className="size-2 rounded-full bg-[#ef4444]" />
            </span>
          </div>
          <CopilotTranscriptPanel
            bank={copilotInterviewTranscript}
            responseMode="manual"
            fontSize={14}
            onActivityChange={setActivityLabel}
            manualHint="Press Space to start the simulation…"
          />
        </div>
      </div>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogPopup aria-label="Session settings" className="sm:max-w-sm">
          <DialogClose />
          <DialogTitle>Settings</DialogTitle>
          <div className="mt-4 grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">Theme</span>
              <ThemeSwitch size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">Microphone</span>
              <span className="text-xs text-ink-muted">System Default</span>
            </div>
            <div className="border-t border-border pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Window</p>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-ink">Meeting Detect</p>
                  <p className="text-xs text-ink-muted">Notify me when a meeting app is active</p>
                </div>
                <Checkbox checked={meetingDetect} onCheckedChange={(checked) => setMeetingDetect(Boolean(checked))} aria-label="Toggle Meeting Detect" />
              </div>
            </div>
            <Button variant="secondary" onClick={() => navigate('/desktop')}>
              Sign out
            </Button>
          </div>
        </DialogPopup>
      </Dialog>
    </div>
  )
}
