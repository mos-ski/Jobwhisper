import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  Check,
  CircleHelp,
  FileText,
  Headphones,
  MessageSquareText,
  Mic,
  Play,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import { Button, JobwhisperIcon, TextField, cn } from '@/ui'

const PAIN_POINTS = [
  'You ramble because you cannot structure an answer quickly.',
  'You know the experience but struggle to explain it clearly.',
  'You forget important examples from your own career.',
  'You get interviews consistently but struggle to turn them into offers.',
]

const OLD_PREP_ITEMS = [
  'Research the company',
  'Practice STAR answers',
  'Watch interview videos',
  'Ask AI for mock questions',
  'Write down common questions',
  'Run mock interviews',
]

const COPILOT_CONTEXT = ['Your resume', 'The role', 'The job description', 'Your professional experience']

const INTERVIEW_MOMENTS = [
  {
    Icon: MessageSquareText,
    title: 'Behavioural questions',
    body: 'Structure your experience into clearer responses while the interviewer is still with you.',
  },
  {
    Icon: Brain,
    title: 'Unexpected questions',
    body: 'Get direction when a question catches you off guard and pressure starts stealing your words.',
  },
  {
    Icon: FileText,
    title: 'Career experience',
    body: 'Surface relevant projects, metrics, and examples from the background you already provided.',
  },
  {
    Icon: Headphones,
    title: 'Follow-up questions',
    body: 'Stay composed when the interviewer pushes deeper and the conversation changes shape.',
  },
]

const FITS = [
  'You are actively interviewing for jobs.',
  'You get interviews but not enough offers.',
  'You struggle with nerves or lose your train of thought.',
  'You are interviewing for a competitive or more senior role.',
  'English is not your strongest communication language.',
  'You are tired of leaving interviews thinking, "I could have answered that better."',
]

const FAQS = [
  {
    question: 'Will Jobwhisper answer everything for me?',
    answer:
      'No. Jobwhisper assists your thinking and communication using your professional context. Your experience still matters.',
  },
  {
    question: 'Do I still need to prepare?',
    answer:
      'Yes. Jobwhisper works best when you provide strong context and understand the role you are interviewing for.',
  },
  {
    question: 'Can I use it for technical interviews?',
    answer:
      'It can assist across different interview questions, including technical and role-specific discussions, depending on the context you provide.',
  },
  {
    question: 'Do I need to type every question?',
    answer:
      'No. Interview Copilot is designed around listening to the interview conversation and providing assistance from that context.',
  },
  {
    question: 'Is this just ChatGPT?',
    answer:
      'No. General AI tools can help you prepare. Jobwhisper is built around your resume, job description, role, and live interview workflow.',
  },
]

function MarketingShell({
  children,
  className,
}: {
  readonly children: ReactNode
  readonly className?: string
}) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}

function LandingNav() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-shell border-b border-border bg-surface/95 backdrop-blur">
      <MarketingShell className="flex min-h-16 items-center justify-between gap-4">
        <a href="/" className="inline-flex items-center gap-2 text-ink transition-colors hover:text-accent-text">
          <JobwhisperIcon className="size-6" />
          <span className="font-rethink text-lg font-semibold">Jobwhisper</span>
        </a>
        <nav aria-label="Landing page" className="hidden items-center gap-6 text-sm font-medium text-ink-muted md:flex">
          <a className="transition-colors hover:text-ink" href="#demo">
            Watch
          </a>
          <a className="transition-colors hover:text-ink" href="#how-it-works">
            How it works
          </a>
          <a className="transition-colors hover:text-ink" href="#faq">
            FAQ
          </a>
        </nav>
        <Button size="sm" onClick={() => navigate('/v3/interview-copilot')}>
          Get copilot
        </Button>
      </MarketingShell>
    </header>
  )
}

