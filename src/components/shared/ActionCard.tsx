import { Link } from 'react-router-dom'
import { ArrowRight, type LucideIcon } from 'lucide-react'

interface Props {
  Icon: LucideIcon
  title: string
  description: string
  to: string
  active?: boolean
  badge?: string
}

export default function ActionCard({ Icon, title, description, to, badge }: Props) {
  return (
    <Link
      to={to}
      className="flex min-h-40 flex-col rounded-2xl border border-border bg-white p-5 transition-all hover:border-primary/30 hover:shadow-sm"
    >
      <Icon className="mb-3 h-5 w-5 text-primary" />
      <p className="mb-1.5 flex flex-wrap items-center gap-1 text-sm font-semibold text-primary">
        <span>{title}</span>
        <ArrowRight className="h-3.5 w-3.5" />
        {badge && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            {badge}
          </span>
        )}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
    </Link>
  )
}
