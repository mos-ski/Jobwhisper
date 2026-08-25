import { useState } from 'react'
import { TrendingUp, ArrowUpRight, Video, Clock, Users, Zap, MessageSquare, Eye, EyeOff, ChevronRight, Shield, ArrowUpCircle, FileText, Settings, X } from 'lucide-react'
import { useSort } from '@/hooks/useSort'
import { SortableHeader } from '@/components/shared/SortableHeader'
import type { TimePeriod } from '@/components/shared/TimelineFilter'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'
import { AdminDetailModal } from '@/components/shared/AdminDetailModal'

const MEETINGS = [
  { id: 'm1', user: 'Darnell Smith', title: 'Q3 Sprint Planning', speakers: 5, duration: 42, style: 'Headlines', answerLength: 'Medium', actionItems: 8, stealthUsed: true, transcriptViewed: true, autoRespond: false, contextDocs: 3, status: 'completed', time: '2 hr ago', plan: 'Premium' },
  { id: 'm2', user: 'Jessica Williams', title: 'Client Check-in — Acme Corp', speakers: 3, duration: 28, style: 'Default', answerLength: 'Long', actionItems: 4, stealthUsed: true, transcriptViewed: true, autoRespond: false, contextDocs: 1, status: 'completed', time: '3 hr ago', plan: 'Premium' },
  { id: 'm3', user: 'Omar Khan', title: 'Product Roadmap Review', speakers: 6, duration: 55, style: 'Coaching', answerLength: 'Short', actionItems: 12, stealthUsed: false, transcriptViewed: false, autoRespond: true, contextDocs: 5, status: 'completed', time: '5 hr ago', plan: 'Premium' },
  { id: 'm4', user: 'Sarah Johnson', title: '1:1 with Manager', speakers: 2, duration: 20, style: 'Default', answerLength: 'Medium', actionItems: 2, stealthUsed: false, transcriptViewed: true, autoRespond: false, contextDocs: 0, status: 'completed', time: '1 day ago', plan: 'Premium' },
  { id: 'm5', user: 'Carlos Rodriguez', title: 'Engineering Standup', speakers: 8, duration: 15, style: 'Headlines', answerLength: 'Short', actionItems: 6, stealthUsed: true, transcriptViewed: false, autoRespond: true, contextDocs: 0, status: 'completed', time: '1 day ago', plan: 'Premium' },
  { id: 'm6', user: 'Aisha Davis', title: 'Stakeholder Demo', speakers: 4, duration: 38, style: 'Default', answerLength: 'Long', actionItems: 5, stealthUsed: true, transcriptViewed: true, autoRespond: false, contextDocs: 2, status: 'completed', time: '2 days ago', plan: 'Premium' },
]

const UPSELL_EVENTS = [
  { id: 'u1', user: 'Marcus Chen', trigger: 'Meeting tab clicked', fromPlan: 'Pro', toPlan: 'Premium', converted: true, time: '3 hr ago' },
  { id: 'u2', user: 'Tyler Washington', trigger: 'Meeting setup opened', fromPlan: 'Pro', toPlan: 'Premium', converted: true, time: '6 hr ago' },
  { id: 'u3', user: 'Priya Patel', trigger: 'Meeting tab clicked', fromPlan: 'Pro', toPlan: 'Premium', converted: false, time: '1 day ago' },
  { id: 'u4', user: 'Mia Garcia', trigger: 'Premium gate shown', fromPlan: 'Starter', toPlan: 'Premium', converted: false, time: '2 days ago' },
]

const SPEAKER_DIST = [
  { speakers: '2', sessions: 423, pct: 18, label: '1:1' },
  { speakers: '3-4', sessions: 892, pct: 38, label: 'Small Team' },
  { speakers: '5-6', sessions: 634, pct: 27, label: 'Medium Team' },
  { speakers: '7+', sessions: 398, pct: 17, label: 'Large Meeting' },
]

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700',
  abandoned: 'bg-red-50 text-red-600',
}

