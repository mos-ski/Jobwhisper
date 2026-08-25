import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function PasswordField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm outline-none focus:border-blue-400"
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [current, setCurrent] = useState('')
  const [next,    setNext]    = useState('')
  const [confirm, setConfirm] = useState('')

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          <button className="pb-2.5 text-sm font-medium text-blue-600 border-b-2 border-blue-600 -mb-px">
            Security
          </button>
        </nav>
      </div>

      <div className="max-w-md space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Password</h2>
          <button className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">Update</button>
        </div>
        <PasswordField label="Current Password" value={current} onChange={setCurrent} />
        <PasswordField label="Change Password"  value={next}    onChange={setNext}    />
        <PasswordField label="Confirm Password" value={confirm} onChange={setConfirm} />
      </div>
    </div>
  )
}
