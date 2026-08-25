import { Link } from 'react-router-dom'
import { MOCK_SPECIALISTS } from '@/data/mockSpecialists'
import { cn } from '@/lib/utils'

export default function AllSpecialistsPage() {
  const total = MOCK_SPECIALISTS.length
  const admins = MOCK_SPECIALISTS.filter(s => s.role === 'Admin').length
  const totalStudents = MOCK_SPECIALISTS.reduce((a, s) => a + s.students, 0)
  const totalApps = MOCK_SPECIALISTS.reduce((a, s) => a + s.applications, 0)

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Specialists</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage career specialists and their access levels</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Specialists',   value: total          },
          { label: 'Admin Specialists',   value: admins         },
          { label: 'Total Students',      value: totalStudents  },
          { label: 'Applications (7d)',   value: totalApps      },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              {['S/N', 'Name', 'Email', 'Role', 'Status', 'Students', 'Credits', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_SPECIALISTS.map((s, i) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.email}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-medium',
                    s.role === 'Admin' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  )}>
                    {s.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">{s.status}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.students} / {s.capacity}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.credits}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/career-specialist/specialists/${s.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View
                    </Link>
                    <button className={cn(
                      'rounded border px-2.5 py-0.5 text-xs font-medium transition-colors',
                      s.role === 'Admin'
                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    )}>
                      {s.role === 'Admin' ? 'Revoke Admin' : 'Make Admin'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
