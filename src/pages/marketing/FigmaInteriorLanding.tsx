import { ArrowRight, Check, Code2, EyeOff, Monitor, PlayCircle, ShieldCheck, Sparkles, Video } from 'lucide-react'
import LightforthLogo from '@/components/shared/LightforthLogo'

const trustedBy = ['Product managers', 'Software engineers', 'Analysts', 'Consultants', 'Graduates', 'Career switchers']

const metrics = [
  ['~2s', 'Average response time'],
  ['0', 'Screen-share footprint'],
  ['3', 'Interview, coding, meeting modes'],
  ['50+', 'Monthly credits on Pro'],
]

const features = [
  {
    icon: Video,
    title: 'Interview answers while you talk',
    text: 'Lightforth listens to the question and gives you a clear, ready-to-say response before the silence gets awkward.',
  },
  {
    icon: Code2,
    title: 'Coding help from the screen',
    text: 'Capture the prompt, get the approach, edge cases, and working code without leaving the assessment window.',
  },
]

const workflow = [
  'Choose Interview or Coding before the session.',
  'Keep the overlay on top, transparent, and invisible to screen sharing.',
  'Read the response naturally, or use bullets when you want to stay in your own voice.',
]

function PrimaryLink({ children, href = '/copilot' }: { children: React.ReactNode; href?: string }) {
  return (
    <a href={href} className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90">
      {children}
    </a>
  )
}

