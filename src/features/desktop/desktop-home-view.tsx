import { useNavigate } from 'react-router-dom'

import { cn } from '@/ui'

type DesktopHomeCard = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly icon: string
  readonly badge?: string
  readonly suffix?: '→' | '↗'
  readonly href?: string
}

const DESKTOP_HOME_CARDS: readonly DesktopHomeCard[] = [
  {
    id: 'copilot',
    title: 'Start Interview Copilot',
    description: 'From resume reviews to job matches and strategy tips, Copilot gives you smart insights at every step.',
    icon: '/v3-assets/figma/action-icon-copilot.svg',
    suffix: '→',
    href: '/desktop/configure',
  },
  {
    id: 'coding',
    title: 'Coding Interview',
    description: 'Live AI assistance for coding interviews — real-time hints as you work through the problem.',
    icon: '/v3-assets/figma/action-icon-coding.svg',
  },
  {
    id: 'meeting',
    title: 'Meeting Copilot',
    description: 'Live AI assistance during meetings — real-time notes and talking points as the conversation happens.',
    icon: '/v3-assets/figma/action-icon-meeting.svg',
  },
]

export function DesktopHomeView() {
  const navigate = useNavigate()

  return (
    <div className="h-full min-h-[520px] overflow-y-auto bg-live-workspace px-10 py-12">
      <p className="text-2xl font-semibold leading-tight text-white">Welcome, what would you like to do today?</p>

      <div className="mt-[29px] flex flex-wrap gap-[9px]">
        {DESKTOP_HOME_CARDS.map((card) => {
          const clickable = Boolean(card.href)

          return (
            <button
              key={card.id}
              type="button"
              disabled={!clickable}
              onClick={clickable ? () => navigate(card.href!) : undefined}
              className={cn(
                'flex w-[250px] flex-col items-start gap-3 rounded-[9px] border-[0.75px] border-[#eaecf0] bg-white px-[18px] py-3 text-left transition-colors',
                clickable ? 'cursor-pointer hover:bg-[#f8fafc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus' : 'cursor-default',
              )}
            >
              <img src={card.icon} alt="" className="h-[57.6px] w-[56.5px] shrink-0" />
              <div className="grid gap-1.5">
                <span className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-medium tracking-[-0.28px] text-[#32363a]">
                    {card.title}
                    {card.suffix ? <span className="ms-1">{card.suffix}</span> : null}
                  </span>
                  {card.badge ? (
                    <span className="rounded-pill bg-[#eceef2] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#475467]">{card.badge}</span>
                  ) : null}
                </span>
                <p className="text-xs font-normal leading-[18px] tracking-[-0.24px] text-[rgba(26,26,26,0.7)]">{card.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
