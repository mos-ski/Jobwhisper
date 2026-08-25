import { useState } from 'react'
import { TrendingUp, ArrowUpRight, Folder, Users, Download, Mail, ChevronRight, Search, Filter, Plus, Eye, Send, BarChart3, Clock, MousePointerClick } from 'lucide-react'
import { useSort } from '@/hooks/useSort'
import { SortableHeader } from '@/components/shared/SortableHeader'
import { AdminDetailModal } from '@/components/shared/AdminDetailModal'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

const FUNNELS = [
  {
    id: 'f1',
    name: 'Career Clarity Quiz',
    type: 'Quiz Flow',
    status: 'active',
    leads: 4521,
    conversion: 34.2,
    created: '2026-06-01',
    lastActive: '2 hr ago',
    color: '#3b82f6',
    steps: ['Landing', 'Quiz Q1-5', 'Email Capture', 'Results', 'Upsell'],
  },
  {
    id: 'f2',
    name: 'ATS Score Checker',
    type: 'Tool Funnel',
    status: 'active',
    leads: 3890,
    conversion: 41.7,
    created: '2026-06-08',
    lastActive: '45 min ago',
    color: '#8b5cf6',
    steps: ['Upload Resume', 'Scan', 'Score Display', 'Email Capture', 'Upgrade CTA'],
  },
  {
    id: 'f3',
    name: 'Resume Roast',
    type: 'Quiz Flow',
    status: 'active',
    leads: 2134,
    conversion: 28.9,
    created: '2026-06-15',
    lastActive: '1 hr ago',
    color: '#2dd4bf',
    steps: ['Landing', 'Upload', 'AI Analysis', 'Results', 'Email Gate'],
  },
  {
    id: 'f4',
    name: 'Job Search Readiness',
    type: 'Assessment',
    status: 'active',
    leads: 1876,
    conversion: 31.4,
    created: '2026-06-22',
    lastActive: '3 hr ago',
    color: '#f59e0b',
    steps: ['Landing', '10 Questions', 'Score', 'Email Capture', 'Offer'],
  },
  {
    id: 'f5',
    name: 'Interview Readiness Check',
    type: 'Quiz Flow',
    status: 'paused',
    leads: 987,
    conversion: 22.1,
    created: '2026-07-01',
    lastActive: '2 days ago',
    color: '#ef4444',
    steps: ['Landing', 'Quiz Q1-8', 'Results', 'Email Gate', 'Upsell'],
  },
  {
    id: 'f6',
    name: 'Salary Negotiation Mini-Course',
    type: 'Course Funnel',
    status: 'active',
    leads: 1245,
    conversion: 19.8,
    created: '2026-07-05',
    lastActive: '5 hr ago',
    color: '#22c55e',
    steps: ['Landing', 'Video 1', 'Email Capture', 'Video 2', 'Checkout'],
  },
]

