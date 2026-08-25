import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MOCK_APPLICATIONS } from '@/data/mockApplications'
import { cn } from '@/lib/utils'

type StatusFilter = 'all' | 'failed' | 'needs_review' | 'completed' | 'pending'

const STATUS_PILL: Record<string, string> = {
  failed:       'bg-red-100 text-red-700',
  needs_review: 'bg-orange-100 text-orange-700',
  completed:    'bg-green-100 text-green-700',
  pending:      'bg-yellow-100 text-yellow-700',
}

export default function AllApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filtered = useMemo(() =>
    MOCK_APPLICATIONS.filter(a => statusFilter === 'all' || a.status === statusFilter),
    [statusFilter]
  )

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Applications</h1>
        <p className="text-sm text-gray-500 mt-0.5">All applications across all students — ordered by most recent attempt</p>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">{MOCK_APPLICATIONS.length.toLocaleString()}</span>
        <span className="text-sm text-gray-500">total applications</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
          >
            <option value="all">All Statuses</option>
            <option value="failed">Failed</option>
            <option value="needs_review">Needs Review</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <span className="text-sm text-gray-500">Rows per page: 100</span>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                {['S/N', 'Job Title', 'Company', 'Source', 'Posted', 'Last Attempt', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((a, i) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <Link to={`/career-specialist/applications/${a.id}`} className="hover:text-blue-600 hover:underline">
                      {a.jobTitle}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.company}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{a.source}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.postedAt}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.dateApplied}</td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', STATUS_PILL[a.status] ?? 'bg-gray-100 text-gray-700')}>
                      {a.status.replace('_', ' ')}
                    </span>
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