export default function AdminMeeting() {
  const [tab, setTab] = useState<'overview' | 'sessions' | 'upsell' | 'settings'>('overview')
  const [period, setPeriod] = useState<TimePeriod>('12m')
  const [selectedRow, setSelectedRow] = useState<typeof MEETINGS[number] | null>(null)
  const [selectedUpsell, setSelectedUpsell] = useState<typeof UPSELL_EVENTS[number] | null>(null)

  const transcriptRate = Math.round((MEETINGS.filter(m => m.transcriptViewed).length / MEETINGS.length) * 100)
  const stealthRate = Math.round((MEETINGS.filter(m => m.stealthUsed).length / MEETINGS.length) * 100)

  const { sortKey: mSortKey, sortDirection: mSortDirection, toggleSort: mToggleSort, sorted: sortedMeetings } = useSort({ data: MEETINGS })
  const { sortKey: uSortKey, sortDirection: uSortDirection, toggleSort: uToggleSort, sorted: sortedUpsell } = useSort({ data: UPSELL_EVENTS })

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Meeting"
        subtitle="Premium-only Copilot for professional meetings — multi-speaker, action items, transcript review"
        period={period}
        onPeriodChange={setPeriod}
        tabs={[
          { key: 'overview', label: 'Overview' },
          { key: 'sessions', label: 'Sessions' },
          { key: 'upsell', label: 'Pro→Premium Upsell' },
          { key: 'settings', label: 'Settings' },
        ]}
        activeTab={tab}
        onTabChange={v => setTab(v as typeof tab)}
      />

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Total Sessions', value: '1,847', icon: Video, change: '+22.4%' },
              { label: 'Avg Duration', value: '32m', icon: Clock, change: '+4m' },
              { label: 'Action Items Created', value: '3,421', icon: Zap, change: '+420' },
              { label: 'Active Users', value: '312', icon: Users, change: '+48' },
            ].map(({ label, value, icon: Icon, change }) => (
              <div key={label} className="lf-panel p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-1.5 text-2xl font-bold text-foreground">{value}</p>
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 mt-1">
                  <ArrowUpRight className="h-3 w-3" />{change}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Transcript Viewed', value: `${transcriptRate}%`, desc: 'of sessions' },
              { label: 'Stealth Mode Used', value: `${stealthRate}%`, desc: 'of sessions' },
              { label: 'Auto-Respond On', value: '25%', desc: 'of sessions' },
              { label: 'Pro→Premium Converts', value: '67%', desc: 'of upsell triggers' },
            ].map(({ label, value, desc }) => (
              <div key={label} className="lf-panel p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-bold text-foreground mt-1">{value}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Speaker Distribution */}
            <div className="lf-panel p-6">
              <p className="lf-card-title mb-4">Meeting Size Distribution</p>
              <div className="space-y-3">
                {SPEAKER_DIST.map(s => (
                  <div key={s.speakers}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{s.label} ({s.speakers} speakers)</span>
                      <span className="text-xs text-muted-foreground">{s.sessions} · {s.pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-[10px] text-muted-foreground">Multi-speaker detection automatically labels all attendees in the transcript.</p>
              </div>
            </div>

            {/* Upsell Summary */}
            <div className="lf-panel p-6">
              <p className="lf-card-title mb-4">Premium Upsell (Pro → Premium)</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">847</p>
                  <p className="text-[10px] text-muted-foreground">Total Triggers</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-600">568</p>
                  <p className="text-[10px] text-muted-foreground">Converted (67%)</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Meeting tab clicked (Pro)</span>
                  <span className="font-medium">412 triggers</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Meeting setup opened (Pro)</span>
                  <span className="font-medium">289 triggers</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Premium gate shown (Starter/Non-subscriber)</span>
                  <span className="font-medium">146 triggers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Meetings */}
          <div className="lf-panel overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="lf-card-title">Recent Meetings</p>
            </div>
            <div className="overflow-x-auto">
              <table className="lf-table">
                <thead className="lf-table-head">
                  <tr>
                    <SortableHeader label="User" sortKey="user" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                    <SortableHeader label="Meeting Title" sortKey="title" className="hidden md:table-cell" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                    <SortableHeader label="Speakers" sortKey="speakers" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                    <SortableHeader label="Duration" sortKey="duration" className="hidden sm:table-cell" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                    <SortableHeader label="Style" sortKey="style" className="hidden lg:table-cell" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                    <SortableHeader label="Action Items" sortKey="actionItems" className="hidden lg:table-cell" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                    <SortableHeader label="Stealth" sortKey="stealthUsed" className="hidden lg:table-cell" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                    <SortableHeader label="Transcript" sortKey="transcriptViewed" className="hidden lg:table-cell" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                    <SortableHeader label="Status" sortKey="status" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                  </tr>
                </thead>
                <tbody>
                  {sortedMeetings.map(m => (
                    <tr key={m.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedRow(m)}>
                      <td className="lf-table-cell font-medium text-foreground">{m.user}</td>
                      <td className="lf-table-cell hidden md:table-cell text-xs text-muted-foreground truncate max-w-[180px]">{m.title}</td>
                      <td className="lf-table-cell tabular-nums text-sm">{m.speakers}</td>
                      <td className="lf-table-cell hidden sm:table-cell tabular-nums text-sm">{m.duration}m</td>
                      <td className="lf-table-cell hidden lg:table-cell"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{m.style}</span></td>
                      <td className="lf-table-cell hidden lg:table-cell tabular-nums font-semibold">{m.actionItems}</td>
                      <td className="lf-table-cell hidden lg:table-cell">{m.stealthUsed ? <EyeOff className="h-3.5 w-3.5 text-emerald-500" /> : <Eye className="h-3.5 w-3.5 text-muted-foreground/30" />}</td>
                      <td className="lf-table-cell hidden lg:table-cell">{m.transcriptViewed ? <FileText className="h-3.5 w-3.5 text-blue-500" /> : <span className="text-muted-foreground/30">—</span>}</td>
                      <td className="lf-table-cell"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[m.status]}`}>{m.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'sessions' && (
        <div className="lf-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="lf-table">
              <thead className="lf-table-head">
                <tr>
                  <SortableHeader label="User" sortKey="user" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                  <SortableHeader label="Title" sortKey="title" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                  <SortableHeader label="Speakers" sortKey="speakers" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                  <SortableHeader label="Duration" sortKey="duration" className="hidden sm:table-cell" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                  <SortableHeader label="Style" sortKey="style" className="hidden md:table-cell" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                  <SortableHeader label="Length" sortKey="answerLength" className="hidden md:table-cell" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                  <SortableHeader label="Action Items" sortKey="actionItems" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                  <SortableHeader label="Stealth" sortKey="stealthUsed" className="hidden lg:table-cell" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                  <SortableHeader label="Auto" sortKey="autoRespond" className="hidden lg:table-cell" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                  <SortableHeader label="Context" sortKey="contextDocs" className="hidden lg:table-cell" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                  <SortableHeader label="Transcript" sortKey="transcriptViewed" className="hidden lg:table-cell" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                  <SortableHeader label="Status" sortKey="status" activeSortKey={mSortKey} sortDirection={mSortDirection} onToggleSort={mToggleSort} />
                </tr>
              </thead>
              <tbody>
                {sortedMeetings.map(m => (
                  <tr key={m.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedRow(m)}>
                    <td className="lf-table-cell font-medium text-foreground">{m.user}</td>
                    <td className="lf-table-cell text-xs text-muted-foreground truncate max-w-[160px]">{m.title}</td>
                    <td className="lf-table-cell tabular-nums text-sm">{m.speakers}</td>
                    <td className="lf-table-cell hidden sm:table-cell tabular-nums text-sm">{m.duration}m</td>
                    <td className="lf-table-cell hidden md:table-cell"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{m.style}</span></td>
                    <td className="lf-table-cell hidden md:table-cell text-xs text-muted-foreground">{m.answerLength}</td>
                    <td className="lf-table-cell tabular-nums font-semibold">{m.actionItems}</td>
                    <td className="lf-table-cell hidden lg:table-cell">{m.stealthUsed ? <EyeOff className="h-3.5 w-3.5 text-emerald-500" /> : <Eye className="h-3.5 w-3.5 text-muted-foreground/30" />}</td>
                    <td className="lf-table-cell hidden lg:table-cell text-xs text-muted-foreground">{m.autoRespond ? 'Auto' : 'Manual'}</td>
                    <td className="lf-table-cell hidden lg:table-cell tabular-nums text-sm">{m.contextDocs}</td>
                    <td className="lf-table-cell hidden lg:table-cell">{m.transcriptViewed ? <FileText className="h-3.5 w-3.5 text-blue-500" /> : '—'}</td>
                    <td className="lf-table-cell"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[m.status]}`}>{m.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'upsell' && (
        <div className="lf-panel overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <p className="lf-card-title">Pro → Premium Upsell Events</p>
            <p className="lf-body text-xs mt-0.5">Meeting is the Premium upsell lever — track when Pro users hit the gate</p>
          </div>
          <div className="overflow-x-auto">
            <table className="lf-table">
              <thead className="lf-table-head">
                <tr>
                  <SortableHeader label="User" sortKey="user" activeSortKey={uSortKey} sortDirection={uSortDirection} onToggleSort={uToggleSort} />
                  <SortableHeader label="Trigger" sortKey="trigger" activeSortKey={uSortKey} sortDirection={uSortDirection} onToggleSort={uToggleSort} />
                  <SortableHeader label="From Plan" sortKey="fromPlan" className="hidden sm:table-cell" activeSortKey={uSortKey} sortDirection={uSortDirection} onToggleSort={uToggleSort} />
                  <SortableHeader label="To Plan" sortKey="toPlan" className="hidden sm:table-cell" activeSortKey={uSortKey} sortDirection={uSortDirection} onToggleSort={uToggleSort} />
                  <SortableHeader label="Converted" sortKey="converted" activeSortKey={uSortKey} sortDirection={uSortDirection} onToggleSort={uToggleSort} />
                  <SortableHeader label="Time" sortKey="time" className="hidden sm:table-cell" activeSortKey={uSortKey} sortDirection={uSortDirection} onToggleSort={uToggleSort} />
                </tr>
              </thead>
              <tbody>
                {sortedUpsell.map(u => (
                  <tr key={u.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedUpsell(u)}>
                    <td className="lf-table-cell font-medium text-foreground">{u.user}</td>
                    <td className="lf-table-cell text-xs text-muted-foreground">{u.trigger}</td>
                    <td className="lf-table-cell hidden sm:table-cell"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{u.fromPlan}</span></td>
                    <td className="lf-table-cell hidden sm:table-cell"><span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">{u.toPlan}</span></td>
                    <td className="lf-table-cell">
                      {u.converted ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Converted</span>
                      ) : (
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">Dismissed</span>
                      )}
                    </td>
                    <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{u.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="lf-panel p-6 max-w-2xl space-y-4">
          <p className="lf-card-title">Meeting Configuration</p>
          {[
            { label: 'Meeting Enabled (Premium Only)', desc: 'Only Premium plan users can access Meeting', checked: true },
            { label: 'Pro Upgrade Prompt', desc: 'Show upgrade prompt when Pro users click Meeting tab', checked: true },
            { label: 'Multi-Speaker Detection', desc: 'Automatically detect and label meeting attendees', checked: true },
            { label: 'AI Meeting Notes', desc: 'Auto-generate meeting notes and summary', checked: true },
            { label: 'Action Item Tracking', desc: 'Extract and track action items from meetings', checked: true },
            { label: 'Stealth Mode Default', desc: 'Hide Copilot from screen share by default', checked: true },
            { label: 'Transcript Saving', desc: 'Save meeting transcripts for review', checked: true },
            { label: 'Transcript Retention (days)', desc: 'Auto-delete transcripts after this period', value: '90' },
            { label: 'Max Participants', desc: 'Maximum speakers detected per meeting', value: '12' },
            { label: 'Max Duration (min)', desc: 'Maximum meeting length', value: '120' },
            { label: 'AI Response Latency Target (ms)', desc: 'Target response time', value: '1500' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              {'checked' in item ? (
                <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${item.checked ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                  <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${item.checked ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              ) : (
                <input defaultValue={item.value} className="lf-input w-20 h-8 text-sm text-center" />
              )}
            </div>
          ))}
        </div>
      )}
      {selectedRow && (
        <AdminDetailModal
          title={selectedRow.title}
          subtitle={selectedRow.user}
          onClose={() => setSelectedRow(null)}
          fields={[
            { label: 'Plan', value: selectedRow.plan },
            { label: 'Speakers', value: selectedRow.speakers },
            { label: 'Duration', value: `${selectedRow.duration}m` },
            { label: 'Response Style', value: selectedRow.style },
            { label: 'Answer Length', value: selectedRow.answerLength },
            { label: 'Action Items', value: selectedRow.actionItems },
            { label: 'Stealth Used', value: selectedRow.stealthUsed ? 'Yes' : 'No' },
            { label: 'Transcript Viewed', value: selectedRow.transcriptViewed ? 'Yes' : 'No' },
            { label: 'Auto Respond', value: selectedRow.autoRespond ? 'On' : 'Off' },
            { label: 'Context Docs', value: selectedRow.contextDocs },
            { label: 'Status', value: selectedRow.status },
            { label: 'Time', value: selectedRow.time },
          ]}
        />
      )}
      {selectedUpsell && (
        <AdminDetailModal
          title={`${selectedUpsell.user} Upsell Event`}
          subtitle={selectedUpsell.trigger}
          onClose={() => setSelectedUpsell(null)}
          fields={[
            { label: 'From Plan', value: selectedUpsell.fromPlan },
            { label: 'To Plan', value: selectedUpsell.toPlan },
            { label: 'Converted', value: selectedUpsell.converted ? 'Yes' : 'No' },
            { label: 'Time', value: selectedUpsell.time },
          ]}
        />
      )}
    </div>
  )
}
