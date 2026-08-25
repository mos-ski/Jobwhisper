import { useState } from 'react'
import { Building2, Users, TrendingUp, ArrowUpRight, Search, ChevronRight, Download, BarChart3, Clock, BookOpen, DollarSign, Plus } from 'lucide-react'
import { useSort } from '@/hooks/useSort'
import { SortableHeader } from '@/components/shared/SortableHeader'
import type { TimePeriod } from '@/components/shared/TimelineFilter'
import { AdminDetailModal } from '@/components/shared/AdminDetailModal'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

const ENTERPRISES = [
  { id: 'e1', name: 'Howard University', domain: 'howard.edu', plan: 'Campus Growth', students: 342, activeUsers: 287, avgCredits: 45, monthlySpend: 12800, contractValue: 153600, billingCycle: 'Annual', renewalDate: '2026-09-01', invoiceStatus: 'paid', joinDate: '2025-09-01', lastActive: '2 hr ago', status: 'active', department: 'Career Services' },
  { id: 'e2', name: 'Morehouse College', domain: 'morehouse.edu', plan: 'Campus Growth', students: 218, activeUsers: 178, avgCredits: 38, monthlySpend: 8200, contractValue: 98400, billingCycle: 'Annual', renewalDate: '2026-10-15', invoiceStatus: 'paid', joinDate: '2025-10-15', lastActive: '5 hr ago', status: 'active', department: 'Student Affairs' },
  { id: 'e3', name: 'Spelman College', domain: 'spelman.edu', plan: 'Campus Growth', students: 195, activeUsers: 167, avgCredits: 42, monthlySpend: 7600, contractValue: 91200, billingCycle: 'Annual', renewalDate: '2026-11-01', invoiceStatus: 'paid', joinDate: '2025-11-01', lastActive: '1 hr ago', status: 'active', department: 'Academic Affairs' },
  { id: 'e4', name: 'Georgia Tech', domain: 'gatech.edu', plan: 'Campus Enterprise', students: 567, activeUsers: 489, avgCredits: 52, monthlySpend: 21400, contractValue: 256800, billingCycle: 'Annual', renewalDate: '2026-08-01', invoiceStatus: 'paid', joinDate: '2025-08-01', lastActive: '30 min ago', status: 'active', department: 'Career Center' },
  { id: 'e5', name: 'Florida A&M University', domain: 'famu.edu', plan: 'Campus Starter', students: 156, activeUsers: 112, avgCredits: 30, monthlySpend: 5800, contractValue: 69600, billingCycle: 'Annual', renewalDate: '2027-01-10', invoiceStatus: 'open', joinDate: '2026-01-10', lastActive: '1 day ago', status: 'active', department: 'Career Services' },
  { id: 'e6', name: 'Tuskegee University', domain: 'tuskegee.edu', plan: 'Campus Starter', students: 89, activeUsers: 64, avgCredits: 22, monthlySpend: 2400, contractValue: 28800, billingCycle: 'Semester', renewalDate: '2026-09-01', invoiceStatus: 'open', joinDate: '2026-03-01', lastActive: '3 days ago', status: 'active', department: 'Student Development' },
  { id: 'e7', name: 'Hampton University', domain: 'hamptonu.edu', plan: 'Campus Growth', students: 234, activeUsers: 198, avgCredits: 40, monthlySpend: 9200, contractValue: 110400, billingCycle: 'Annual', renewalDate: '2026-12-01', invoiceStatus: 'paid', joinDate: '2025-12-01', lastActive: '4 hr ago', status: 'active', department: 'Career Center' },
  { id: 'e8', name: 'North Carolina A&T', domain: 'ncat.edu', plan: 'Campus Growth', students: 289, activeUsers: 241, avgCredits: 36, monthlySpend: 10800, contractValue: 129600, billingCycle: 'Annual', renewalDate: '2026-10-01', invoiceStatus: 'paid', joinDate: '2025-10-01', lastActive: '2 hr ago', status: 'active', department: 'Academic Success' },
]