function VslCard({ compact = false }: { readonly compact?: boolean }) {
  return (
    <div
      id="demo"
      className={cn(
        'overflow-hidden rounded-lg border border-border bg-surface shadow-xl',
        compact ? 'shadow-panel' : 'lg:translate-y-10',
      )}
    >
      <div className="flex items-center justify-between border-b border-border bg-surface-subtle px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-full bg-accent text-brand-bar-text">
            <Play aria-hidden="true" className="size-4 fill-current" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Watch this before your next interview</p>
            <p className="text-xs text-ink-muted">VSL video</p>
          </div>
        </div>
        <span className="rounded-full bg-positive-surface px-3 py-1 text-xs font-semibold text-positive">Ready</span>
      </div>
      <div className="relative bg-live-canvas">
        <video
          src="/MacBook-Pro-14-25.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="aspect-video w-full object-cover object-top opacity-90"
        />
        <div className="absolute inset-x-4 bottom-4 rounded-lg border border-live-border bg-live-panel/95 p-4 shadow-lg">
          <p className="text-sm font-semibold text-brand-bar-text">
            The interviewer can only judge the answer you gave.
          </p>
          <p className="mt-1 text-xs leading-5 text-ink-muted">
            Not the better answer you thought of later.
          </p>
        </div>
      </div>
    </div>
  )
}

function LandingHero() {
  const navigate = useNavigate()

  return (
    <section className="bg-landing-bg text-brand-bar-text">
      <MarketingShell className="grid gap-10 pb-14 pt-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pb-24 lg:pt-20">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex rounded-full border border-live-control-border px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            AI interview copilot
          </p>
          <h1 className="font-gowun text-4xl font-bold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
            You already got the interview. Do not lose the job because the right answer came 5 minutes too late.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-bar-text">
            Jobwhisper Interview Copilot helps you understand questions, organize your experience, and structure
            stronger answers in real time.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              className="bg-surface text-accent-text hover:bg-surface-subtle"
              size="lg"
              onClick={() => navigate('/v3/interview-copilot')}
            >
              Get Jobwhisper Copilot
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
            <a
              href="#demo"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-live-control-border px-5 py-2.5 text-base font-semibold text-brand-bar-text transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              Watch the VSL
              <Play aria-hidden="true" className="size-4" />
            </a>
          </div>
          <p className="mt-4 text-sm leading-6 text-brand-bar-text">
            Set it up with your resume, job description, and role before your next interview.
          </p>
        </div>
        <VslCard />
      </MarketingShell>
    </section>
  )
}

function ProblemSection() {
  return (
    <section className="bg-canvas py-16 sm:py-20">
      <MarketingShell className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">The problem</p>
          <h2 className="mt-3 font-gowun text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Being qualified is not the same as interviewing well.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted">
            You know your experience. But then someone asks, “Tell me about a time you handled conflict,” and suddenly
            you have 30 seconds to turn years of work into a clear answer.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {PAIN_POINTS.map((point) => (
            <div key={point} className="rounded-lg border border-border bg-surface p-5 shadow-panel">
              <Check aria-hidden="true" className="mb-4 size-5 text-accent-text" />
              <p className="text-base font-medium leading-7 text-ink">{point}</p>
            </div>
          ))}
        </div>
      </MarketingShell>
    </section>
  )
}

function CostSection() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <MarketingShell className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="rounded-lg border border-border bg-surface-subtle p-6 shadow-panel sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">The real cost</p>
          <h2 className="mt-3 font-gowun text-3xl font-bold leading-tight text-ink sm:text-4xl">
            One bad interview can cost more than 45 minutes.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted">
            Maybe it is your first remote job, your move into management, or the role that finally lets you leave a
            company you have outgrown.
          </p>
        </div>
        <div className="space-y-3">
          {['Found the vacancy', 'Applied', 'Got through screening', 'Beat other applicants', 'Got invited'].map(
            (step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-lg border border-border bg-canvas p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-subtle text-sm font-bold text-accent-text">
                  {index + 1}
                </span>
                <p className="font-medium text-ink">{step}</p>
              </div>
            ),
          )}
          <div className="rounded-lg border border-danger bg-danger-surface p-5">
            <p className="font-semibold text-danger">
              Then one poorly answered question can change the outcome.
            </p>
          </div>
        </div>
      </MarketingShell>
    </section>
  )
}

