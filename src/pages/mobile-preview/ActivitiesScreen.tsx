import { useState } from 'react'
import { Bell, Briefcase, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_NOTIFICATIONS, type MockNotification, type NotificationCategory } from './mockData'

const CATEGORY_META: Record<NotificationCategory, { label: string; icon: typeof Bell }> = {
  applications: { label: 'Application Updates', icon: Briefcase },
  matches: { label: 'Job Matches', icon: Bell },
  account: { label: 'Account & Credits', icon: CreditCard },
}

export function ActivitiesScreen() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const groups = (Object.keys(CATEGORY_META) as NotificationCategory[])
    .map((cat) => ({ cat, items: notifications.filter((n) => n.category === cat) }))
    .filter((g) => g.items.length > 0)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => setNotifications((list) => list.map((n) => ({ ...n, read: true })))
  const toggleRead = (id: string) => setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read: !n.read } : n)))

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pb-1 pt-4">
        <h1 className="text-xl font-bold text-neutral-900">Activities</h1>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs font-medium text-[#2563EB]">Mark all read</button>
        )}
      </div>
      <div className="flex items-center gap-2 px-5 pb-3">
        <span className={cn('h-2 w-2 rounded-full', unreadCount > 0 ? 'bg-[#2563EB]' : 'bg-neutral-300')} />
        <span className="text-xs text-neutral-400">{unreadCount} unread activity</span>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-4">
        {groups.map(({ cat, items }) => {
          const Icon = CATEGORY_META[cat].icon
          return (
            <div key={cat}>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                <Icon size={12} />{CATEGORY_META[cat].label}
              </div>
              <div className="space-y-2">
                {items.map((n) => (
                  <button key={n.id} onClick={() => toggleRead(n.id)} className={cn('block w-full rounded-xl border p-3 text-left transition-colors', n.read ? 'border-neutral-200 bg-white' : 'border-[#2563EB]/30 bg-[#EEF4FF]')}>
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('text-sm', n.read ? 'text-neutral-600' : 'font-medium text-neutral-900')}>{n.title}</p>
                      {!n.read && <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#2563EB]" />}
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">{n.body}</p>
                    <p className="mt-1 text-[11px] text-neutral-400">{n.timestamp}</p>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
