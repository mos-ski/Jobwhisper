import { Sparkles, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function UpgradeCard() {
  const navigate = useNavigate()

  return (
    <div className="rounded-xl bg-gradient-to-b from-[#1E3A5F] to-[#1D4ED8] p-4 text-white">
      <div className="mb-2 flex items-center gap-1">
        <Sparkles className="h-4 w-4" />
        <span className="text-sm">✦</span>
      </div>
      <p className="mb-1 text-sm font-semibold">Upgrade to Premium!</p>
      <p className="mb-3 text-xs leading-relaxed text-blue-200">
        You're currently on a starter credit. Upgrade to Premium to unlock more credits and get the
        most out of Lightforth's tools.
      </p>
      <button
        onClick={() => navigate('/billing')}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-primary hover:bg-blue-50 transition-colors"
      >
        <User className="h-3.5 w-3.5" />
        Upgrade Now
      </button>
    </div>
  )
}
