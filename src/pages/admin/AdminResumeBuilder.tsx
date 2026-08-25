import { useState } from 'react'
import { TrendingUp, ArrowUpRight, FileText, Users, Target, BarChart3, Clock, Zap, CheckCircle2, XCircle, MessageSquare, Download, Settings, X, Eye, Sparkles, Check, ExternalLink, Plus } from 'lucide-react'
import type { TimePeriod } from '@/components/shared/TimelineFilter'
import { AdminDetailModal } from '@/components/shared/AdminDetailModal'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

const TEMPLATES = [
  { id: 't01', name: 'Classic Blue', atsAvg: 82, uses: 3421, active: true, downloads: 1240, color: '#143763', premium: false },
  { id: 't02', name: 'Centered', atsAvg: 79, uses: 1890, active: true, downloads: 890, color: '#143763', premium: false },
  { id: 't03', name: 'Minimal', atsAvg: 84, uses: 2100, active: true, downloads: 920, color: '#64748b', premium: false },
  { id: 't04', name: 'Teal Summary', atsAvg: 86, uses: 1670, active: true, downloads: 780, color: '#0f766e', premium: false },
  { id: 't05', name: 'Clean Serif', atsAvg: 81, uses: 1340, active: true, downloads: 610, color: '#1e293b', premium: false },
  { id: 't06', name: 'Professional', atsAvg: 85, uses: 2890, active: true, downloads: 1320, color: '#1e40af', premium: false },
  { id: 't07', name: 'Green Accent', atsAvg: 83, uses: 1120, active: true, downloads: 510, color: '#0f766e', premium: false },
  { id: 't08', name: 'Executive', atsAvg: 88, uses: 1567, active: true, downloads: 720, color: '#0f172a', premium: true },
  { id: 't09', name: 'Burgundy', atsAvg: 77, uses: 890, active: true, downloads: 410, color: '#9f1239', premium: false },
  { id: 't10', name: 'Bold Blue', atsAvg: 80, uses: 1450, active: true, downloads: 670, color: '#1d4ed8', premium: false },
  { id: 't11', name: 'Simple', atsAvg: 83, uses: 1780, active: true, downloads: 820, color: '#475569', premium: false },
  { id: 't12', name: 'Slate', atsAvg: 81, uses: 1020, active: true, downloads: 470, color: '#334155', premium: false },
  { id: 't13', name: 'Monogram', atsAvg: 79, uses: 680, active: true, downloads: 310, color: '#143763', premium: true },
  { id: 't14', name: 'Teal Highlight', atsAvg: 85, uses: 920, active: true, downloads: 430, color: '#0f766e', premium: false },
  { id: 't15', name: 'Traditional', atsAvg: 82, uses: 1560, active: true, downloads: 720, color: '#1e293b', premium: false },
  { id: 't16', name: 'Three Column', atsAvg: 78, uses: 780, active: true, downloads: 360, color: '#334155', premium: false },
  { id: 't17', name: 'Founder', atsAvg: 87, uses: 1340, active: true, downloads: 620, color: '#0f172a', premium: true },
  { id: 't18', name: 'Marketing Pro', atsAvg: 80, uses: 1120, active: true, downloads: 520, color: '#7c3aed', premium: false },
  { id: 't19', name: 'Creative', atsAvg: 71, uses: 892, active: true, downloads: 410, color: '#ea580c', premium: false },
  { id: 't20', name: 'Executive Pro', atsAvg: 89, uses: 1680, active: true, downloads: 780, color: '#0f172a', premium: true },
]

const RECENT_BUILDS = [
  { id: '1', user: 'Darnell Smith', atsScore: 92, status: 'accepted', template: 't08', time: '12 min ago', aiMessages: 8 },
  { id: '2', user: 'Jessica Williams', atsScore: 84, status: 'accepted', template: 't06', time: '28 min ago', aiMessages: 12 },
  { id: '3', user: 'Omar Khan', atsScore: 68, status: 'rejected', template: 't19', time: '45 min ago', aiMessages: 5 },
  { id: '4', user: 'Sarah Johnson', atsScore: 95, status: 'accepted', template: 't20', time: '1 hr ago', aiMessages: 15 },
  { id: '5', user: 'Carlos Rodriguez', atsScore: 71, status: 'pending', template: 't01', time: '2 hr ago', aiMessages: 7 },
  { id: '6', user: 'Aisha Davis', atsScore: 88, status: 'accepted', template: 't06', time: '3 hr ago', aiMessages: 10 },
  { id: '7', user: 'James Brown', atsScore: 55, status: 'rejected', template: 't11', time: '3 hr ago', aiMessages: 3 },
  { id: '8', user: 'Hannah Lee', atsScore: 91, status: 'accepted', template: 't08', time: '4 hr ago', aiMessages: 14 },
]

