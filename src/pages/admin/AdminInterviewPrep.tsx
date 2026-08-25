import { useState } from 'react'
import { TrendingUp, ArrowUpRight, BookOpen, Target, Clock, Users, CheckCircle2, Plus } from 'lucide-react'
import { useSort } from '@/hooks/useSort'
import { SortableHeader } from '@/components/shared/SortableHeader'
import type { TimePeriod } from '@/components/shared/TimelineFilter'
import { AdminDetailModal } from '@/components/shared/AdminDetailModal'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

const PREP_STATS = {
  totalSessions: 5678,
  thisMonth: 1234,
  avgScore: 82.4,
  questionsPracticed: 45210,
  completionRate: 67.8,
  activeUsers: 1456,
}

const RECENT_PRACTICE = [
  { id: '1', user: 'Darnell Smith', type: 'Technical', questions: 25, score: 91, time: '1 hr ago', completed: true },
  { id: '2', user: 'Jessica Williams', type: 'Behavioral', questions: 18, score: 84, time: '2 hr ago', completed: true },
  { id: '3', user: 'Omar Khan', type: 'Case Study', questions: 12, score: 76, time: '3 hr ago', completed: false },
  { id: '4', user: 'Sarah Johnson', type: 'Technical', questions: 30, score: 95, time: '4 hr ago', completed: true },
  { id: '5', user: 'Carlos Rodriguez', type: 'Behavioral', questions: 15, score: 88, time: '5 hr ago', completed: true },
  { id: '6', user: 'Aisha Davis', type: 'System Design', questions: 8, score: 72, time: '6 hr ago', completed: false },
]

const PRACTICE_CATEGORIES = [
  { category: 'Technical', sessions: 2345, avgScore: 84, pct: 41, color: '#3b82f6' },
  { category: 'Behavioral', sessions: 1890, avgScore: 81, pct: 33, color: '#8b5cf6' },
  { category: 'Case Study', sessions: 867, avgScore: 78, pct: 15, color: '#2dd4bf' },
  { category: 'System Design', sessions: 576, avgScore: 86, pct: 10, color: '#f59e0b' },
]

const SCORE_DIST = [
  { range: '90-100', count: 892, pct: 22 },
  { range: '80-89', count: 1567, pct: 38 },
  { range: '70-79', count: 1123, pct: 27 },
  { range: '60-69', count: 345, pct: 8 },
  { range: '<60', count: 201, pct: 5 },
]

