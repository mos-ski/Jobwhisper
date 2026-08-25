import { ArrowRight, Briefcase, FileText, Headphones, Send, Target, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const featureCards = [
  {
    title: 'Build a Resume That Gets You Hired',
    description: 'Let Lightforth craft your perfect resume tailored to every role and optimized for results.',
    action: 'Build a Resume',
    to: '/resume-builder',
    color: 'text-violet-700',
    icon: FileText,
  },
  {
    title: 'Auto-Apply 50+ Jobs in Minutes',
    description: 'Let Lightforth auto-apply to relevant roles based on your preferences. No more job hunting stress.',
    action: 'Apply for Jobs',
    to: '/auto-apply',
    color: 'text-emerald-700',
    badge: 'NEW',
    icon: Send,
  },
  {
    title: 'Practice For Interview',
    description: 'Practice with AI interviewers, get actionable feedback, and walk into interviews more confident than ever.',
    action: 'Prepare for Interview',
    to: '/interview-prep',
    color: 'text-red-700',
    icon: Target,
  },
  {
    title: 'Get Live Interview Support',
    description: 'From resume reviews to job matches and strategy tips, Copilot gives you smart insights at every step.',
    action: 'Use Copilot',
    to: '/interview-copilot',
    color: 'text-slate-700',
    icon: Headphones,
  },
  {
    title: 'Done for you',
    description: "We'll take care of your resume, job applications, and interview prep, so you can focus on landing your dream role.",
    action: 'Take the offer',
    to: '/billing',
    color: 'text-foreground',
    offer: true,
    icon: Briefcase,
  },
]

const examples = [
  ['Software Engineer Resume', '$120k starting salary', 'Use Resume Template'],
  ['Product Manager Interview', 'Landed a $50k role', 'View Interview Strategy'],
  ['Software Developer Resume', '$110k at Google', 'Use Resume Template'],
]

function CreditPill({ offer }: { offer?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        offer ? 'bg-orange-50 text-orange-600' : 'bg-muted text-muted-foreground',
      )}
    >
      <Zap className="h-3 w-3 text-primary" />
      {offer ? 'Offer for you' : '1 Credit'}
    </span>
  )
}

export default function Explore() {
  return (
    <div className="lf-page-shell space-y-8">
      <div className="lf-page-header">
        <h1 className="lf-page-title">Explore</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Discover winning resumes and interview strategies to help you land your dream job
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featureCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className={cn(
                'lf-panel flex min-h-44 flex-col justify-between p-5',
                card.offer && 'border-violet-200 ring-1 ring-violet-100',
              )}
            >
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <h2 className={cn('text-sm font-bold', card.color)}>{card.title}</h2>
                  {card.badge && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {card.badge}
                    </span>
                  )}
                </div>
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{card.description}</p>
              </div>
              <div className="mt-4 flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
                <CreditPill offer={card.offer} />
                <Link to={card.to} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
                  {card.action}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      <section>
        <h2 className="mb-4 text-lg font-bold text-foreground">Explore winning resumes and interview strategies</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {examples.map(([title, tag, action]) => (
            <div key={title} className="lf-panel p-5">
              <div className="mb-4 flex items-start gap-4">
                <div className="h-12 w-12 rounded bg-blue-50 p-2">
                  <div className="mb-1 h-2 w-2 rounded-full bg-blue-200" />
                  <div className="mb-1 h-1.5 w-7 rounded bg-slate-200" />
                  <div className="h-1.5 w-5 rounded bg-slate-100" />
                </div>
                <div className="min-w-0">
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                    {tag}
                  </span>
                  <h3 className="mt-2 font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">Optimized with Lightforth AI - ATS score: 92%</p>
                </div>
              </div>
              <Link to="/resume-builder" className="text-sm font-semibold text-primary hover:underline">
                {action}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