const ENTERPRISE_STUDENTS: Record<string, Array<{ id: string; name: string; email: string; credits: number; creditsUsed: number; applications: number; lastActive: string; status: string }>> = {
  e1: [
    { id: 's1', name: 'Darnell Smith', email: 'dsmith@howard.edu', credits: 50, creditsUsed: 32, applications: 18, lastActive: '2 hr ago', status: 'active' },
    { id: 's2', name: 'Jessica Williams', email: 'jwilliams@howard.edu', credits: 50, creditsUsed: 41, applications: 24, lastActive: '45 min ago', status: 'active' },
    { id: 's3', name: 'Omar Khan', email: 'okhan@howard.edu', credits: 50, creditsUsed: 28, applications: 12, lastActive: '1 day ago', status: 'active' },
    { id: 's4', name: 'Sarah Johnson', email: 'sjohnson@howard.edu', credits: 50, creditsUsed: 47, applications: 31, lastActive: '1 hr ago', status: 'active' },
    { id: 's5', name: 'Carlos Rodriguez', email: 'crodriguez@howard.edu', credits: 50, creditsUsed: 15, applications: 8, lastActive: '3 days ago', status: 'inactive' },
    { id: 's6', name: 'Aisha Davis', email: 'adavis@howard.edu', credits: 50, creditsUsed: 39, applications: 21, lastActive: '3 hr ago', status: 'active' },
  ],
  e4: [
    { id: 's7', name: 'Marcus Chen', email: 'mchen@gatech.edu', credits: 60, creditsUsed: 52, applications: 35, lastActive: '1 hr ago', status: 'active' },
    { id: 's8', name: 'Priya Patel', email: 'ppatel@gatech.edu', credits: 60, creditsUsed: 44, applications: 28, lastActive: '2 hr ago', status: 'active' },
    { id: 's9', name: 'Tyler Washington', email: 'twashington@gatech.edu', credits: 60, creditsUsed: 58, applications: 42, lastActive: '30 min ago', status: 'active' },
    { id: 's10', name: 'Mia Garcia', email: 'mgarcia@gatech.edu', credits: 60, creditsUsed: 31, applications: 15, lastActive: '5 hr ago', status: 'active' },
  ],
}

const PLAN_COLORS: Record<string, string> = {
  'Campus Enterprise': 'bg-violet-50 text-violet-700',
  'Campus Growth': 'bg-blue-50 text-blue-700',
  'Campus Starter': 'bg-slate-100 text-slate-600',
}

function AddInstitutionModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [plan, setPlan] = useState('Campus Starter')
  const [contact, setContact] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !domain) return
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="lf-panel w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="lf-card-title">Add Institution</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="lf-label block mb-1.5">Institution Name <span className="text-red-500">*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Howard University" className="lf-input" />
          </div>
          <div>
            <label className="lf-label block mb-1.5">Domain <span className="text-red-500">*</span></label>
            <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="e.g. howard.edu" className="lf-input" />
          </div>
          <div>
            <label className="lf-label block mb-1.5">Plan</label>
            <select value={plan} onChange={e => setPlan(e.target.value)} className="lf-select">
              <option>Campus Starter</option>
              <option>Campus Growth</option>
              <option>Campus Enterprise</option>
            </select>
          </div>
          <div>
            <label className="lf-label block mb-1.5">Contact Email</label>
            <input type="email" value={contact} onChange={e => setContact(e.target.value)} placeholder="admin@university.edu" className="lf-input" />
          </div>
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button type="submit" className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">Add</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminEnterprises() {
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState<TimePeriod>('12m')
  const [selectedEnterprise, setSelectedEnterprise] = useState<typeof ENTERPRISES[0] | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<(typeof ENTERPRISE_STUDENTS)[string][number] | null>(null)
  const [studentSearch, setStudentSearch] = useState('')
  const [showAddInstitution, setShowAddInstitution] = useState(false)

  const filtered = ENTERPRISES.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.domain.toLowerCase().includes(search.toLowerCase())
  )

  const students = selectedEnterprise ? (ENTERPRISE_STUDENTS[selectedEnterprise.id] || []) : []
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  )
  const { sortKey: iSortKey, sortDirection: iSortDirection, toggleSort: iToggleSort, sorted: sortedInstitutions } = useSort({ data: filtered })
  const { sortKey: sSortKey, sortDirection: sSortDirection, toggleSort: sToggleSort, sorted: sortedStudents } = useSort({ data: filteredStudents })

  const totalStudents = ENTERPRISES.reduce((s, e) => s + e.students, 0)
  const totalActive = ENTERPRISES.reduce((s, e) => s + e.activeUsers, 0)
  const totalContractValue = ENTERPRISES.reduce((s, e) => s + e.contractValue, 0)

  if (selectedEnterprise) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          breadcrumb={[
            { label: 'Enterprises', onClick: () => { setSelectedEnterprise(null); setSelectedStudent(null); setStudentSearch('') } },
            { label: selectedEnterprise.name },
          ]}
          title={selectedEnterprise.name}
          badge={selectedEnterprise.plan}
          badgeClassName={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${PLAN_COLORS[selectedEnterprise.plan]}`}
          subtitle={`${selectedEnterprise.domain} · ${selectedEnterprise.department} · ${selectedEnterprise.students} included seats · ${selectedEnterprise.billingCycle} billing`}
          actions={[{ label: 'Export Students', icon: Download, variant: 'outline', onClick: () => {} }]}
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Total Students', value: String(selectedEnterprise.students), icon: Users },
            { label: 'Active Users', value: String(selectedEnterprise.activeUsers), icon: TrendingUp },
            { label: 'Avg Credits', value: String(selectedEnterprise.avgCredits), icon: BarChart3 },
            { label: 'Contract Value', value: `$${selectedEnterprise.contractValue.toLocaleString()}`, icon: DollarSign },
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

        <div className="lf-panel overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <p className="lf-card-title">Students</p>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input value={studentSearch} onChange={e => setStudentSearch(e.target.value)} placeholder="Search students..." className="lf-input h-8 pl-8 w-56 text-sm" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="lf-table">
              <thead className="lf-table-head">
                <tr>
                  <SortableHeader label="Student" sortKey="name" activeSortKey={sSortKey} sortDirection={sSortDirection} onToggleSort={sToggleSort} />
                  <SortableHeader label="Credits" sortKey="credits" activeSortKey={sSortKey} sortDirection={sSortDirection} onToggleSort={sToggleSort} />
                  <SortableHeader label="Usage" sortKey="creditsUsed" activeSortKey={sSortKey} sortDirection={sSortDirection} onToggleSort={sToggleSort} className="hidden sm:table-cell" />
                  <SortableHeader label="Applications" sortKey="applications" activeSortKey={sSortKey} sortDirection={sSortDirection} onToggleSort={sToggleSort} />
                  <SortableHeader label="Status" sortKey="status" activeSortKey={sSortKey} sortDirection={sSortDirection} onToggleSort={sToggleSort} />
                  <SortableHeader label="Last Active" sortKey="lastActive" activeSortKey={sSortKey} sortDirection={sSortDirection} onToggleSort={sToggleSort} className="hidden sm:table-cell" />
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map(s => {
                  const usage = s.credits > 0 ? (s.creditsUsed / s.credits) * 100 : 0
                  return (
                    <tr key={s.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedStudent(s)}>
                      <td className="lf-table-cell">
                        <div>
                          <p className="font-medium text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.email}</p>
                        </div>
                      </td>
                      <td className="lf-table-cell tabular-nums text-sm">{s.creditsUsed}/{s.credits}</td>
                      <td className="lf-table-cell hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full rounded-full ${usage >= 80 ? 'bg-emerald-500' : usage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${usage}%` }} />
                          </div>
                          <span className="text-xs tabular-nums">{Math.round(usage)}%</span>
                        </div>
                      </td>
                      <td className="lf-table-cell tabular-nums font-semibold">{s.applications}</td>
                      <td className="lf-table-cell">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>{s.status}</span>
                      </td>
                      <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{s.lastActive}</td>
                    </tr>
                  )
                })}
                {filteredStudents.length === 0 && (
                  <tr><td colSpan={6} className="lf-table-cell text-center text-muted-foreground py-8">No students found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {selectedStudent && (
          <AdminDetailModal
            title={selectedStudent.name}
            subtitle={selectedStudent.email}
            onClose={() => setSelectedStudent(null)}
            fields={[
              { label: 'Institution', value: selectedEnterprise.name },
              { label: 'Credits', value: `${selectedStudent.creditsUsed}/${selectedStudent.credits}` },
              { label: 'Applications', value: selectedStudent.applications },
              { label: 'Status', value: selectedStudent.status },
              { label: 'Last Active', value: selectedStudent.lastActive },
              { label: 'Usage Level', value: selectedStudent.creditsUsed / selectedStudent.credits >= 0.8 ? 'High' : selectedStudent.creditsUsed / selectedStudent.credits >= 0.5 ? 'Medium' : 'Low' },
            ]}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showAddInstitution && <AddInstitutionModal onClose={() => setShowAddInstitution(false)} />}
      <AdminPageHeader
        breadcrumb={[{ label: 'Users', to: '/admin/users' }, { label: 'Enterprises' }]}
        title="Enterprises"
        subtitle="Institution accounts — contract billing, included seats, student activation, and usage"
        actions={[
          { label: 'Add Institution', icon: Plus, onClick: () => setShowAddInstitution(true) },
          { label: 'Export CSV', icon: Download, variant: 'outline' },
        ]}
        period={period}
        onPeriodChange={setPeriod}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {[
          { label: 'Total Institutions', value: String(ENTERPRISES.length), icon: Building2 },
          { label: 'Included Seats', value: totalStudents.toLocaleString(), icon: Users },
          { label: 'Annual Contract Value', value: `$${totalContractValue.toLocaleString()}`, icon: TrendingUp },
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
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search institutions..." className="lf-input pl-9 h-10 w-full" />
      </div>

      <div className="lf-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <SortableHeader label="Institution" sortKey="name" activeSortKey={iSortKey} sortDirection={iSortDirection} onToggleSort={iToggleSort} />
                <SortableHeader label="Department" sortKey="department" activeSortKey={iSortKey} sortDirection={iSortDirection} onToggleSort={iToggleSort} className="hidden md:table-cell" />
                <SortableHeader label="Plan" sortKey="plan" activeSortKey={iSortKey} sortDirection={iSortDirection} onToggleSort={iToggleSort} />
                <SortableHeader label="Seats" sortKey="students" activeSortKey={iSortKey} sortDirection={iSortDirection} onToggleSort={iToggleSort} />
                <SortableHeader label="Active" sortKey="activeUsers" activeSortKey={iSortKey} sortDirection={iSortDirection} onToggleSort={iToggleSort} className="hidden sm:table-cell" />
                <SortableHeader label="Contract" sortKey="contractValue" activeSortKey={iSortKey} sortDirection={iSortDirection} onToggleSort={iToggleSort} className="hidden lg:table-cell" />
                <SortableHeader label="Last Active" sortKey="lastActive" activeSortKey={iSortKey} sortDirection={iSortDirection} onToggleSort={iToggleSort} className="hidden sm:table-cell" />
                <th className="lf-table-th w-8"></th>
              </tr>
            </thead>
            <tbody>
              {sortedInstitutions.map(e => (
                <tr key={e.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedEnterprise(e)}>
                  <td className="lf-table-cell">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{e.name}</p>
                        <p className="text-xs text-muted-foreground">{e.domain}</p>
                      </div>
                    </div>
                  </td>
                  <td className="lf-table-cell hidden md:table-cell text-muted-foreground text-sm">{e.department}</td>
                  <td className="lf-table-cell">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${PLAN_COLORS[e.plan]}`}>{e.plan}</span>
                  </td>
                  <td className="lf-table-cell tabular-nums font-semibold">{e.students}</td>
                  <td className="lf-table-cell hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-10 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(e.activeUsers / e.students) * 100}%` }} />
                      </div>
                      <span className="text-xs tabular-nums">{e.activeUsers}</span>
                    </div>
                  </td>
                  <td className="lf-table-cell hidden lg:table-cell tabular-nums text-sm">${e.contractValue.toLocaleString()}</td>
                  <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{e.lastActive}</td>
                  <td className="lf-table-cell">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
