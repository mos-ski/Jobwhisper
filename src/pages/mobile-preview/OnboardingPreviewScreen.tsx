import { useState } from 'react'
import { Briefcase, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const SLIDES = [
  {
    key: 'auto-apply',
    icon: Briefcase,
    title: 'Auto Apply',
    headline: 'Get more interviews',
    body: 'Submit your resume once and let Lightforth automatically apply to matching positions. No more repetitive forms — just real results.',
  },
  {
    key: 'copilot',
    icon: Sparkles,
    title: 'Interview Copilot',
    headline: 'Ace your interviews',
    body: 'Real-time AI assistance during live interviews — on video calls or phone calls, right from your pocket.',
  },
]

export function OnboardingPreviewScreen({ onComplete }: { onComplete: () => void }) {
  const [slide, setSlide] = useState(0)
  const current = SLIDES[slide]
  const Icon = current.icon
  const isLast = slide === SLIDES.length - 1

  return (
    <div className="flex h-full flex-col" style={{ background: '#0c1d48' }}>
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center text-white">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
          <Icon size={32} className="text-blue-300" />
        </span>
        <span className="mt-4 text-xs font-semibold uppercase tracking-widest text-white/40">{current.title}</span>
        <h1 className="mt-3 text-xl font-bold">{current.headline}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{current.body}</p>
      </div>

      <div className="flex flex-col items-center gap-5 px-8 pb-10">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === slide ? 'w-6 bg-white' : 'w-1.5 bg-white/25'
              )}
            />
          ))}
        </div>
        <button
          onClick={() => (isLast ? onComplete() : setSlide(slide + 1))}
          className="w-full rounded-xl bg-[#1a7aff] py-3 text-center text-sm font-semibold text-white"
        >
          {isLast ? 'Get started' : 'Next'}
        </button>
      </div>
    </div>
  )
}
