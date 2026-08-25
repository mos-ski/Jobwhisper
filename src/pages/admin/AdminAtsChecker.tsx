import { useState } from 'react'
import { TrendingUp, ArrowUpRight, FileCheck, Target, Zap, Users, BarChart3 } from 'lucide-react'
import { AdminDetailModal } from '@/components/shared/AdminDetailModal'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

const ATS_STATS = {
  totalScans: 18943,
  thisMonth: 3421,
  avgScore: 76.8,
  improvementsApplied: 12450,
  passRate: 71.2,
  activeUsers: 2134,
}

const RECENT_SCANS = [
  { id: '1', user: 'Darnell Smith', resume: 'Senior Software Engineer', score: 92, issues: 3, time: '12 min ago', improved: true },
  { id: '2', user: 'Jessica Williams', resume: 'Data Analyst', score: 84, issues: 7, time: '28 min ago', improved: true },
  { id: '3', user: 'Omar Khan', resume: 'Product Manager', score: 68, issues: 14, time: '45 min ago', improved: false },
  { id: '4', user: 'Sarah Johnson', resume: 'UX Designer', score: 95, issues: 2, time: '1 hr ago', improved: true },
  { id: '5', user: 'Carlos Rodriguez', resume: 'Cloud Engineer', score: 71, issues: 11, time: '2 hr ago', improved: false },
  { id: '6', user: 'Aisha Davis', resume: 'Backend Engineer', score: 88, issues: 5, time: '3 hr ago', improved: true },
]

const ISSUE_CATEGORIES = [
  { category: 'Keyword Missing', count: 3420, pct: 34, color: '#ef4444' },
  { category: 'Formatting', count: 2310, pct: 23, color: '#f59e0b' },
  { category: 'Experience Gap', count: 1890, pct: 19, color: '#8b5cf6' },
  { category: 'Education', count: 1240, pct: 12, color: '#3b82f6' },
  { category: 'Skills Mismatch', count: 1140, pct: 11, color: '#2dd4bf' },
]

const SCORE_RANGES = [
  { range: '90-100', label: 'Excellent', count: 2890, pct: 24, color: '#22c55e' },
  { range: '75-89', label: 'Good', count: 4560, pct: 38, color: '#3b82f6' },
  { range: '60-74', label: 'Fair', count: 3210, pct: 27, color: '#f59e0b' },
  { range: '40-59', label: 'Poor', count: 1120, pct: 9, color: '#ef4444' },
  { range: '<40', label: 'Critical', count: 430, pct: 3.6, color: '#dc2626' },
]

export default function AdminAtsChecker() {
  const [tab, setTab] = useState<'overview' | 'scans' | 'settings'>('overview')
  const [selectedScan, setSelectedScan] = useState<typeof RECENT_SCANS[number] | null>(null)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="ATS Checker"
        subtitle="Resume optimization and ATS scoring — monitor usage and effectiveness"
        tabs={[{ key: 'overview', label: 'Overview' }, { key: 'scans', label: 'Scans' }, { key: 'settings', label: 'Settings' }]}
        activeTab={tab}
        onTabChange={v => setTab(v as typeof tab)}
      />

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {[
              { label: 'Total Scans', value: ATS_STATS.totalScans.toLocaleString(), icon: FileCheck, change: '+24.6%' },
              { label: 'This Month', value: ATS_STATS.thisMonth.toLocaleString(), icon: TrendingUp, change: '+18.2%' },
              { label: 'Avg Score', value: `${ATS_STATS.avgScore}%`, icon: Target, change: '+3.4%' },
              { label: 'Improvements Applied', value: ATS_STATS.improvementsApplied.toLocaleString(), icon: Zap, change: '+2,180' },
              { label: 'Pass Rate', value: `${ATS_STATS.passRate}%`, icon: BarChart3, change: '+5.8%' },
              { label: 'Active Users', value: ATS_STATS.activeUsers.toLocaleString(), icon: Users, change: '+312' },
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
              <p className="lf-card-title mb-4">Score Distribution</p>
              <div className="space-y-2.5">
                {SCORE_RANGES.map(d => (
                  <div key={d.range} className="flex items-center gap-3">
                    <div className="w-24 shrink-0">
                      <span className="text-sm text-foreground">{d.range}</span>
                      <p className="text-[10px] text-muted-foreground">{d.label}</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-6 rounded bg-muted overflow-hidden">
                        <div className="h-full rounded transition-all duration-700 flex items-center px-2" style={{ width: `${d.pct}%`, background: d.color }}>
                          {d.pct > 8 && <span className="text-[10px] font-semibold text-white">{d.count.toLocaleString()}</span>}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-foreground w-8 text-right tabular-nums">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lf-panel p-6">
              <p className="lf-card-title mb-4">Top Issue Categories</p>
              <div className="space-y-3">
                {ISSUE_CATEGORIES.map(c => (
                  <div key={c.category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{c.category}</span>
                      <span className="text-xs text-muted-foreground">{c.count.toLocaleString()} issues · {c.pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${c.pct}%`, background: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'scans' && (
        <div className="lf-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="lf-table">
              <thead className="lf-table-head">
                <tr>
                  <th className="lf-table-th">User</th>
                  <th className="lf-table-th hidden md:table-cell">Resume</th>
                  <th className="lf-table-th">Score</th>
                  <th className="lf-table-th">Issues</th>
                  <th className="lf-table-th">Improved</th>
                  <th className="lf-table-th hidden sm:table-cell">Time</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_SCANS.map(s => (
                  <tr key={s.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedScan(s)}>
                    <td className="lf-table-cell font-medium text-foreground">{s.user}</td>
                    <td className="lf-table-cell hidden md:table-cell text-muted-foreground">{s.resume}</td>
                    <td className="lf-table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${s.score >= 85 ? 'bg-emerald-500' : s.score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.score}%` }} />
                        </div>
                        <span className="text-xs font-semibold tabular-nums">{s.score}</span>
                      </div>
                    </td>
                    <td className="lf-table-cell tabular-nums">{s.issues}</td>
                    <td className="lf-table-cell">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.improved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {s.improved ? 'Applied' : 'Pending'}
                      </span>
                    </td>
                    <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{s.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="lf-panel p-6 max-w-2xl space-y-4">
          <p className="lf-card-title">ATS Checker Configuration</p>
          {[
            { label: 'ATS Checker Enabled', desc: 'Allow users to scan their resumes', checked: true },
            { label: 'Auto-Apply Fixes', desc: 'Automatically apply recommended improvements', checked: false },
            { label: 'Keyword Analysis', desc: 'Check for missing keywords from job descriptions', checked: true },
            { label: 'Format Validation', desc: 'Validate resume formatting for ATS compatibility', checked: true },
            { label: 'Max Scans Per Day', desc: 'Maximum resume scans per user per day', value: '10' },
            { label: 'Minimum Pass Score', desc: 'Minimum score to be considered ATS-ready', value: '70' },
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
      {selectedScan && (
        <AdminDetailModal
          title={`${selectedScan.user} ATS Scan`}
          subtitle={selectedScan.resume}
          onClose={() => setSelectedScan(null)}
          fields={[
            { label: 'Score', value: `${selectedScan.score}%` },
            { label: 'Issues', value: selectedScan.issues },
            { label: 'Improvements', value: selectedScan.improved ? 'Applied' : 'Pending' },
            { label: 'Time', value: selectedScan.time },
            { label: 'Priority', value: selectedScan.score >= 85 ? 'Healthy' : selectedScan.score >= 70 ? 'Needs review' : 'Needs intervention' },
          ]}
        />
      )}
    </div>
  )
}
