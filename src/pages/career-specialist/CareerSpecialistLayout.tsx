import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, User, ClipboardList, Briefcase, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import LightforthLogo from '@/components/shared/LightforthLogo'

const NAV = [
  { to: '/career-specialist',               label: 'Overview',          icon: LayoutDashboard, end: true },
  { to: '/career-specialist/specialists',   label: 'All Specialists',   icon: Users },
  { to: '/career-specialist/students',      label: 'All Students',      icon: User },
  { to: '/career-specialist/applications',  label: 'All Applications',  icon: ClipboardList },
  { to: '/career-specialist/jobs',          label: 'Jobs',              icon: Briefcase },
  { to: '/career-specialist/settings',      label: 'Settings',          icon: Settings },
]

export default function CareerSpecialistLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-[220px] shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
          <LightforthLogo className="h-6" />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-100 px-3 py-4">
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-h-screen bg-gray-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
