import { useEffect } from 'react'
import { Sparkles } from 'lucide-react'

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2500)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4" style={{ background: '#0c1d48' }}>
      <div className="flex items-center gap-2">
        <Sparkles className="text-blue-300" size={28} />
        <span className="text-2xl font-bold tracking-tight text-white">Lightforth</span>
      </div>
      <p className="text-sm text-white/50">AI-powered job search</p>
    </div>
  )
}