const MOCK_LEADS: Record<string, Array<{ id: string; name: string; email: string; score: number; status: string; source: string; date: string }>> = {
  f1: [
    { id: 'l1', name: 'Darnell Smith', email: 'darnell@example.com', score: 92, status: 'nurtured', source: 'Quiz', date: '2026-07-10' },
    { id: 'l2', name: 'Jessica Williams', email: 'jessica.w@example.com', score: 87, status: 'new', source: 'Quiz', date: '2026-07-10' },
    { id: 'l3', name: 'Omar Khan', email: 'omar.k@example.com', score: 71, status: 'contacted', source: 'Quiz', date: '2026-07-09' },
    { id: 'l4', name: 'Sarah Johnson', email: 'sarah.j@example.com', score: 95, status: 'converted', source: 'Quiz', date: '2026-07-09' },
    { id: 'l5', name: 'Carlos Rodriguez', email: 'carlos.r@example.com', score: 83, status: 'new', source: 'Quiz', date: '2026-07-08' },
    { id: 'l6', name: 'Aisha Davis', email: 'aisha.d@example.com', score: 89, status: 'nurtured', source: 'Quiz', date: '2026-07-08' },
    { id: 'l7', name: 'James Brown', email: 'james.b@example.com', score: 65, status: 'new', source: 'Quiz', date: '2026-07-07' },
    { id: 'l8', name: 'Hannah Lee', email: 'hannah.l@example.com', score: 91, status: 'converted', source: 'Quiz', date: '2026-07-07' },
  ],
  f2: [
    { id: 'l9', name: 'Marcus Chen', email: 'marcus.c@example.com', score: 88, status: 'converted', source: 'Tool', date: '2026-07-10' },
    { id: 'l10', name: 'Priya Patel', email: 'priya.p@example.com', score: 76, status: 'contacted', source: 'Tool', date: '2026-07-10' },
    { id: 'l11', name: 'Tyler Washington', email: 'tyler.w@example.com', score: 94, status: 'nurtured', source: 'Tool', date: '2026-07-09' },
    { id: 'l12', name: 'Mia Garcia', email: 'mia.g@example.com', score: 69, status: 'new', source: 'Tool', date: '2026-07-09' },
    { id: 'l13', name: 'Jordan Brooks', email: 'jordan.b@example.com', score: 82, status: 'contacted', source: 'Tool', date: '2026-07-08' },
    { id: 'l14', name: 'Zara Ahmed', email: 'zara.a@example.com', score: 91, status: 'converted', source: 'Tool', date: '2026-07-08' },
  ],
  f3: [
    { id: 'l15', name: 'Ethan Moore', email: 'ethan.m@example.com', score: 78, status: 'new', source: 'Quiz', date: '2026-07-10' },
    { id: 'l16', name: 'Lena Kim', email: 'lena.k@example.com', score: 85, status: 'nurtured', source: 'Quiz', date: '2026-07-09' },
    { id: 'l17', name: 'Devon Clarke', email: 'devon.c@example.com', score: 62, status: 'new', source: 'Quiz', date: '2026-07-08' },
    { id: 'l18', name: 'Amara Okafor', email: 'amara.o@example.com', score: 93, status: 'converted', source: 'Quiz', date: '2026-07-07' },
  ],
  f4: [
    { id: 'l19', name: 'Ryan Nguyen', email: 'ryan.n@example.com', score: 81, status: 'contacted', source: 'Assessment', date: '2026-07-10' },
    { id: 'l20', name: 'Sophia Martinez', email: 'sophia.m@example.com', score: 89, status: 'nurtured', source: 'Assessment', date: '2026-07-09' },
    { id: 'l21', name: 'Aiden Taylor', email: 'aiden.t@example.com', score: 74, status: 'new', source: 'Assessment', date: '2026-07-08' },
  ],
  f5: [
    { id: 'l22', name: 'Kai Robinson', email: 'kai.r@example.com', score: 67, status: 'new', source: 'Quiz', date: '2026-07-06' },
    { id: 'l23', name: 'Nia Foster', email: 'nia.f@example.com', score: 84, status: 'contacted', source: 'Quiz', date: '2026-07-05' },
  ],
  f6: [
    { id: 'l24', name: 'Leo Hernandez', email: 'leo.h@example.com', score: 79, status: 'new', source: 'Course', date: '2026-07-09' },
    { id: 'l25', name: 'Zoe Campbell', email: 'zoe.c@example.com', score: 86, status: 'nurtured', source: 'Course', date: '2026-07-08' },
    { id: 'l26', name: 'Isaiah Wright', email: 'isaiah.w@example.com', score: 92, status: 'converted', source: 'Course', date: '2026-07-07' },
  ],
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  paused: 'bg-amber-50 text-amber-700',
  draft: 'bg-muted text-muted-foreground',
}

const LEAD_STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700',
  contacted: 'bg-amber-50 text-amber-700',
  nurtured: 'bg-purple-50 text-purple-700',
  converted: 'bg-emerald-50 text-emerald-700',
}

function CreateFunnelModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('Quiz Flow')
  const [steps, setSteps] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="lf-panel w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="lf-card-title">Create Funnel</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="lf-label block mb-1.5">Name <span className="text-red-500">*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Career Clarity Quiz" className="lf-input" />
          </div>
          <div>
            <label className="lf-label block mb-1.5">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="lf-select">
              <option>Quiz Flow</option>
              <option>Tool Funnel</option>
              <option>Assessment Flow</option>
              <option>Course Funnel</option>
            </select>
          </div>
          <div>
            <label className="lf-label block mb-1.5">Steps (comma-separated)</label>
            <input value={steps} onChange={e => setSteps(e.target.value)} placeholder="Landing, Quiz, Results, Upsell" className="lf-input" />
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

