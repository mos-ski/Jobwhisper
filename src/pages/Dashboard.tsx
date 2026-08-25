import { useState } from 'react'
import { format } from 'date-fns'
import { ChevronDown, FileText, Monitor, Briefcase, Send, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import ResumeUploadDropdown, { type UploadedResume } from '@/components/shared/ResumeUploadDropdown'
import ActionCard from '@/components/shared/ActionCard'
import CreditBanner from '@/components/shared/CreditBanner'

const featureFlows = [
  {
    title: 'For Resume Builder',
    steps: [
      'Upload a resume or build one with Lightforth.',
      'Paste the job description and tailor your resume to the role.',
      'Score your resume with ATS checker and download as PDF, DOCX, or text.',
    ],
  },
  {
    title: 'For Interview Prep',
    steps: [
      'Upload a resume or select one from history.',
      'Set your job details and interview preference.',
      'Practice with the AI simulator and get a performance report.',
    ],
  },
  {
    title: 'For Interview Copilot',
    steps: [
      'Upload a resume or select one from history.',
      'Set your job details and connect your audio.',
      'Share the interview tab so AI can listen and help with answers.',
      'Start the interview on the canvas when you are ready.',
    ],
  },
  {
    title: 'For Auto-Apply',
    steps: [
      'Choose your target roles, locations, and preferences.',
      'Attach the resume you want Lightforth to use.',
      'Review matched jobs and let Lightforth apply for you.',
    ],
  },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [resume, setResume] = useState<UploadedResume | null>(null)
  const [howItWorksOpen, setHowItWorksOpen] = useState(false)

  const hasNoCredits = (user?.credits ?? 1) === 0
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="lf-page-shell space-y-6">

      {/* ── Hero card ── */}
      <div className="rounded-2xl bg-[#EEF4FF] px-5 py-6 sm:rounded-3xl sm:px-8 sm:py-8">
        {/* Date + greeting */}
        <p className="mb-1 text-sm text-muted-foreground">
          {format(new Date(), 'EEEE, MMMM do')}
        </p>
        <h1 className="mb-6 text-2xl font-bold leading-tight text-foreground sm:mb-8">
          Welcome {firstName}, let's get you hired.
        </h1>

        {/* Upload / file chip */}
        {resume ? (
          <div>
            <div className="flex items-center gap-3 rounded-2xl bg-[#102230] px-4 py-3.5 sm:px-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/20">
                <FileText className="h-5 w-5 text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{resume.name}</p>
                <p className="text-xs text-blue-300/80">Resume</p>
              </div>
              <button
                onClick={() => setResume(null)}
                aria-label="Remove resume"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Now, select an action</p>
          </div>
        ) : (
          <div>
            <ResumeUploadDropdown onUpload={setResume} />
            <p className="mt-3 text-sm text-muted-foreground">
              We'll analyze your resume and tailor it to your next job application.
            </p>
            <button
              onClick={() => setResume({ name: 'Adedamola_Adewale_Product_Manager_2026.docx.pdf', size: '120KB' })}
              className="mt-4 flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              Use last: Adedamola Adewale_Product Manager_2026.docx.pdf
            </button>
          </div>
        )}
      </div>

      {/* Credits banner */}
      {resume && hasNoCredits && <CreditBanner />}

      {/* Action cards — shown after upload */}
      {resume && (
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            Resume uploaded. What do you want to do next?
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ActionCard
              Icon={FileText}
              title="Tailor my Resume"
              description="Let Lightforth craft your perfect resume tailored to every role and optimized for results."
              to="/resume-builder?mode=tailor"
            />
            <ActionCard
              Icon={Monitor}
              title="Practice For Interview"
              description="Practice with AI interviewers, get actionable feedback, and walk into interviews more confident than ever."
              to="/app/interview-prep"
            />
            <ActionCard
              Icon={Briefcase}
              title="Start Interview Copilot"
              description="From resume reviews to job matches and strategy tips, Copilot gives you smart insights at every step."
              to="/interview-copilot"
            />
            <ActionCard
              Icon={Send}
              title="Auto-Apply"
              description="Let Lightforth auto-apply to relevant roles based on your preferences — no more job hunting stress."
              to="/app/auto-apply"
              badge="NEW"
            />
          </div>
        </div>
      )}

      {/* How it works */}
      <div>
        <button
          className="flex w-full items-center justify-between py-1"
          onClick={() => setHowItWorksOpen((o) => !o)}
        >
          <span className="text-lg font-bold text-foreground">How it works</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white">
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${howItWorksOpen ? 'rotate-180' : ''}`}
            />
          </span>
        </button>

        {howItWorksOpen && (
          <div className="mt-4 border-t border-border pt-4">
            <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-3">
              {featureFlows.map((feature) => (
                <article key={feature.title} className="min-w-[260px] flex-1 rounded-2xl border border-border bg-white p-5">
                  <h3 className="text-sm font-bold text-foreground">{feature.title}</h3>
                  <div className="mt-4 space-y-3">
                    {feature.steps.map((step, index) => (
                      <div key={step} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-white">
                          {index + 1}
                        </span>
                        <p>{step}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Help links */}
      <div className="space-y-3 pb-4">
        <a
          href="https://help.lightforth.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm font-bold text-primary hover:underline"
        >
          Visit Help Desk{' '}
          <span className="font-normal text-muted-foreground">(help.lightforth.ai)</span>
        </a>
        <a href="#" className="block text-sm font-bold text-primary hover:underline">
          Watch Quick Tutorial
        </a>
        <a
          href="mailto:support@lightforth.org"
          className="block text-sm font-bold text-primary hover:underline"
        >
          Contact us for support{' '}
          <span className="font-normal text-muted-foreground">(support@lightforth.org)</span>
        </a>
      </div>
    </div>
  )
}
