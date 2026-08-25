import { useState, type Dispatch, type SetStateAction } from 'react'
import { ArrowLeft, Bell, Briefcase, CreditCard, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Toggle } from './PhoneFrame'
import type { MockNotification, NotificationCategory } from './mockData'

type NotificationsView = { name: 'centre' } | { name: 'preferences' }
type MatchFrequency = 'immediately' | 'daily' | 'weekly'

const FREQUENCIES: { id: MatchFrequency; label: string }[] = [
  { id: 'immediately', label: 'Immediately' },
  { id: 'daily', label: 'Daily digest' },
  { id: 'weekly', label: 'Weekly digest' },
]

const CATEGORY_META: Record<NotificationCategory, { label: string; icon: typeof Bell }> = {
  applications: { label: 'Application Updates', icon: Briefcase },
  matches: { label: 'Job Matches', icon: Bell },
  account: { label: 'Account & Credits', icon: CreditCard },
}

interface NotificationsModuleProps {
  notifications: MockNotification[]
  onNotificationsChange: Dispatch<SetStateAction<MockNotification[]>>
}

export function NotificationsModule({ notifications, onNotificationsChange }: NotificationsModuleProps) {
  const [view, setView] = useState<NotificationsView>({ name: 'centre' })

  const markAllRead = () => onNotificationsChange((list) => list.map((n) => ({ ...n, read: true })))
  const markRead = (id: string) => onNotificationsChange((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)))

  if (view.name === 'preferences') return <PreferencesScreen onBack={() => setView({ name: 'centre' })} />

  const groups = (Object.keys(CATEGORY_META) as NotificationCategory[]).map((cat) => ({
    cat,
    items: notifications.filter((n) => n.category === cat),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between px-5 pb-2 pt-4">
        <h1 className="text-xl font-semibold text-neutral-900">Notifications</h1>
        <button onClick={() => setView({ name: 'preferences' })}><Settings size={18} className="text-neutral-400" /></button>
      </header>
      <div className="flex items-center justify-between px-5 pb-2">
        <span className="text-xs text-neutral-400">{notifications.filter((n) => !n.read).length} unread</span>
        <button onClick={markAllRead} className="text-xs font-medium text-[#2563EB]">Mark all as read</button>
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
                  <button key={n.id} onClick={() => markRead(n.id)} className={cn('block w-full rounded-xl border p-3 text-left', n.read ? 'border-neutral-200 bg-white' : 'border-[#2563EB]/30 bg-[#2563EB]/5')}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-neutral-900">{n.title}</p>
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

function PreferencesScreen({ onBack }: { onBack: () => void }) {
  const [appPush, setAppPush] = useState(true)
  const [appEmail, setAppEmail] = useState(true)
  const [matchPush, setMatchPush] = useState(true)
  const [matchFrequency, setMatchFrequency] = useState<MatchFrequency>('daily')
  const [matchEmail, setMatchEmail] = useState(false)
  const [accountPush, setAccountPush] = useState(true)
  const [quietStart, setQuietStart] = useState('22:00')
  const [quietEnd, setQuietEnd] = useState('08:00')

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="text-base font-semibold text-neutral-900">Notification settings</h1>
      </header>
      <div className="flex-1 space-y-6 overflow-y-auto px-5 pb-6">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Application Updates</h2>
          <div className="mt-2 space-y-3 rounded-xl border border-neutral-200 p-3">
            <Row label="Push notifications" control={<Toggle on={appPush} onToggle={() => setAppPush((v) => !v)} />} />
            <Row label="Email alerts" control={<Toggle on={appEmail} onToggle={() => setAppEmail((v) => !v)} />} />
          </div>
        </section>
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Job Matches</h2>
          <div className="mt-2 space-y-3 rounded-xl border border-neutral-200 p-3">
            <Row label="Push notifications" control={<Toggle on={matchPush} onToggle={() => setMatchPush((v) => !v)} />} />
            <div>
              <p className="mb-2 text-sm text-neutral-700">Frequency</p>
              <div className="flex gap-2">
                {FREQUENCIES.map((f) => (
                  <button key={f.id} onClick={() => setMatchFrequency(f.id)} className={cn('rounded-full border px-3 py-1.5 text-xs font-medium', matchFrequency === f.id ? 'border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]' : 'border-neutral-200 text-neutral-500')}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <Row label="Email digest" control={<Toggle on={matchEmail} onToggle={() => setMatchEmail((v) => !v)} />} />
          </div>
        </section>
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Account & Credits</h2>
          <div className="mt-2 rounded-xl border border-neutral-200 p-3">
            <Row label="Push notifications" control={<Toggle on={accountPush} onToggle={() => setAccountPush((v) => !v)} />} />
          </div>
        </section>
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Quiet Hours</h2>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-neutral-200 p-3 text-sm">
            <label className="flex flex-1 flex-col gap-1 text-xs text-neutral-500">
              Start
              <input type="time" value={quietStart} onChange={(e) => setQuietStart(e.target.value)} className="rounded-lg border border-neutral-200 px-2 py-1.5 text-sm text-neutral-900" />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-xs text-neutral-500">
              End
              <input type="time" value={quietEnd} onChange={(e) => setQuietEnd(e.target.value)} className="rounded-lg border border-neutral-200 px-2 py-1.5 text-sm text-neutral-900" />
            </label>
          </div>
          <p className="mt-1 text-xs text-neutral-400">No notifications between {quietStart} and {quietEnd} in your local timezone.</p>
        </section>
      </div>
    </div>
  )
}

function Row({ label, control }: { label: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-neutral-700">{label}</span>
      {control}
    </div>
  )
}