export default function FigmaInteriorLanding() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white font-sans text-foreground">
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto w-full max-w-[1220px] px-6">
          <header className="flex h-16 items-center justify-between">
            <LightforthLogo to="/copilot" className="h-8 brightness-0 invert" />
            <nav className="hidden items-center gap-7 text-sm font-semibold text-white/75 md:flex">
              <a href="#features" className="hover:text-white">Features</a>
              <a href="#proof" className="hover:text-white">Proof</a>
              <a href="#pricing" className="hover:text-white">Plans</a>
            </nav>
            <div className="flex shrink-0 items-center gap-2 text-sm font-semibold sm:gap-3">
              <a href="/desktop-copilot-preview" className="hidden text-white/75 hover:text-white sm:inline">Sign in</a>
              <a href="/copilot" className="hidden whitespace-nowrap rounded-lg bg-white px-4 py-2 text-primary shadow-sm hover:bg-white/90 sm:inline-flex">Get Copilot</a>
            </div>
          </header>

          <div
            id="home"
            className="relative overflow-hidden pb-20 pt-16 sm:pt-24"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          >
            <div className="w-full max-w-[342px] sm:max-w-5xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white">
                <EyeOff className="h-4 w-4" />
                Invisible interview and coding copilot
              </p>
              <h1 className="mt-7 max-w-[342px] text-[34px] font-bold leading-[1.08] tracking-normal text-white sm:max-w-4xl sm:text-6xl lg:text-[64px]">
                Nobody on the call can see it. That&apos;s the point.
              </h1>
              <p className="mt-7 max-w-[342px] text-base leading-7 text-white/75 sm:max-w-xl sm:text-lg">
                Lightforth gives you live answers during interviews and coding rounds, while staying hidden from screen shares, recordings, and the pressure of the moment.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/copilot" className="inline-flex h-12 items-center gap-2 rounded-lg bg-white px-5 text-sm font-bold text-primary shadow-sm hover:bg-white/90">
                  <PlayCircle className="h-5 w-5" />
                  See plans
                </a>
                <a href="#stealth" className="inline-flex h-12 items-center rounded-lg bg-white/10 px-5 text-sm font-bold text-white ring-1 ring-white/20 hover:bg-white/15">
                  How stealth works
                </a>
              </div>
            </div>

            <div className="mt-16 grid w-full max-w-[342px] min-w-0 gap-6 sm:max-w-none lg:grid-cols-[1.05fr_0.95fr]">
              <div className="w-full min-w-0 rounded-lg bg-white p-4 text-slate-900 shadow-2xl shadow-slate-950/20 sm:p-6">
                <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border pb-4">
                  <p className="text-sm font-bold">Live Interview</p>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Stealth on</span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="min-w-0 rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Interviewer</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">Tell me about a time you handled conflict with a teammate.</p>
                  </div>
                  <div className="min-w-0 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="text-xs font-bold uppercase text-primary">Lightforth</p>
                    <p className="mt-2 text-sm leading-6 text-slate-800">
                      Frame it as alignment, not conflict: context, what you disagreed on, how you kept the relationship intact, and the result.
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid w-full min-w-0 gap-4 rounded-lg bg-white/10 p-4 ring-1 ring-white/20 sm:p-6">
                {workflow.map(item => (
                  <div key={item} className="flex min-w-0 gap-3 text-sm leading-6 text-white/85">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-white" />
                    <span className="min-w-0">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary pb-16 text-white">
        <div className="mx-auto w-full max-w-[1220px] px-6 text-center">
          <p className="mx-auto max-w-[300px] text-sm font-medium text-white/70 sm:max-w-none">Built for the moments that decide the offer</p>
          <div className="mt-7 grid grid-cols-1 items-center gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {trustedBy.map((name, index) => (
              <div key={name} className="flex min-w-0 items-center justify-center gap-2 text-base font-bold text-white/75">
                {index % 2 === 0 ? <Sparkles className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
                <span className="whitespace-nowrap">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-50 py-24">
        <div className="mx-auto w-full max-w-[1220px] px-6">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-[342px] sm:max-w-none">
              <p className="text-sm font-bold text-primary">What it does</p>
              <h2 className="mt-3 text-4xl font-bold leading-tight tracking-normal text-slate-900">A private answer layer for interviews and coding rounds</h2>
              <p className="mt-5 max-w-[342px] text-base leading-7 text-slate-600 sm:max-w-xl sm:text-lg">
                You stay present in the conversation. Lightforth handles the recall, structure, and speed when the question lands.
              </p>
            </div>
            <div className="grid gap-10">
              {features.map(feature => (
                <div key={feature.title} className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-primary">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 max-w-[342px] sm:max-w-none">
                    <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="stealth" className="mt-16 grid gap-6 lg:grid-cols-3">
            {[
              ['Screen-share invisible', 'The overlay is designed to stay off recordings and screen shares.'],
              ['Transparency control', 'Fade the window down so it sits over your call without blocking your view.'],
              ['Always on top', 'Keep the answer close to your eyeline while Zoom, Meet, or Teams stays active.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-lg border border-border bg-white p-6 shadow-sm">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="bg-white py-24">
        <div className="mx-auto grid max-w-[1220px] items-center gap-14 px-6 lg:grid-cols-[320px_1fr]">
          <div className="flex h-[320px] w-[320px] items-center justify-center rounded-lg bg-primary/10">
            <Code2 className="h-24 w-24 text-primary" />
          </div>
          <div>
            <p className="text-2xl tracking-[0.18em] text-primary">★★★★★</p>
            <blockquote className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-normal text-slate-900">
              Go into the interview with a second brain that only you can see.
            </blockquote>
            <p className="mt-8 text-base font-semibold text-slate-900">Interview, coding, and meeting support</p>
            <p className="mt-1 text-sm text-slate-600">Starting at $49/month</p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="mx-auto grid max-w-[1220px] gap-10 px-6 text-center sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(([value, label]) => (
            <div key={label}>
              <p className="text-5xl font-bold tracking-normal text-slate-900">{value}</p>
              <p className="mt-3 text-sm font-semibold text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-white py-24">
        <div className="mx-auto grid max-w-[1220px] gap-16 px-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-slate-50 p-8">
            <h2 className="text-4xl font-bold tracking-normal text-slate-900">Ready before the next question lands</h2>
            <p className="mt-4 text-lg leading-7 text-slate-600">Use Lightforth for live interviews, coding assessments, and high-pressure calls where speed matters.</p>
            <ul className="mt-8 space-y-4 text-sm leading-6 text-slate-700">
              {['Interview and Coding included on Pro', 'Meeting Copilot included on Premium', 'Credits based on session length', 'Cancel anytime'].map(item => (
                <li key={item} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 text-emerald-500" />{item}</li>
              ))}
            </ul>
          </div>
          <div className="self-center">
            <h2 className="text-4xl font-bold tracking-normal text-slate-900">Start with Copilot</h2>
            <p className="mt-4 text-lg text-slate-600">Choose Pro for interviews and coding. Upgrade to Premium when you want meeting support too.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryLink href="/copilot">See Copilot plans</PrimaryLink>
              <a href="/desktop-copilot-preview" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                Try app preview <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto flex max-w-[1220px] flex-col justify-between gap-8 px-6 sm:flex-row sm:items-center">
          <LightforthLogo to="/copilot" />
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-slate-600">
            {['Features', 'Plans', 'Stealth', 'Preview'].map(item => <a key={item} href="#home">{item}</a>)}
          </nav>
          <p className="text-sm text-slate-500">© 2026 Lightforth. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
