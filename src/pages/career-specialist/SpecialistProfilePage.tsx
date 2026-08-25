import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { MOCK_SPECIALISTS } from '@/data/mockSpecialists'
import { MOCK_STUDENTS } from '@/data/mockStudents'
import { MOCK_APPLICATIONS } from '@/data/mockApplications'
import { cn } from '@/lib/utils'

const STATUS_PILL: Record<string, string> = {
  failed:       'bg-red-100 text-red-700',
  needs_review: 'bg-orange-100 text-orange-700',
  completed:    'bg-green-100 text-green-700',
  pending:      'bg-yellow-100 text-yellow-700',
}

export default function SpecialistProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [tab, setTab] = useState<'students' | 'applications'>('students')

  const specialist = MOCK_SPECIALISTS.find(s => s.id === id)
  if (!specialist) return (
    <div className="flex items-center justify-center p-16 text-sm text-gray-500">Specialist not found.</div>
  )

  const students = MOCK_STUDENTS.slice(0, specialist.students)
  const applications = MOCK_APPLICATIONS.filter(a => students.some(s => s.id === a.studentId))

  return (
    <div className="p-8 space-y-6">
      <div>
        <Link to="/career-specialist/specialists" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4" /> All Specialists
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{specialist.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{specialist.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">{specialist.status}</span>
            <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', specialist.role === 'Admin' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700')}>{specialist.role}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Students Managed', value: specialist.students, sub: `of ${specialist.capacity} capacity` },
          { label: 'Total Students',   value: specialist.students },
          { label: 'Applications',     value: specialist.applications },
          { label: 'Credits',          value: specialist.credits },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-lg border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
          </div>
        ))}
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {(['students', 'applications'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'pb-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px',
                tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {t === 'students' ? `Students (${students.length})` : `Applications (${applications.length})`}
            </button>
          ))}
        </nav>
      </div>

      {tab === 'students' && (
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                {['S/N', 'Name', 'Email', 'Job Role', 'Status', 'Applications', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No students assigned.</td></tr>
              ) : students.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.role}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">{s.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{MOCK_APPLICATIONS.filter(a => a.studentId === s.id).length}</td>
                  <td className="px-4 py-3">
                    <Link to={`/career-specialist/students/${s.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">View Profile</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'applications' && (
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                {['S/N', 'Job Title', 'Company', 'Student', 'Date Applied', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">No applications yet.</td></tr>
              ) : applications.map((a, i) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{a.jobTitle}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.company}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.studentName}</td>
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
      )}
    </div>
  )
}
