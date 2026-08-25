import { useState } from 'react'
import { TrendingUp, ArrowUpRight, Video, Clock, Users, Zap, MessageSquare, Eye, EyeOff, Monitor, Smartphone, Settings, ChevronRight, X } from 'lucide-react'
import { useSort } from '@/hooks/useSort'
import { SortableHeader } from '@/components/shared/SortableHeader'
import type { TimePeriod } from '@/components/shared/TimelineFilter'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

const SESSIONS = [
  { id: 's1', user: 'Darnell Smith', platform: 'Desktop', useCase: 'Interview', jobTitle: 'Senior Software Engineer', style: 'Headlines', answerLength: 'Medium', duration: 42, questionsAnswered: 14, speakers: 2, stealthUsed: true, autoRespond: false, aiAssistantUsed: true, contextDocs: 2, status: 'completed', time: '2 hr ago', score: 87 },
  { id: 's2', user: 'Jessica Williams', platform: 'Desktop', useCase: 'Interview', jobTitle: 'Data Analyst', style: 'Default', answerLength: 'Long', duration: 35, questionsAnswered: 11, speakers: 2, stealthUsed: true, autoRespond: false, aiAssistantUsed: false, contextDocs: 1, status: 'completed', time: '3 hr ago', score: 82 },
  { id: 's3', user: 'Omar Khan', platform: 'Web', useCase: 'Interview', jobTitle: 'Product Manager', style: 'Coaching', answerLength: 'Short', duration: 51, questionsAnswered: 18, speakers: 3, stealthUsed: false, autoRespond: true, aiAssistantUsed: true, contextDocs: 3, status: 'completed', time: '4 hr ago', score: 91 },
  { id: 's4', user: 'Sarah Johnson', platform: 'Desktop', useCase: 'Interview', jobTitle: 'UX Designer', style: 'Headlines', answerLength: 'Medium', duration: 28, questionsAnswered: 9, speakers: 2, stealthUsed: true, autoRespond: false, aiAssistantUsed: false, contextDocs: 0, status: 'completed', time: '6 hr ago', score: 78 },
  { id: 's5', user: 'Carlos Rodriguez', platform: 'Mobile', useCase: 'Interview', jobTitle: 'Cloud Engineer', style: 'Default', answerLength: 'Medium', duration: 45, questionsAnswered: 15, speakers: 2, stealthUsed: false, autoRespond: true, aiAssistantUsed: true, contextDocs: 1, status: 'completed', time: '1 day ago', score: 85 },
  { id: 's6', user: 'Aisha Davis', platform: 'Desktop', useCase: 'Interview', jobTitle: 'Backend Engineer', style: 'Headlines', answerLength: 'Long', duration: 38, questionsAnswered: 12, speakers: 2, stealthUsed: true, autoRespond: false, aiAssistantUsed: true, contextDocs: 2, status: 'completed', time: '1 day ago', score: 89 },
  { id: 's7', user: 'James Brown', platform: 'Web', useCase: 'Interview', jobTitle: 'iOS Developer', style: 'Default', answerLength: 'Short', duration: 22, questionsAnswered: 7, speakers: 2, stealthUsed: false, autoRespond: false, aiAssistantUsed: false, contextDocs: 0, status: 'abandoned', time: '2 days ago', score: 0 },
  { id: 's8', user: 'Hannah Lee', platform: 'Desktop', useCase: 'Interview', jobTitle: 'Data Scientist', style: 'Coaching', answerLength: 'Medium', duration: 55, questionsAnswered: 20, speakers: 2, stealthUsed: true, autoRespond: true, aiAssistantUsed: true, contextDocs: 4, status: 'completed', time: '2 days ago', score: 94 },
]

const PLATFORM_STATS = [
  { platform: 'Desktop', sessions: 2134, pct: 62, icon: Monitor },
  { platform: 'Web', sessions: 890, pct: 26, icon: Monitor },
  { platform: 'Mobile', sessions: 397, pct: 12, icon: Smartphone },
]

const STYLE_DIST = [
  { style: 'Default', sessions: 1234, pct: 36, color: '#3b82f6' },
  { style: 'Headlines', sessions: 1456, pct: 43, color: '#8b5cf6' },
  { style: 'Coaching', sessions: 731, pct: 21, color: '#2dd4bf' },
]

const LENGTH_DIST = [
  { length: 'Short', sessions: 687, pct: 20 },
  { length: 'Medium', sessions: 1892, pct: 55 },
  { length: 'Long', sessions: 842, pct: 25 },
]

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700',
  abandoned: 'bg-red-50 text-red-600',
  'in-progress': 'bg-amber-50 text-amber-700',
}