function OldSolutionSection() {
  return (
    <section className="bg-canvas py-16 sm:py-20">
      <MarketingShell>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">The old solution</p>
          <h2 className="mt-3 font-gowun text-3xl font-bold leading-tight text-ink sm:text-4xl">
            You cannot prepare for every question they might ask.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted">
            Preparation happens before the interview. The unexpected question happens during it.
          </p>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OLD_PREP_ITEMS.map((item) => (
            <div key={item} className="rounded-lg border border-border bg-surface p-4 text-sm font-semibold text-ink">
              {item}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-3xl rounded-lg border border-warning bg-warning-surface p-5 text-center">
          <p className="font-semibold text-warning">
            All of that helps. But pressure can still make the right answer hard to access when you actually need it.
          </p>
        </div>
      </MarketingShell>
    </section>
  )
}

function IntroducingSection() {
  const navigate = useNavigate()

  return (
    <section id="how-it-works" className="bg-live-canvas py-16 sm:py-20">
      <MarketingShell className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="text-brand-bar-text">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-muted">Meet Jobwhisper</p>
          <h2 className="mt-3 font-gowun text-3xl font-bold leading-tight sm:text-4xl">
            Your AI Interview Copilot already knows the context.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted">
            Before the interview, give Jobwhisper the context it needs. When the question comes, it helps you structure a
            response based on your own career and the opportunity in front of you.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {COPILOT_CONTEXT.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-live-border bg-live-panel p-4">
                <BadgeCheck aria-hidden="true" className="size-5 text-accent-muted" />
                <span className="text-sm font-semibold text-brand-bar-text">{item}</span>
              </div>
            ))}
          </div>
          <Button className="mt-8 bg-surface text-accent-text hover:bg-surface-subtle" onClick={() => navigate('/v3/interview-copilot')}>
            Get Jobwhisper Copilot
          </Button>
        </div>
        <div className="rounded-lg border border-live-border bg-live-panel p-4 shadow-xl">
          <div className="rounded-lg bg-live-workspace p-4">
            <div className="flex items-center justify-between border-b border-live-border pb-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-live-message">
                  <Mic aria-hidden="true" className="size-5 text-accent-muted" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-bar-text">Interviewer</p>
                  <p className="text-xs text-ink-muted">Live question detected</p>
                </div>
              </div>
              <span className="rounded-full bg-positive-surface px-3 py-1 text-xs font-semibold text-positive">
                Listening
              </span>
            </div>
            <p className="py-5 text-lg font-semibold leading-8 text-brand-bar-text">
              “Tell me about a product launch that did not go according to plan and how you handled it.”
            </p>
            <div className="rounded-lg border border-live-border bg-live-message p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-accent-muted">
                <Sparkles aria-hidden="true" className="size-4" />
                Response direction
              </div>
              <ul className="space-y-3 text-sm leading-6 text-brand-bar-text">
                <li>Start with the delayed B2B onboarding launch from your resume.</li>
                <li>Frame the problem as scope drift plus unclear handoff ownership.</li>
                <li>Use the metric: reduced launch delay from three weeks to six days.</li>
              </ul>
            </div>
          </div>
        </div>
      </MarketingShell>
    </section>
  )
}

function MomentsSection() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <MarketingShell>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">Interview moments</p>
          <h2 className="mt-3 font-gowun text-3xl font-bold leading-tight text-ink sm:text-4xl">
            One copilot. Different moments when answers can slip.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INTERVIEW_MOMENTS.map(({ Icon, title, body }) => (
            <article key={title} className="rounded-lg border border-border bg-canvas p-5">
              <Icon aria-hidden="true" className="mb-5 size-6 text-accent-text" />
              <h3 className="text-lg font-bold text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-muted">{body}</p>
            </article>
          ))}
        </div>
      </MarketingShell>
    </section>
  )
}