export default function AdminFunnels() {
  const [view, setView] = useState<'folders' | 'folder'>('folders')
  const [selectedFunnel, setSelectedFunnel] = useState<typeof FUNNELS[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [leadSearch, setLeadSearch] = useState('')
  const [selectedLead, setSelectedLead] = useState<(typeof MOCK_LEADS)[string][number] | null>(null)
  const [showCreateFunnel, setShowCreateFunnel] = useState(false)

  const filteredFunnels = FUNNELS.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openFolder = (funnel: typeof FUNNELS[0]) => {
    setSelectedFunnel(funnel)
    setView('folder')
    setLeadSearch('')
    setSelectedLead(null)
  }

  const leads = selectedFunnel ? (MOCK_LEADS[selectedFunnel.id] || []) : []
  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.email.toLowerCase().includes(leadSearch.toLowerCase())
  )
  const { sortKey, sortDirection, toggleSort, sorted: sortedLeads } = useSort({ data: filteredLeads })

  const exportCSV = () => {
    if (!selectedFunnel) return
    const headers = ['Name', 'Email', 'Score', 'Status', 'Source', 'Date']
    const rows = leads.map(l => [l.name, l.email, String(l.score), l.status, l.source, l.date])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedFunnel.name.toLowerCase().replace(/\s+/g, '-')}-leads.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (view === 'folder' && selectedFunnel) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          breadcrumb={[{ label: 'Funnels', onClick: () => setView('folders') }, { label: selectedFunnel.name }]}
          title={selectedFunnel.name}
          badge={selectedFunnel.status}
          badgeClassName={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[selectedFunnel.status]}`}
          subtitle={`${selectedFunnel.type} · ${leads.length} leads · ${selectedFunnel.steps.length} steps`}
          actions={[
            { label: 'Export CSV', icon: Download, onClick: exportCSV, variant: 'outline' },
            { label: 'Nurture Sequence', icon: Send, onClick: () => {} },
          ]}
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Total Leads', value: leads.length.toLocaleString(), icon: Users },
            { label: 'Conversion Rate', value: `${selectedFunnel.conversion}%`, icon: MousePointerClick },
            { label: 'Funnel Steps', value: String(selectedFunnel.steps.length), icon: BarChart3 },
            { label: 'Last Active', value: selectedFunnel.lastActive, icon: Clock },
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

        <div className="lf-panel p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Funnel Steps</p>
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {selectedFunnel.steps.map((step, i) => (
              <div key={step} className="flex items-center shrink-0">
                <div className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground bg-muted/50">
                  <span className="text-muted-foreground mr-1.5">{i + 1}.</span>{step}
                </div>
                {i < selectedFunnel.steps.length - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground mx-1 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lf-panel overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <p className="lf-card-title">Lead Database</p>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={leadSearch}
                  onChange={e => setLeadSearch(e.target.value)}
                  placeholder="Search leads..."
                  className="lf-input h-8 pl-8 w-56 text-sm"
                />
              </div>
              <span className="text-xs text-muted-foreground">{filteredLeads.length} leads</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="lf-table">
              <thead className="lf-table-head">
                <tr>
                  <SortableHeader label="Name" sortKey="name" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Email" sortKey="email" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden md:table-cell" />
                  <SortableHeader label="Score" sortKey="score" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Status" sortKey="status" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Source" sortKey="source" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden sm:table-cell" />
                  <SortableHeader label="Date" sortKey="date" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden sm:table-cell" />
                </tr>
              </thead>
              <tbody>
                {sortedLeads.map(lead => (
                  <tr key={lead.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedLead(lead)}>
                    <td className="lf-table-cell font-medium text-foreground">{lead.name}</td>
                    <td className="lf-table-cell hidden md:table-cell text-muted-foreground">{lead.email}</td>
                    <td className="lf-table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-10 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${lead.score >= 85 ? 'bg-emerald-500' : lead.score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${lead.score}%` }} />
                        </div>
                        <span className="text-xs font-semibold tabular-nums">{lead.score}</span>
                      </div>
                    </td>
                    <td className="lf-table-cell">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${LEAD_STATUS_COLORS[lead.status]}`}>{lead.status}</span>
                    </td>
                    <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{lead.source}</td>
                    <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{lead.date}</td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr><td colSpan={6} className="lf-table-cell text-center text-muted-foreground py-8">No leads found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {selectedLead && (
          <AdminDetailModal
            title={selectedLead.name}
            subtitle={selectedLead.email}
            onClose={() => setSelectedLead(null)}
            fields={[
              { label: 'Funnel', value: selectedFunnel.name },
              { label: 'Lead Score', value: selectedLead.score },
              { label: 'Status', value: selectedLead.status },
              { label: 'Source', value: selectedLead.source },
              { label: 'Date Captured', value: selectedLead.date },
              { label: 'Recommended Action', value: selectedLead.score >= 85 ? 'Send sales outreach' : selectedLead.score >= 70 ? 'Add to nurture sequence' : 'Keep in awareness campaign' },
            ]}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showCreateFunnel && <CreateFunnelModal onClose={() => setShowCreateFunnel(false)} />}
      <AdminPageHeader
        title="Funnels"
        subtitle="All funnel databases — click a folder to view leads, export, and nurture"
        actions={[{ label: 'Create Funnel', icon: Plus, onClick: () => setShowCreateFunnel(true) }]}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {[
          { label: 'Total Funnels', value: String(FUNNELS.length), icon: Folder },
          { label: 'Total Leads', value: FUNNELS.reduce((s, f) => s + f.leads, 0).toLocaleString(), icon: Users },
          { label: 'Avg Conversion', value: `${(FUNNELS.reduce((s, f) => s + f.conversion, 0) / FUNNELS.length).toFixed(1)}%`, icon: MousePointerClick },
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

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search funnels..."
          className="lf-input pl-9 h-10 w-full"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredFunnels.map(f => (
          <button
            key={f.id}
            onClick={() => openFolder(f)}
            className="lf-panel p-5 text-left hover:border-foreground/20 transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${f.color}15` }}>
                <Folder className="h-5 w-5" style={{ color: f.color }} />
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[f.status]}`}>{f.status}</span>
            </div>
            <p className="text-sm font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors">{f.name}</p>
            <p className="text-xs text-muted-foreground mb-3">{f.type}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{f.leads.toLocaleString()} leads</span>
              <span className="font-semibold text-foreground">{f.conversion}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${f.conversion}%`, background: f.color }} />
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-[10px] text-muted-foreground">{f.steps.length} steps · Last active {f.lastActive}</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
