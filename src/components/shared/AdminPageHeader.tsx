import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TimelineFilter, type TimePeriod } from '@/components/shared/TimelineFilter'

interface AdminPageHeaderAction {
  label: string
  icon?: LucideIcon
  onClick?: () => void
  variant?: 'primary' | 'outline'
}

interface AdminBreadcrumbItem {
  label: string
  to?: string
  onClick?: () => void
}

interface AdminTabItem {
  key: string
  label: string
}

interface AdminPageHeaderProps {
  title: string
  subtitle?: string
  /** Small pill rendered next to the title, e.g. a plan name. */
  badge?: string
  badgeClassName?: string
  /** Leading trail, e.g. Users / Enterprises, or a "← Back to X" crumb. Last item is the current page. */
  breadcrumb?: AdminBreadcrumbItem[]
  /** Primary/secondary buttons — the only thing that sits top-right, next to the title. */
  actions?: AdminPageHeaderAction[]
  /** Extra inline content rendered alongside the actions, e.g. an "Unsaved changes" pill. */
  extra?: React.ReactNode
  period?: TimePeriod
  onPeriodChange?: (period: TimePeriod) => void
  /** Secondary content tabs (e.g. Overview / Sessions / Settings), rendered as a single minimal underline row below the timeline filter. */
  tabs?: AdminTabItem[]
  activeTab?: string
  onTabChange?: (key: string) => void
}

/**
 * Standard admin page header: breadcrumb, then title + subtitle with the
 * primary action(s) pinned top-right, then the timeline filter on its own
 * row, then — if the page has sub-views — a single minimal tab row.
 */
export function AdminPageHeader({
  title,
  subtitle,
  badge,
  badgeClassName,
  breadcrumb,
  actions,
  extra,
  period,
  onPeriodChange,
  tabs,
  activeTab,
  onTabChange,
}: AdminPageHeaderProps) {
  return (
    <div className="space-y-4">
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {breadcrumb.map((crumb, i) => {
            const isLast = i === breadcrumb.length - 1
            return (
              <span key={crumb.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                {isLast ? (
                  <span className="font-medium text-foreground">{crumb.label}</span>
                ) : crumb.to ? (
                  <Link to={crumb.to} className="transition-colors hover:text-foreground">
                    {crumb.label}
                  </Link>
                ) : (
                  <button onClick={crumb.onClick} className="transition-colors hover:text-foreground">
                    {crumb.label}
                  </button>
                )}
              </span>
            )
          })}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="lf-page-title">{title}</h1>
            {badge && <span className={badgeClassName ?? 'rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary'}>{badge}</span>}
          </div>
          {subtitle && <p className="lf-body mt-0.5">{subtitle}</p>}
        </div>
        {(actions?.length || extra) && (
          <div className="flex flex-wrap items-center gap-3">
            {extra}
            {actions?.map(({ label, icon: Icon, onClick, variant = 'primary' }) => (
              <button key={label} onClick={onClick} className={variant === 'primary' ? 'lf-btn' : 'lf-btn-outline'}>
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {period && onPeriodChange && <TimelineFilter value={period} onChange={onPeriodChange} />}

      {tabs && tabs.length > 0 && (
        <div className="lf-tabs">
          {tabs.map(t => (
            <button key={t.key} onClick={() => onTabChange?.(t.key)} className={cn('lf-tab', activeTab === t.key && 'lf-tab-active')}>
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
