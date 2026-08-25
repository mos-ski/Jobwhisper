import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { MOCK_STUDENTS } from '@/data/mockStudents'
import { cn } from '@/lib/utils'

export default function AllStudentsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'running'>('all')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return MOCK_STUDENTS.filter(s =>
      (!q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.role.toLowerCase().includes(q)) &&
      (filter === 'all' || s.autoApply === 'running')
    )
  }, [search, filter])

  const running = MOCK_STUDENTS.filter(s => s.autoApply === 'running').length

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Students</h1>
        <p className="text-sm text-gray-500 mt-0.5">All students across all specialists</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Students',               value: MOCK_STUDENTS.length },
          { label: 'Active (this page)',            value: MOCK_STUDENTS.length },
          { label: 'Auto-Apply Running (this page)',value: running              },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name..."
                className="rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-400 w-64"
              />
            </div>
            <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden">
              <button
                onClick={() => setFilter('all')}
                className={cn('px-4 py-2 text-sm font-medium transition-colors', filter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700')}
              >
                All
              </button>
              <button
                onClick={() => setFilter('running')}
                className={cn('px-4 py-2 text-sm font-medium transition-colors', filter === 'running' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700')}
              >
                Auto-Apply Running
              </button>
            </div>
          </div>
          <span className="text-sm text-gray-500">Rows per page: 50</span>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                {['S/N', 'Name', 'Email', 'Job Role', 'Status', 'Auto-Apply', 'Performance', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 uppercase">{s.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.role}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">{s.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-medium',
                      s.autoApply === 'running' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    )}>
                      {s.autoApply}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-gray-200">
                        <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${(s.performance / 500) * 100}%` }} />
                      </div>
                      <span className="text-xs text-gray-600">{s.performance}/500</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/career-specialist/students/${s.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      View Profile
                    </Link>
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
