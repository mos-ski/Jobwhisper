import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { JobwhisperMark } from '@/ui'

export default function JobwhisperLogo({
  className,
  linked = true,
  to = '/',
}: {
  className?: string
  linked?: boolean
  to?: string
}) {
  const logo = <JobwhisperMark className={cn('h-8 w-auto text-accent', className)} />

  if (!linked) return logo

  return (
    <Link to={to} aria-label="Go to dashboard" className="inline-flex items-center">
      {logo}
    </Link>
  )
}