function ChatGptContrastSection() {
  return (
    <section className="bg-canvas py-16 sm:py-20">
      <MarketingShell className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">Category contrast</p>
          <h2 className="mt-3 font-gowun text-3xl font-bold leading-tight text-ink sm:text-4xl">
            “Why not just open ChatGPT during my interview?”
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted">
            You can use general AI to prepare. But during a live conversation, copying context into a chat window over
            and over again is not the workflow.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-6">
            <CircleHelp aria-hidden="true" className="mb-5 size-6 text-warning" />
            <h3 className="text-lg font-bold text-ink">General AI</h3>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Useful before the call, but you still need to paste your resume, job description, question, and role while
              someone is waiting.
            </p>
          </div>
          <div className="rounded-lg border border-accent bg-accent-subtle p-6">
            <ShieldCheck aria-hidden="true" className="mb-5 size-6 text-accent-text" />
            <h3 className="text-lg font-bold text-ink">Jobwhisper</h3>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Your context is already there, and Interview Copilot is built around the live interview conversation.
            </p>
          </div>
        </div>
      </MarketingShell>
    </section>
  )
}

function WhoItsForSection() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <MarketingShell className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">Who it is for</p>
          <h2 className="mt-3 font-gowun text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Built for the candidate who already earned the room.
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {FITS.map((item) => (
            <div key={item} className="flex gap-3 rounded-lg border border-border bg-canvas p-4">
              <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-accent-text" />
              <p className="text-sm font-medium leading-6 text-ink">{item}</p>
            </div>
          ))}
        </div>
      </MarketingShell>
    </section>
  )
}

function LeadCaptureSection() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="bg-landing-bg py-16 text-brand-bar-text sm:py-20">
      <MarketingShell className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide">Get ready</p>
          <h2 className="mt-3 font-gowun text-3xl font-bold leading-tight sm:text-4xl">
            Get Jobwhisper ready for your next interview.
          </h2>
          <p className="mt-5 text-base leading-relaxed">
            Add your details and continue to the Copilot setup flow. We will also send setup instructions to your email
            so you can prepare before the interview.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-surface p-5 text-ink shadow-xl sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="first-name" label="First name" name="firstName" autoComplete="given-name" required />
            <TextField id="lead-email" label="Email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="mt-4">
            <TextField id="lead-phone" label="Phone number" name="phone" type="tel" autoComplete="tel" required />
          </div>
          <Button className="mt-5 w-full" type="submit">
            Continue to Jobwhisper
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            We will also send your setup instructions to your email so you can get ready before your interview.
          </p>
          {submitted ? (
            <div className="mt-4 rounded-lg border border-positive bg-positive-surface p-4" role="status" aria-live="polite">
              <p className="text-sm font-semibold text-positive">Details captured for this prototype.</p>
              <button
                className="mt-2 text-sm font-semibold text-accent-text underline-offset-4 hover:underline"
                type="button"
                onClick={() => navigate('/v3/interview-copilot')}
              >
                Continue to Copilot setup
              </button>
            </div>
          ) : null}
        </form>
      </MarketingShell>
    </section>
  )
}

function FaqSection() {
  return (
    <section id="faq" className="bg-canvas py-16 sm:py-20">
      <MarketingShell className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">Objections</p>
          <h2 className="mt-3 font-gowun text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Questions candidates ask before they bring Copilot into the call.
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group rounded-lg border border-border bg-surface p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-ink">
                {faq.question}
                <ArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-ink-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </MarketingShell>
    </section>
  )
}

function FinalCloseSection() {
  const navigate = useNavigate()

  return (
    <section className="bg-live-canvas py-16 text-brand-bar-text sm:py-20">
      <MarketingShell className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-muted">Final close</p>
        <h2 className="mt-3 font-gowun text-3xl font-bold leading-tight sm:text-5xl">
          Do not lose an opportunity because the right answer came 5 minutes too late.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          Your resume got you into the room. Jobwhisper helps you show them why you belong there.
        </p>
        <Button className="mt-8 bg-surface text-accent-text hover:bg-surface-subtle" size="lg" onClick={() => navigate('/v3/interview-copilot')}>
          Get Jobwhisper Copilot
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </MarketingShell>
    </section>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas font-rethink">
      <LandingNav />
      <main>
        <LandingHero />
        <ProblemSection />
        <CostSection />
        <OldSolutionSection />
        <IntroducingSection />
        <MomentsSection />
        <ChatGptContrastSection />
        <WhoItsForSection />
        <LeadCaptureSection />
        <FaqSection />
        <FinalCloseSection />
      </main>
    </div>
  )
}
