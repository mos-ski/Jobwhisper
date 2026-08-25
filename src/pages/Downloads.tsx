import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Apple, Download, FileText, Lock, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const downloads = [
  {
    title: 'Getting Started - Lightforth',
    meta: 'Guide · help',
    action: 'Get Started',
    icon: FileText,
    art: 'from-amber-200 via-rose-300 to-sky-200',
    pattern: 'rounded-[45%] opacity-80',
    isCopilot: false,
  },
  {
    title: 'Copilot Desktop (Mac - Apple Silicon)',
    meta: 'Application · dmg',
    action: 'Download',
    icon: Apple,
    art: 'from-violet-400 via-rose-300 to-sky-200',
    pattern: 'skew-y-6 opacity-90',
    isCopilot: true,
  },
  {
    title: 'Copilot Desktop (Mac - Intel)',
    meta: 'Application · dmg',
    action: 'Download',
    icon: Apple,
    art: 'from-indigo-400 via-orange-200 to-cyan-200',
    pattern: '-skew-y-6 opacity-90',
    isCopilot: true,
  },
  {
    title: 'Copilot Desktop (Windows)',
    meta: 'Application · exe',
    action: 'Download',
    icon: Monitor,
    art: 'from-fuchsia-300 via-amber-200 to-emerald-200',
    pattern: 'rounded-full opacity-80',
    isCopilot: true,
  },
]

export default function Downloads() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const hasCopilotAccess = user?.plan === 'pro' || user?.plan === 'premium'

  function handleCopilotDownload() {
    if (!hasCopilotAccess) {
      toast.info('Upgrade to Pro or Premium to unlock the Copilot desktop app.')
      navigate('/billing')
      return
    }
    navigate(`/desktop-copilot-preview${user?.email ? `?email=${encodeURIComponent(user.email)}` : ''}`)
  }

  return (
    <div className="lf-page-shell">
      <div className="lf-page-header">
        <h1 className="lf-page-title">Downloads</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Download our apps and extensions to enhance your job search experience
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {downloads.map((item) => {
          const Icon = item.icon
          return (
            <article key={item.title} className="lf-panel p-4">
              <div className={cn('relative mb-4 aspect-square overflow-hidden rounded-sm bg-gradient-to-br', item.art)}>
                <div className={cn('absolute -left-8 top-8 h-40 w-56 bg-white/35', item.pattern)} />
                <div className="absolute bottom-8 right-8 h-28 w-40 rotate-45 bg-black/10" />
                <div className="absolute left-10 top-10 h-24 w-32 -rotate-12 border border-white/40 bg-white/20" />
              </div>
              <h2 className="min-h-12 text-base font-bold leading-snug text-foreground">{item.title}</h2>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span>{item.meta}</span>
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={item.isCopilot ? handleCopilotDownload : undefined}
              >
                {item.isCopilot && !hasCopilotAccess ? <Lock className="h-4 w-4" /> : item.action === 'Download' && <Download className="h-4 w-4" />}
                {item.action}
              </Button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
