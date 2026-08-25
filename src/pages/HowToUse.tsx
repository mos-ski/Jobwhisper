import { Play } from 'lucide-react'

const videos = [
  ['Interview Copilot', 'from-blue-600 to-blue-950'],
  ['Auto Apply', 'from-emerald-500 to-emerald-950'],
  ['Resume Builder', 'from-violet-600 to-purple-950'],
  ['Interview Prep', 'from-orange-500 to-red-950'],
]

export default function HowToUse() {
  return (
    <div className="lf-page-shell">
      <div className="lf-page-header">
        <h1 className="lf-page-title">How to use Lightforth</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          Start by setting up a job profile by providing all the necessary information needed to build your resume.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {videos.map(([title, gradient]) => (
          <button
            key={title}
            className={`group relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br ${gradient} text-left shadow-sm`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.12),transparent_38%)]" />
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:22px_22px]" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-105">
              <Play className="ml-1 h-7 w-7 fill-foreground text-foreground" />
            </span>
            <span className="absolute bottom-6 left-6 text-base font-bold text-white">{title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
