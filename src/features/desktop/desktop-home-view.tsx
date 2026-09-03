import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Code2, Headset, MessageCircleMore, NotebookPen, Send, Sparkles } from 'lucide-react'

import { cn } from '@/ui'

type DesktopHomeCard = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly icon: typeof Sparkles
  readonly badge?: string
  readonly action?: 'internal' | 'external'
  readonly href?: string
}

const DESKTOP_HOME_CARDS: readonly DesktopHomeCard[] = [
  {
    id: 'practice',
    title: 'Practice For Interview',
    description: 'Practice with AI interviewers, get actionable feedback, and walk into interviews more confident than ever.',
    icon: Sparkles,
    action: 'internal',
    href: '/desktop/configure',
  },
  {
    id: 'copilot',
    title: 'Start Interview Copilot',
    description: 'From resume reviews to job matches and strategy tips, Copilot gives you smart insights at every step.',
    icon: MessageCircleMore,
    action: 'internal',
    href: '/desktop/configure',
  },
  {
    id: 'apply',
    title: 'Apply for Jobs',
    description: 'Let Jobwhisper auto-apply to relevant roles based on your preferences — no more job hunting stress.',
    icon: Send,
    badge: 'BETA',
  },
  {
    id: 'coding',
    title: 'Coding Interview',
    description: 'Live AI assistance for coding interviews — real-time hints as you work through the problem.',
    icon: Code2,
  },
  {
    id: 'meeting',
    title: 'Meeting Copilot',
    description: 'Live AI assistance during meetings — real-time notes and talking points as the conversation happens.',
    icon: NotebookPen,
  },
  {
    id: 'done-for-you',
    title: 'Done for you',
    description: 'Let Jobwhisper auto-apply to relevant roles based on your preferences — no more job hunting stress.',
    icon: Headset,
    action: 'external',
  },
]

export function DesktopHomeView() {
  const navigate = useNavigate()

  return (
    <div className="h-full min-h-[520px] overflow-y-auto bg-[#0a1220] px-10 py-12">
      <h1 className="text-2xl font-bold text-white">Welcome, what would you like to do today?</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DESKTOP_HOME_CARDS.map((card) => {
          const Icon = card.icon
          const clickable = card.action === 'internal' && card.href

          return (
            <button
              key={card.id}
              type="button"
              disabled={!clickable}
              onClick={clickable ? () => navigate(card.href!) : undefined}
              className={cn(
                'grid gap-4 rounded-xl bg-white p-6 text-left shadow-sm transition-colors',
                clickable ? 'cursor-pointer hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus' : 'cursor-default',
              )}
            >
              <Icon aria-hidden="true" className="size-9 text-[#0052ff]" />
              <div>
                <span className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-[#0a1220]">{card.title}</span>
                  {card.action === 'internal' ? <ArrowRight aria-hidden="true" className="size-4 text-[#0a1220]" /> : null}
                  {card.action === 'external' ? <ArrowUpRight aria-hidden="true" className="size-4 text-[#0a1220]" /> : null}
                  {card.badge ? (
                    <span className="rounded-pill bg-[#eceef2] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#475467]">{card.badge}</span>
                  ) : null}
                </span>
                <p className="mt-2 text-sm leading-6 text-[#667085]">{card.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
