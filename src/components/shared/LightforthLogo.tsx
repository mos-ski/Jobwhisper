import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export default function LightforthLogo({
  className,
  linked = true,
  to = '/',
}: {
  className?: string
  linked?: boolean
  to?: string
}) {
  const logo = (
    <img
      src="/logo-B1uc6Mmo.svg"
      alt="Lightforth"
      className={cn('h-8 w-auto object-contain', className)}
    />
  )

  if (!linked) return logo

  return (
    <Link to={to} aria-label="Go to dashboard" className="inline-flex items-center">
      {logo}
    </Link>
  )
}