const ATS_SCORE_DIST = [
  { range: '90-100', label: 'Excellent', count: 1823, pct: 28, color: '#22c55e' },
  { range: '75-89', label: 'Good', count: 2890, pct: 44, color: '#3b82f6' },
  { range: '60-74', label: 'Fair', count: 1340, pct: 20, color: '#f59e0b' },
  { range: '40-59', label: 'Poor', count: 390, pct: 6, color: '#ef4444' },
  { range: '<40', label: 'Critical', count: 120, pct: 2, color: '#dc2626' },
]

const TOP_ISSUES = [
  { issue: 'Missing keywords from job description', frequency: 3420, pct: 34 },
  { issue: 'Poor formatting for ATS parsing', frequency: 2310, pct: 23 },
  { issue: 'Weak action verbs', frequency: 1890, pct: 19 },
  { issue: 'Missing quantified achievements', frequency: 1240, pct: 12 },
  { issue: 'Inconsistent date formatting', frequency: 890, pct: 9 },
  { issue: 'Too many pages', frequency: 340, pct: 3 },
]

const STATUS_COLORS: Record<string, string> = {
  accepted: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-600',
  pending: 'bg-amber-50 text-amber-700',
}

type TemplateModal = { open: boolean; template: typeof TEMPLATES[number] | null }

