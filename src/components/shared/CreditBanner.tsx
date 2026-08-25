import { useState } from 'react'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

export default function CreditBanner({ className }: Props) {
  const [dismissed, setDismissed] = useState(false)
  const navigate = useNavigate()

  if (dismissed) return null

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg bg-muted px-4 py-2.5 text-sm',
        className,
      )}
    >
      <span className="text-muted-foreground">0 credits remaining today</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/billing')}
          className="font-medium text-foreground hover:underline"
        >
          Upgrade
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
