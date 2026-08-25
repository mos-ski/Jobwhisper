import { ArrowRight, Briefcase, Sparkles } from 'lucide-react'
import type { MockNotification } from './mockData'
import type { ActiveTab } from '../MobileAppPreview'

export function HomeScreen({ notifications, onNavigate }: { notifications: MockNotification[]; onNavigate: (tab: ActiveTab) => void }) {
  const recent = notifications.slice(0, 3)

  return (
    <div className="flex flex-col gap-5 bg-white p-5">
      {/* Greeting header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">Good afternoon,</p>
          <h1 className="text-xl font-semibold text-neutral-900">Darnell</h1>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white">
          DS
        </div>
      </div>

      {/* Credit balance card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-500">Credit balance</p>
            <p className="mt-1 text-lg font-semibold text-neutral-900">2 credits remaining</p>
          </div>
          {/* No billing screen in this prototype — Top up routes to Copilot as a stand-in */}
          <button
            onClick={() => onNavigate('copilot')}
            className="rounded-full bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
          >
            Top up
          </button>
        </div>
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full w-1/3 rounded-full bg-[#2563EB]" />
          </div>
          <p className="mt-2 text-xs text-neutral-400">2 of 6 credits used this month</p>
        </div>
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('copilot')}
          className="flex flex-col items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-[#2563EB]/40"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2563EB]">
            <Sparkles size={18} />
          </span>
          <span className="text-sm font-semibold text-neutral-900">Start Copilot session</span>
          <span className="flex items-center gap-1 text-xs font-medium text-[#2563EB]">
            Get started <ArrowRight size={14} />
          </span>
        </button>

        <button
          onClick={() => onNavigate('jobs')}
          className="flex flex-col items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-[#2563EB]/40"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2563EB]">
            <Briefcase size={18} />
          </span>
          <span className="text-sm font-semibold text-neutral-900">Browse jobs</span>
          <span className="flex items-center gap-1 text-xs font-medium text-[#2563EB]">
            View matches <ArrowRight size={14} />
          </span>
        </button>
      </div>

      {/* Recent activity */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-neutral-900">Recent activity</h2>
        <div className="flex flex-col">
          {recent.map((notification, index) => (
            <button
              key={notification.id}
              onClick={() => onNavigate('notifications')}
              className={`flex items-center justify-between gap-3 py-3 text-left transition-colors hover:bg-neutral-50 ${
                index !== recent.length - 1 ? 'border-b border-neutral-100' : ''
              }`}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-neutral-900">{notification.title}</p>
                <p className="text-xs text-neutral-400">{notification.timestamp}</p>
              </div>
              <ArrowRight size={16} className="flex-shrink-0 text-neutral-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
