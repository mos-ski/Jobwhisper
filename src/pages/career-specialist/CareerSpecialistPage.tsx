import { Link } from 'react-router-dom'
import { MOCK_STUDENTS } from '@/data/mockStudents'

export default function CareerSpecialistPage() {
  const myStudents = MOCK_STUDENTS.slice(0, 1)

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Adedamola,</h1>
          <p className="text-sm text-gray-500 mt-0.5">Portfolio visibility, onboarding, weekly throughout</p>
        </div>
        <Link to="/career-specialist/students/create" className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          + Add new Student
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'My active students',         value: '50'  },
          { label: 'Applications submitted (7d)', value: '820' },
          { label: 'Exceptions requiring action', value: '0'   },
          { label: 'Credit Left',                 value: '0'   },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">My Students</h2>
          <span className="text-sm text-gray-500">{myStudents.length} total</span>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                {['S/N', 'Name', 'Email', 'Job Role', 'Status', 'Performance', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myStudents.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.role}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">active</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-gray-200">
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