export default function AdminInterviewCopilot() {
  const [tab, setTab] = useState<'overview' | 'sessions' | 'settings'>('overview')
  const [period, setPeriod] = useState<TimePeriod>('12m')
  const [selectedRow, setSelectedRow] = useState<typeof SESSIONS[number] | null>(null)
  const { sortKey, sortDirection, toggleSort, sorted } = useSort({ data: SESSIONS })

  const totalSessions = 3421
  const completedSessions = SESSIONS.filter(s => s.status === 'completed')
  const avgScore = completedSessions.length > 0 ? Math.round(completedSessions.reduce((s, x) => s + x.score, 0) / completedSessions.length) : 0
  const stealthRate = Math.round((SESSIONS.filter(s => s.stealthUsed).length / SESSIONS.length) * 100)
  const aiAssistantRate = Math.round((SESSIONS.filter(s => s.aiAssistantUsed).length / SESSIONS.length) * 100)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Interview Copilot"
        subtitle="Real-time interview assistance — stealth mode, response styles, multi-speaker, AI assistant"
        period={period}
        onPeriodChange={setPeriod}
        tabs={[{ key: 'overview', label: 'Overview' }, { key: 'sessions', label: 'Sessions' }, { key: 'settings', label: 'Settings' }]}
        activeTab={tab}
        onTabChange={v => setTab(v as typeof tab)}
      />

      {tab === 'overview' && (
        <>
          {/* Core Metrics */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Total Sessions', value: totalSessions.toLocaleString(), icon: Video, change: '+26.4%' },
              { label: 'Avg Duration', value: '34m', icon: Clock, change: '+3m' },
              { label: 'Questions Answered', value: '18,943', icon: MessageSquare, change: '+1,247' },
              { label: 'Avg Score', value: `${avgScore}%`, icon: Zap, change: '+4.2%' },
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

          {/* Feature Adoption */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Stealth Mode Used', value: `${stealthRate}%`, desc: 'of sessions' },
              { label: 'AI Assistant Used', value: `${aiAssistantRate}%`, desc: 'of sessions' },
              { label: 'Auto-Respond On', value: '28%', desc: 'of sessions' },
              { label: 'Setup Skipped', value: '34%', desc: 'power users' },
            ].map(({ label, value, desc }) => (
              <div key={label} className="lf-panel p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-bold text-foreground mt-1">{value}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Platform Split */}
            <div className="lf-panel p-6">
              <p className="lf-card-title mb-4">Platform Split</p>
              <div className="space-y-3">
                {PLATFORM_STATS.map(p => (
                  <div key={p.platform}>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <p.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{p.platform}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{p.sessions.toLocaleString()} · {p.pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-[10px] text-muted-foreground">Desktop: stealth mode + multi-window. Web: browser-based. Mobile: phone beside laptop.</p>
              </div>
            </div>

            {/* Response Styles */}
            <div className="lf-panel p-6">
              <p className="lf-card-title mb-4">Response Styles</p>
              <div className="space-y-3">
                {STYLE_DIST.map(s => (
                  <div key={s.style}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{s.style}</span>
                      <span className="text-xs text-muted-foreground">{s.sessions.toLocaleString()} · {s.pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.pct}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border space-y-1">
                <p className="text-[10px] text-muted-foreground"><strong>Default</strong> — Full natural answer</p>
                <p className="text-[10px] text-muted-foreground"><strong>Headlines</strong> — STAR bullet points</p>
                <p className="text-[10px] text-muted-foreground"><strong>Coaching</strong> — Tips and guidance only</p>
              </div>
            </div>

            {/* Answer Length */}
            <div className="lf-panel p-6">
              <p className="lf-card-title mb-4">Answer Length</p>
              <div className="space-y-3">
                {LENGTH_DIST.map(l => (
                  <div key={l.length}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{l.length}</span>
                      <span className="text-xs text-muted-foreground">{l.sessions.toLocaleString()} · {l.pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${l.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-[10px] text-muted-foreground">Interview and Meeting use cases only. Coding copilot has no length option.</p>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="lf-panel overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="lf-card-title">Recent Sessions</p>
            </div>
            <div className="overflow-x-auto">
              <table className="lf-table">
              <thead className="lf-table-head">
                <tr>
                  <SortableHeader label="User" sortKey="user" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Platform" sortKey="platform" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden md:table-cell" />
                  <SortableHeader label="Job Title" sortKey="jobTitle" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden md:table-cell" />
                  <SortableHeader label="Style" sortKey="style" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Duration" sortKey="duration" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden sm:table-cell" />
                  <SortableHeader label="Q&A" sortKey="questionsAnswered" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden sm:table-cell" />
                  <SortableHeader label="Speakers" sortKey="speakers" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden lg:table-cell" />
                  <SortableHeader label="Stealth" sortKey="stealthUsed" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden lg:table-cell" />
                  <SortableHeader label="AI Asst" sortKey="aiAssistantUsed" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden lg:table-cell" />
                  <SortableHeader label="Score" sortKey="score" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Status" sortKey="status" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                </tr>
              </thead>
              <tbody>
                {sorted.map(s => (
                    <tr key={s.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedRow(s)}>
                      <td className="lf-table-cell font-medium text-foreground">{s.user}</td>
                      <td className="lf-table-cell hidden md:table-cell text-xs text-muted-foreground">{s.platform}</td>
                      <td className="lf-table-cell hidden md:table-cell text-xs text-muted-foreground truncate max-w-[140px]">{s.jobTitle}</td>
                      <td className="lf-table-cell"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{s.style}</span></td>
                      <td className="lf-table-cell hidden sm:table-cell tabular-nums text-sm">{s.duration}m</td>
                      <td className="lf-table-cell hidden sm:table-cell tabular-nums text-sm">{s.questionsAnswered}</td>
                      <td className="lf-table-cell hidden lg:table-cell tabular-nums text-sm">{s.speakers}</td>
                      <td className="lf-table-cell hidden lg:table-cell">{s.stealthUsed ? <EyeOff className="h-3.5 w-3.5 text-emerald-500" /> : <Eye className="h-3.5 w-3.5 text-muted-foreground/30" />}</td>
                      <td className="lf-table-cell hidden lg:table-cell">{s.aiAssistantUsed ? <MessageSquare className="h-3.5 w-3.5 text-blue-500" /> : <span className="text-muted-foreground/30">—</span>}</td>
                      <td className="lf-table-cell tabular-nums font-semibold">{s.score > 0 ? s.score : '—'}</td>
                      <td className="lf-table-cell"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[s.status]}`}>{s.status}</span></td>
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
                  <SortableHeader label="User" sortKey="user" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Platform" sortKey="platform" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Job Title" sortKey="jobTitle" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden md:table-cell" />
                  <SortableHeader label="Style" sortKey="style" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Length" sortKey="answerLength" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden sm:table-cell" />
                  <SortableHeader label="Duration" sortKey="duration" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden sm:table-cell" />
                  <SortableHeader label="Q&A" sortKey="questionsAnswered" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Speakers" sortKey="speakers" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden md:table-cell" />
                  <SortableHeader label="Stealth" sortKey="stealthUsed" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden lg:table-cell" />
                  <SortableHeader label="Auto" sortKey="autoRespond" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden lg:table-cell" />
                  <SortableHeader label="AI Asst" sortKey="aiAssistantUsed" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden lg:table-cell" />
                  <SortableHeader label="Context" sortKey="contextDocs" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden lg:table-cell" />
                  <SortableHeader label="Score" sortKey="score" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Status" sortKey="status" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                </tr>
              </thead>
              <tbody>
                {sorted.map(s => (
                  <tr key={s.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedRow(s)}>
                    <td className="lf-table-cell font-medium text-foreground">{s.user}</td>
                    <td className="lf-table-cell text-xs text-muted-foreground">{s.platform}</td>
                    <td className="lf-table-cell hidden md:table-cell text-xs text-muted-foreground truncate max-w-[140px]">{s.jobTitle}</td>
                    <td className="lf-table-cell"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{s.style}</span></td>
                    <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{s.answerLength}</td>
                    <td className="lf-table-cell hidden sm:table-cell tabular-nums text-sm">{s.duration}m</td>
                    <td className="lf-table-cell tabular-nums text-sm">{s.questionsAnswered}</td>
                    <td className="lf-table-cell hidden md:table-cell tabular-nums text-sm">{s.speakers}</td>
                    <td className="lf-table-cell hidden lg:table-cell">{s.stealthUsed ? <EyeOff className="h-3.5 w-3.5 text-emerald-500" /> : <Eye className="h-3.5 w-3.5 text-muted-foreground/30" />}</td>
                    <td className="lf-table-cell hidden lg:table-cell text-xs text-muted-foreground">{s.autoRespond ? 'Auto' : 'Manual'}</td>
                    <td className="lf-table-cell hidden lg:table-cell">{s.aiAssistantUsed ? <MessageSquare className="h-3.5 w-3.5 text-blue-500" /> : '—'}</td>
                    <td className="lf-table-cell hidden lg:table-cell tabular-nums text-sm">{s.contextDocs}</td>
                    <td className="lf-table-cell tabular-nums font-semibold">{s.score > 0 ? s.score : '—'}</td>
                    <td className="lf-table-cell"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[s.status]}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="lf-panel p-6 max-w-2xl space-y-4">
          <p className="lf-card-title">Interview Copilot Configuration</p>
          {[
            { label: 'Copilot Enabled', desc: 'Allow users to access Interview Copilot', checked: true },
            { label: 'Stealth Mode Default', desc: 'Default state of stealth mode for new sessions', checked: true },
            { label: 'AI Assistant Panel', desc: 'Allow users to open the AI chat panel during sessions', checked: true },
            { label: 'Multi-Speaker Detection', desc: 'Automatically detect and label multiple speakers', checked: true },
            { label: 'Post-Session Report', desc: 'Generate feedback report after each session', checked: true },
            { label: 'Transcript Saving', desc: 'Save session transcripts for review', checked: true },
            { label: 'Interjection Support', desc: 'Detect and display interjections from other speakers', checked: true },
            { label: 'Max Session Duration (min)', desc: 'Maximum length of a copilot session', value: '60' },
            { label: 'Transcript Retention (days)', desc: 'How long transcripts are kept before auto-delete', value: '90' },
            { label: 'AI Response Latency Target (ms)', desc: 'Target response time from end-of-question to start-of-answer', value: '1500' },
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
    </div>
  )
}