function NewPracticeSessionModal({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState('')
  const [type, setType] = useState('Technical')
  const [questions, setQuestions] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="lf-panel w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="lf-card-title">New Practice Session</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="lf-label block mb-1.5">User <span className="text-red-500">*</span></label>
            <input value={user} onChange={e => setUser(e.target.value)} placeholder="e.g. Darnell Smith" className="lf-input" />
          </div>
          <div>
            <label className="lf-label block mb-1.5">Category</label>
            <select value={type} onChange={e => setType(e.target.value)} className="lf-select">
              <option>Technical</option>
              <option>Behavioral</option>
              <option>Case Study</option>
              <option>System Design</option>
            </select>
          </div>
          <div>
            <label className="lf-label block mb-1.5">Questions</label>
            <input type="number" value={questions} onChange={e => setQuestions(e.target.value)} placeholder="25" className="lf-input" />
          </div>
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button type="submit" className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">Start</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminInterviewPrep() {
  const [tab, setTab] = useState<'overview' | 'practice' | 'settings'>('overview')
  const [period, setPeriod] = useState<TimePeriod>('12m')
  const [selectedPractice, setSelectedPractice] = useState<typeof RECENT_PRACTICE[number] | null>(null)
  const { sortKey, sortDirection, toggleSort, sorted } = useSort({ data: RECENT_PRACTICE })
  const [showNewSession, setShowNewSession] = useState(false)

  return (
    <div className="space-y-6">
      {showNewSession && <NewPracticeSessionModal onClose={() => setShowNewSession(false)} />}
      <AdminPageHeader
        title="Interview Prep"
        subtitle="Practice questions and mock interviews — track user progress"
        actions={[{ label: 'New Practice Session', icon: Plus, onClick: () => setShowNewSession(true) }]}
        period={period}
        onPeriodChange={setPeriod}
        tabs={[{ key: 'overview', label: 'Overview' }, { key: 'practice', label: 'Practice' }, { key: 'settings', label: 'Settings' }]}
        activeTab={tab}
        onTabChange={v => setTab(v as typeof tab)}
      />

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {[
              { label: 'Total Sessions', value: PREP_STATS.totalSessions.toLocaleString(), icon: BookOpen, change: '+28.3%' },
              { label: 'This Month', value: PREP_STATS.thisMonth.toLocaleString(), icon: TrendingUp, change: '+19.7%' },
              { label: 'Avg Score', value: `${PREP_STATS.avgScore}%`, icon: Target, change: '+2.1%' },
              { label: 'Questions Practiced', value: PREP_STATS.questionsPracticed.toLocaleString(), icon: CheckCircle2, change: '+3,420' },
              { label: 'Completion Rate', value: `${PREP_STATS.completionRate}%`, icon: Clock, change: '+4.2%' },
              { label: 'Active Users', value: PREP_STATS.activeUsers.toLocaleString(), icon: Users, change: '+156' },
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

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="lf-panel p-6">
              <p className="lf-card-title mb-4">Practice Categories</p>
              <div className="space-y-3">
                {PRACTICE_CATEGORIES.map(c => (
                  <div key={c.category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{c.category}</span>
                      <span className="text-xs text-muted-foreground">{c.sessions.toLocaleString()} sessions · avg {c.avgScore}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${c.pct}%`, background: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lf-panel p-6">
              <p className="lf-card-title mb-4">Score Distribution</p>
              <div className="space-y-2.5">
                {SCORE_DIST.map(d => (
                  <div key={d.range} className="flex items-center gap-3">
                    <span className="text-sm text-foreground w-14 shrink-0 tabular-nums">{d.range}</span>
                    <div className="flex-1">
                      <div className="h-6 rounded bg-muted overflow-hidden">
                        <div className="h-full rounded bg-primary transition-all duration-700 flex items-center px-2" style={{ width: `${d.pct}%` }}>
                          {d.pct > 10 && <span className="text-[10px] font-semibold text-white">{d.count}</span>}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-foreground w-8 text-right tabular-nums">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'practice' && (
        <div className="lf-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="lf-table">
              <thead className="lf-table-head">
                <tr>
                  <SortableHeader label="User" sortKey="user" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Category" sortKey="type" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Questions" sortKey="questions" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Score" sortKey="score" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Status" sortKey="completed" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Time" sortKey="time" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden sm:table-cell" />
                </tr>
              </thead>
              <tbody>
                {sorted.map(p => (
                  <tr key={p.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedPractice(p)}>
                    <td className="lf-table-cell font-medium text-foreground">{p.user}</td>
                    <td className="lf-table-cell">{p.type}</td>
                    <td className="lf-table-cell tabular-nums">{p.questions}</td>
                    <td className="lf-table-cell">
                      <span className={`font-semibold ${p.score >= 90 ? 'text-emerald-600' : p.score >= 80 ? 'text-foreground' : 'text-amber-600'}`}>{p.score}%</span>
                    </td>
                    <td className="lf-table-cell">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {p.completed ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                    <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{p.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="lf-panel p-6 max-w-2xl space-y-4">
          <p className="lf-card-title">Interview Prep Configuration</p>
          {[
            { label: 'Interview Prep Enabled', desc: 'Allow users to access practice questions', checked: true },
            { label: 'AI-Generated Questions', desc: 'Use AI to generate custom questions', checked: true },
            { label: 'Score Tracking', desc: 'Track and display user scores over time', checked: true },
            { label: 'Timed Practice', desc: 'Add time limits to practice sessions', checked: false },
            { label: 'Questions Per Session', desc: 'Default number of questions per practice', value: '20' },
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

      {selectedPractice && (
        <AdminDetailModal
          title={`${selectedPractice.user} Practice Session`}
          subtitle={selectedPractice.type}
          onClose={() => setSelectedPractice(null)}
          fields={[
            { label: 'User', value: selectedPractice.user },
            { label: 'Category', value: selectedPractice.type },
            { label: 'Questions', value: selectedPractice.questions },
            { label: 'Score', value: `${selectedPractice.score}%` },
            { label: 'Status', value: selectedPractice.completed ? 'Completed' : 'In Progress' },
            { label: 'Time', value: selectedPractice.time },
          ]}
        />
      )}
    </div>
  )
}
