import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Target,
  Headphones,
  Compass,
  Download,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  ShieldCheck,
  BookOpen,
  Layers,
  Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import UpgradeCard from '@/components/shared/UpgradeCard'
import LightforthLogo from '@/components/shared/LightforthLogo'
import { useAuth } from '@/hooks/useAuth'

const DOCS_SUB_NAV = [
  { to: '/documents', icon: BookOpen, label: 'Resumes', end: true },
  { to: '/documents/context', icon: Layers, label: 'Context' },
]

const PRIMARY_NAV = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/app/auto-apply', icon: Briefcase, label: 'Auto-Apply', requiresPlan: true },
  { to: '/app/interview-prep', icon: Target, label: 'Interview Prep', requiresPlan: true },
  { to: '/interview-copilot', icon: Headphones, label: 'Interview Co-Pilot' },
]

const SECONDARY_NAV = [
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/downloads', icon: Download, label: 'Downloads' },
  { to: '/billing', icon: CreditCard, label: 'Billing & subscription' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

const ADMIN_NAV = [
  { to: '/admin', icon: ShieldCheck, label: 'Admin' },
]

function NavItem({
  to,
  icon: Icon,
  label,
  end,
  locked,
}: {
  to: string
  icon: React.ElementType
  label: string
  end?: boolean
  locked?: boolean
}) {
  if (locked) {
    return (
      <NavLink
        to="/billing"
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground/60 hover:bg-muted"
        title={`Upgrade to Pro or Premium to unlock ${label}`}
      >
        <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground/50" />
        <span className="flex-1 truncate">{label}</span>
        <Lock className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/50" />
      </NavLink>
    )
  }

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary/5 text-primary'
            : 'text-foreground hover:bg-muted',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-4 w-4 flex-shrink-0',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )}
          />
          <span className="flex-1 truncate">{label}</span>
        </>
      )}
    </NavLink>
  )
}

function DocsNavGroup() {
  const location = useLocation()
  const isDocsActive = location.pathname.startsWith('/documents')
  const [open, setOpen] = useState(isDocsActive)

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isDocsActive ? 'bg-primary/5 text-primary' : 'text-foreground hover:bg-muted',
        )}
      >
        <FileText className={cn('h-4 w-4 flex-shrink-0', isDocsActive ? 'text-primary' : 'text-muted-foreground')} />
        <span className="flex-1 truncate text-left">My Documents</span>
        {open
          ? <ChevronDown className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
          : <ChevronRight className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
        }
      </button>

      {open && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
          {DOCS_SUB_NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
                  isActive ? 'bg-primary/5 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn('h-3.5 w-3.5 flex-shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

const NAV_ITEMS = [...PRIMARY_NAV, ...SECONDARY_NAV]

function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth()
  const hasCopilotAppAccess = user?.plan === 'pro' || user?.plan === 'premium'

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <LightforthLogo to="/app" className="h-7" />
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-muted" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2">
          <NavItem {...PRIMARY_NAV[0]} />
          <DocsNavGroup />
          {PRIMARY_NAV.slice(1).map((item) => (
            <NavItem key={item.to} {...item} locked={item.requiresPlan && !hasCopilotAppAccess} />
          ))}

          <div className="my-2 border-t border-border" />

          {SECONDARY_NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}

          <div className="my-2 border-t border-border" />

          <NavLink
            to="/how-to-use"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-primary/5 text-primary' : 'text-foreground hover:bg-muted',
              )
            }
          >
            <span className="flex h-5 w-7 flex-shrink-0 items-center justify-center rounded bg-red-600">
              <span className="border-y-[5px] border-l-[8px] border-y-transparent border-l-white" />
            </span>
            How to use
          </NavLink>

          <div className="my-2 border-t border-border" />

          {ADMIN_NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="p-3">
          <UpgradeCard />
        </div>
      </aside>
    </>
  )
}

export { NAV_ITEMS, MobileSidebar }

export default function Sidebar() {
  const { user } = useAuth()
  const hasCopilotAppAccess = user?.plan === 'pro' || user?.plan === 'premium'

  return (
    <aside className="hidden h-screen w-56 flex-shrink-0 flex-col border-r border-border bg-white md:flex">
      <div className="flex h-14 items-center gap-2 px-4">
        <LightforthLogo to="/app" className="h-7" />
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2">
        <NavItem {...PRIMARY_NAV[0]} />
        <DocsNavGroup />
        {PRIMARY_NAV.slice(1).map((item) => (
          <NavItem key={item.to} {...item} locked={item.requiresPlan && !hasCopilotAppAccess} />
        ))}

        <div className="my-2 border-t border-border" />

        {SECONDARY_NAV.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <div className="my-2 border-t border-border" />

        <NavLink
          to="/how-to-use"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive ? 'bg-primary/5 text-primary' : 'text-foreground hover:bg-muted',
            )
          }
        >
          <span className="flex h-5 w-7 flex-shrink-0 items-center justify-center rounded bg-red-600">
            <span className="border-y-[5px] border-l-[8px] border-y-transparent border-l-white" />
          </span>
          How to use
        </NavLink>

        <div className="my-2 border-t border-border" />

        {ADMIN_NAV.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      <div className="p-3">
        <UpgradeCard />
      </div>
    </aside>
  )
}