function CreateResumeModal({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState('')
  const [template, setTemplate] = useState('t01')
  const [jobRole, setJobRole] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="lf-panel w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="lf-card-title">Create Resume</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="lf-label block mb-1.5">User <span className="text-red-500">*</span></label>
            <input value={user} onChange={e => setUser(e.target.value)} placeholder="e.g. Darnell Smith" className="lf-input" />
          </div>
          <div>
            <label className="lf-label block mb-1.5">Template</label>
            <select value={template} onChange={e => setTemplate(e.target.value)} className="lf-select">
              {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}{t.premium ? ' (Premium)' : ''}</option>)}
            </select>
          </div>
          <div>
            <label className="lf-label block mb-1.5">Target Role</label>
            <input value={jobRole} onChange={e => setJobRole(e.target.value)} placeholder="e.g. Software Engineer" className="lf-input" />
          </div>
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button type="submit" className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminResumeBuilder() {
  const [tab, setTab] = useState<'overview' | 'builds' | 'templates' | 'settings'>('overview')
  const [period, setPeriod] = useState<TimePeriod>('12m')
  const [templateModal, setTemplateModal] = useState<TemplateModal>({ open: false, template: null })
  const [selectedRow, setSelectedRow] = useState<typeof RECENT_BUILDS[number] | null>(null)
  const [showCreateResume, setShowCreateResume] = useState(false)

  const totalDownloads = TEMPLATES.reduce((sum, t) => sum + t.downloads, 0)
  const totalUses = TEMPLATES.reduce((sum, t) => sum + t.uses, 0)

  return (
    <div className="space-y-6">
      {showCreateResume && <CreateResumeModal onClose={() => setShowCreateResume(false)} />}
      <AdminPageHeader
        title="Resume Builder"
        subtitle="AI-powered resume building — chat, ATS scoring, templates, and acceptance tracking"
        actions={[{ label: 'Create Resume', icon: Plus, onClick: () => setShowCreateResume(true) }]}
        period={period}
        onPeriodChange={setPeriod}
        tabs={[{ key: 'overview', label: 'Overview' }, { key: 'builds', label: 'Builds' }, { key: 'templates', label: 'Templates' }, { key: 'settings', label: 'Settings' }]}
        activeTab={tab}
        onTabChange={v => setTab(v as typeof tab)}
      />

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Total Builds', value: '8,934', icon: FileText, change: '+22.4%' },
              { label: 'This Month', value: '1,847', icon: TrendingUp, change: '+18.7%' },
              { label: 'Avg ATS Score', value: '78.4%', icon: Target, change: '+3.2%' },
              { label: 'Acceptance Rate', value: '62.3%', icon: CheckCircle2, change: '+5.1%' },
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
              { label: 'AI Chats', value: '12,450', icon: MessageSquare },
              { label: 'Templates Used', value: totalUses.toLocaleString(), icon: FileText },
              { label: 'Exports Downloaded', value: totalDownloads.toLocaleString(), icon: Download },
              { label: 'Rejection Rate', value: '37.7%', icon: XCircle },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="lf-panel p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <p className="text-xl font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="lf-panel p-6">
              <p className="lf-card-title mb-4">ATS Score Distribution</p>
              <div className="space-y-2.5">
                {ATS_SCORE_DIST.map(d => (
                  <div key={d.range} className="flex items-center gap-3">
                    <div className="w-20 shrink-0">
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
              <p className="lf-card-title mb-4">Acceptance vs Rejection</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="h-8 rounded-full bg-muted overflow-hidden flex">
                    <div className="h-full bg-emerald-500 transition-all duration-700 flex items-center justify-center" style={{ width: '62.3%' }}>
                      <span className="text-[10px] font-bold text-white">62.3%</span>
                    </div>
                    <div className="h-full bg-red-500 transition-all duration-700 flex items-center justify-center" style={{ width: '37.7%' }}>
                      <span className="text-[10px] font-bold text-white">37.7%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-emerald-500" /><span className="text-xs text-muted-foreground">Accepted</span></div>
                <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-red-500" /><span className="text-xs text-muted-foreground">Rejected</span></div>
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Top ATS Issues</p>
              <div className="space-y-2">
                {TOP_ISSUES.slice(0, 4).map(t => (
                  <div key={t.issue} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${t.pct}%` }} />
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{t.pct}%</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1 mt-2">
                {TOP_ISSUES.slice(0, 4).map(t => (
                  <p key={t.issue} className="text-[10px] text-muted-foreground">{t.issue}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="lf-panel overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="lf-card-title">Recent Resume Builds</p>
            </div>
            <div className="overflow-x-auto">
              <table className="lf-table">
                <thead className="lf-table-head">
                  <tr>
                    <th className="lf-table-th">User</th>
                    <th className="lf-table-th">ATS Score</th>
                    <th className="lf-table-th hidden sm:table-cell">Template</th>
                    <th className="lf-table-th hidden md:table-cell">AI Chats</th>
                    <th className="lf-table-th">Status</th>
                    <th className="lf-table-th hidden sm:table-cell">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_BUILDS.map(b => {
                    const tmpl = TEMPLATES.find(t => t.id === b.template)
                    return (
                      <tr key={b.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedRow(b)}>
                        <td className="lf-table-cell font-medium text-foreground">{b.user}</td>
                        <td className="lf-table-cell">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                              <div className={`h-full rounded-full ${b.atsScore >= 85 ? 'bg-emerald-500' : b.atsScore >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${b.atsScore}%` }} />
                            </div>
                            <span className="text-xs font-semibold tabular-nums">{b.atsScore}</span>
                          </div>
                        </td>
                        <td className="lf-table-cell hidden sm:table-cell">
                          <button onClick={(event) => { event.stopPropagation(); setTemplateModal({ open: true, template: TEMPLATES.find(t => t.id === b.template) ?? null }) }} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                            <span className="h-2 w-2 rounded-full" style={{ background: tmpl?.color ?? '#999' }} />
                            {tmpl?.name ?? b.template}
                          </button>
                        </td>
                        <td className="lf-table-cell hidden md:table-cell tabular-nums">{b.aiMessages}</td>
                        <td className="lf-table-cell">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                        </td>
                        <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{b.time}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'builds' && (
        <div className="lf-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="lf-table">
              <thead className="lf-table-head">
                <tr>
                  <th className="lf-table-th">User</th>
                  <th className="lf-table-th">ATS Score</th>
                  <th className="lf-table-th hidden sm:table-cell">Template</th>
                  <th className="lf-table-th hidden md:table-cell">AI Chats</th>
                  <th className="lf-table-th">Status</th>
                  <th className="lf-table-th hidden sm:table-cell">Time</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_BUILDS.map(b => {
                  const tmpl = TEMPLATES.find(t => t.id === b.template)
                  return (
                    <tr key={b.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedRow(b)}>
                      <td className="lf-table-cell font-medium text-foreground">{b.user}</td>
                      <td className="lf-table-cell">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full rounded-full ${b.atsScore >= 85 ? 'bg-emerald-500' : b.atsScore >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${b.atsScore}%` }} />
                          </div>
                          <span className="text-xs font-semibold tabular-nums">{b.atsScore}</span>
                        </div>
                      </td>
                      <td className="lf-table-cell hidden sm:table-cell">
                        <button onClick={(event) => { event.stopPropagation(); setTemplateModal({ open: true, template: TEMPLATES.find(t => t.id === b.template) ?? null }) }} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                          <span className="h-2 w-2 rounded-full" style={{ background: tmpl?.color ?? '#999' }} />
                          {tmpl?.name ?? b.template}
                        </button>
                      </td>
                      <td className="lf-table-cell hidden md:table-cell tabular-nums">{b.aiMessages}</td>
                      <td className="lf-table-cell">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                      </td>
                      <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{b.time}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">{TEMPLATES.length} Templates</p>
              <p className="text-xs text-muted-foreground">Click a template to view details, usage stats, and settings</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Total downloads:</span>
              <span className="text-xs font-semibold text-foreground">{totalDownloads.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setTemplateModal({ open: true, template: t })}
                className="group relative overflow-hidden rounded-lg border border-border bg-white text-left transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <img
                    src={`/templates/${t.id}.png`}
                    alt={t.name}
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                  <span className={`absolute left-2 top-2 z-10 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide backdrop-blur ${
                    t.premium ? 'bg-amber-500/90 text-white' : 'bg-emerald-500/90 text-white'
                  }`}>
                    {t.premium ? 'Premium' : 'Included'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur">
                      <Eye className="h-2.5 w-2.5" /> View
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur">
                      <Settings className="h-2.5 w-2.5" /> Settings
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                    <div className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${t.active ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}>
                      <span className={`pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${t.active ? 'translate-x-3' : 'translate-x-0'}`} />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>ATS {t.atsAvg}%</span>
                    <span>·</span>
                    <span>{t.uses.toLocaleString()} uses</span>
                    <span>·</span>
                    <span>{t.downloads.toLocaleString()} DL</span>
                  </div>
                  <div className="mt-2 h-1 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${t.atsAvg}%`, background: t.color }} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="lf-panel p-6 max-w-2xl space-y-4">
          <p className="lf-card-title">Resume Builder Configuration</p>
          {[
            { label: 'Resume Builder Enabled', desc: 'Allow users to build resumes with AI', checked: true },
            { label: 'AI Chat Assistant', desc: 'Enable conversational AI for resume building', checked: true },
            { label: 'ATS Score Feedback', desc: 'Show ATS score and improvement suggestions', checked: true },
            { label: 'Acceptance Tracking', desc: 'Track application acceptance vs rejection', checked: true },
            { label: 'Template Marketplace', desc: 'Allow users to create and share templates', checked: false },
            { label: 'Max AI Messages', desc: 'Maximum AI messages per resume build session', value: '20' },
            { label: 'Max Pages', desc: 'Maximum resume pages allowed', value: '3' },
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

      {templateModal.open && templateModal.template && (
        <TemplateDetailModal
          template={templateModal.template}
          onClose={() => setTemplateModal({ open: false, template: null })}
        />
      )}
      {selectedRow && (
        <AdminDetailModal
          title={`${selectedRow.user} Resume Build`}
          subtitle={TEMPLATES.find(t => t.id === selectedRow.template)?.name ?? selectedRow.template}
          onClose={() => setSelectedRow(null)}
          fields={[
            { label: 'ATS Score', value: selectedRow.atsScore },
            { label: 'Status', value: selectedRow.status },
            { label: 'Template', value: TEMPLATES.find(t => t.id === selectedRow.template)?.name ?? selectedRow.template },
            { label: 'AI Messages', value: selectedRow.aiMessages },
            { label: 'Time', value: selectedRow.time },
            { label: 'Recommended Action', value: selectedRow.atsScore >= 85 ? 'Highlight as a strong build' : selectedRow.atsScore >= 70 ? 'Review optimization suggestions' : 'Needs resume coaching follow-up' },
          ]}
        />
      )}
    </div>
  )
}

function TemplateDetailModal({ template, onClose }: { template: typeof TEMPLATES[number]; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'details' | 'usage' | 'settings'>('details')
  const templateUses = RECENT_BUILDS.filter(b => b.template === template.id)
  const avgScore = templateUses.length ? Math.round(templateUses.reduce((sum, b) => sum + b.atsScore, 0) / templateUses.length) : template.atsAvg

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-950/30 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-border bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-3.5 w-3.5 rounded-full" style={{ background: template.color }} />
            <div>
              <h2 className="text-base font-semibold text-foreground">{template.name}</h2>
              <p className="text-xs text-muted-foreground">Template {template.id.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-b border-border px-6">
          {(['details', 'usage', 'settings'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`relative px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === t ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {activeTab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Avg ATS Score', value: `${template.atsAvg}%`, icon: Target },
                  { label: 'Total Uses', value: template.uses.toLocaleString(), icon: Users },
                  { label: 'Downloads', value: template.downloads.toLocaleString(), icon: Download },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-lg border border-border p-4 text-center">
                    <Icon className="mx-auto h-5 w-5 text-muted-foreground mb-2" />
                    <p className="text-xl font-bold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-border p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Template Preview</p>
                <div className="flex justify-center">
                  <div className="relative aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-lg border border-border bg-muted shadow-sm">
                    <img
                      src={`/templates/${template.id}.png`}
                      alt={template.name}
                      className="h-full w-full object-cover object-top"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                    <span className={`absolute left-2 top-2 z-10 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur ${
                      template.premium ? 'bg-amber-500/90 text-white' : 'bg-emerald-500/90 text-white'
                    }`}>
                      {template.premium ? 'Premium' : 'Included'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Recent Users</p>
                {templateUses.length > 0 ? (
                  <div className="space-y-3">
                    {templateUses.map(b => (
                      <div key={b.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                        <span className="text-sm font-medium text-foreground">{b.user}</span>
                        <div className="flex items-center gap-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                          <span className="text-xs tabular-nums text-muted-foreground">ATS {b.atsScore}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent builds using this template</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-5">
                  <p className="text-3xl font-bold text-foreground">{template.uses.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Uses</p>
                </div>
                <div className="rounded-lg border border-border p-5">
                  <p className="text-3xl font-bold text-emerald-600">{avgScore}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg ATS Score (Recent)</p>
                </div>
              </div>

              <div className="rounded-lg border border-border p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">ATS Score Distribution</p>
                <div className="space-y-3">
                  {ATS_SCORE_DIST.map(d => (
                    <div key={d.range} className="flex items-center gap-3">
                      <span className="w-16 text-sm text-foreground">{d.range}</span>
                      <div className="flex-1 h-5 rounded bg-muted overflow-hidden">
                        <div className="h-full rounded" style={{ width: `${d.pct}%`, background: d.color }} />
                      </div>
                      <span className="w-10 text-right text-sm tabular-nums">{d.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Downloads Over Time</p>
                <div className="flex items-end gap-1.5 h-32">
                  {[35, 42, 38, 55, 48, 62, 58, 71, 65, 78, 72, 85].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t bg-primary/20" style={{ height: `${h}%` }}>
                      <div className="w-full rounded-t bg-primary" style={{ height: `${h * 0.6}%` }} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-muted-foreground">Jan</span>
                  <span className="text-[10px] text-muted-foreground">Dec</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-5">
              {[
                { label: 'Template Active', desc: 'Users can select this template', checked: template.active },
                { label: 'Featured Template', desc: 'Show in featured/recommended section', checked: template.id === 't08' || template.id === 't20' },
                { label: 'ATS Optimized', desc: 'Template uses ATS-friendly formatting', checked: true },
                { label: 'Premium Only', desc: 'Only available to Premium plan users', checked: false },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-3.5 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${item.checked ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                    <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${item.checked ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>
              ))}

              <div className="pt-1">
                <p className="text-sm font-medium text-foreground mb-2.5">Template Color</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg border border-border" style={{ background: template.color }} />
                  <input defaultValue={template.color} className="lf-input w-32 h-10 text-sm font-mono" />
                </div>
              </div>

              <div className="pt-1">
                <p className="text-sm font-medium text-foreground mb-2.5">Description</p>
                <textarea defaultValue="Clean ATS-friendly resume layout for professional applications." className="lf-input h-24 w-full resize-none text-sm" />
              </div>

              <div className="pt-1">
                <p className="text-sm font-medium text-foreground mb-2.5">Sort Order</p>
                <input type="number" defaultValue={TEMPLATES.findIndex(t => t.id === template.id) + 1} className="lf-input w-full h-10 text-sm" />
              </div>

              <div className="flex gap-3 pt-3">
                <button className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90">
                  <Check className="h-4 w-4" /> Save Changes
                </button>
                <button className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border px-5 text-sm font-semibold text-foreground transition hover:bg-muted">
                  <ExternalLink className="h-4 w-4" /> Preview in Builder
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
