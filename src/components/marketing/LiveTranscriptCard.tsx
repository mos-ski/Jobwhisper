import { cn } from '@/lib/utils'

export interface TranscriptLine {
  speaker: string
  text: string
  isAnswer?: boolean
}

/**
 * The signature visual reused across all 3 landing pages: a miniature replica
 * of the actual desktop Copilot canvas (same traffic-light dots, same dark
 * chrome), showing a live, product-accurate Q&A relevant to that audience.
 */
export function LiveTranscriptCard({
  accent,
  badge,
  lines,
}: {
  accent: string
  badge: string
  lines: TranscriptLine[]
}) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0b1530] p-5 shadow-2xl shadow-slate-900/30">
      <div className="mb-5 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: accent }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          {badge}
        </span>
      </div>
      <div className="space-y-4">
        {lines.map((line, i) => (
          <div key={i}>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/35">{line.speaker}</p>
            <p className={cn('mt-1.5 text-sm leading-relaxed', line.isAnswer ? 'text-white' : 'text-white/65')}>
              {line.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
