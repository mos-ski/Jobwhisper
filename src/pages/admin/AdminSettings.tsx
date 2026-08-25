import { useState } from 'react'
import { useSettings } from '@/hooks/useAdmin'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
        checked ? 'bg-primary' : 'bg-muted-foreground/30'
      }`}
    >
      <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
        checked ? 'translate-x-4' : 'translate-x-0'
      }`} />
    </button>
  )
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3.5 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

const INTEGRATIONS = [
  { name: 'Paystack', role: 'Payment gateway', status: 'connected' },
  { name: 'Mailgun', role: 'Email service', status: 'connected' },
  { name: 'Claude AI', role: 'AI model (Sonnet 4.6)', status: 'connected' },
  { name: 'LinkedIn', role: 'Job board', status: 'limited' },
  { name: 'Greenhouse', role: 'Job board', status: 'connected' },
  { name: 'Workday', role: 'Job board', status: 'connected' },
]

const INT_STYLE: Record<string, string> = {
  connected: 'bg-emerald-50 text-emerald-700',
  limited: 'bg-amber-50 text-amber-700',
  down: 'bg-red-50 text-red-600',
}

const INT_LABEL: Record<string, string> = {
  connected: 'Connected',
  limited: 'Rate limited',
  down: 'Down',
}

export default function AdminSettings() {
  const { flags, toggleFlag } = useSettings()
  const [appName, setAppName] = useState('Lightforth')
  const [supportEmail, setSupportEmail] = useState('support@lightforth.ai')
  const [timezone, setTimezone] = useState('lag')

  const FLAG_LABELS: Record<keyof typeof flags, string> = {
    autoApply: 'Auto-Apply',
    interviewCopilot: 'Interview Copilot',
    careerSpecialist: 'Career Specialist',
    mobileApp: 'Mobile App',
    resumeAI: 'Resume AI',
    maintenance: 'Maintenance Mode',
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <AdminPageHeader title="Settings" subtitle="Platform configuration and feature management" />

      {/* General */}
      <div className="lf-panel p-5">
        <p className="lf-card-title mb-0.5">General</p>
        <p className="lf-body text-xs mb-4">Core application settings</p>
        <Row label="App Name">
          <input
            value={appName}
            onChange={e => setAppName(e.target.value)}
            className="lf-input w-40 h-8 text-sm"
          />
        </Row>
        <Row label="Support Email">
          <input
            value={supportEmail}
            onChange={e => setSupportEmail(e.target.value)}
            className="lf-input w-52 h-8 text-sm"
          />
        </Row>
        <Row label="Timezone" desc="Used for scheduled broadcasts and reports">
          <select
            value={timezone}
            onChange={e => setTimezone(e.target.value)}
            className="lf-select w-44 h-8 text-sm"
          >
            <option value="utc">UTC+0 — London</option>
            <option value="lag">UTC+1 — Lagos</option>
            <option value="nyc">UTC−5 — New York</option>
          </select>
        </Row>
      </div>

      {/* Feature flags */}
      <div className="lf-panel p-5">
        <p className="lf-card-title mb-0.5">Feature Flags</p>
        <p className="lf-body text-xs mb-4">Enable or disable features for all users</p>
        {(Object.keys(flags) as (keyof typeof flags)[]).map(key => (
          <Row key={key} label={FLAG_LABELS[key]}>
            <Toggle checked={flags[key]} onChange={() => toggleFlag(key)} />
          </Row>
        ))}
      </div>

      {/* Integrations */}
      <div className="lf-panel p-5">
        <p className="lf-card-title mb-0.5">Integrations</p>
        <p className="lf-body text-xs mb-4">Connected services and their current status</p>
        {INTEGRATIONS.map(int => (
          <div key={int.name} className="flex items-center justify-between py-3.5 border-b border-border last:border-0">
            <div>
              <p className="text-sm font-medium text-foreground">{int.name}</p>
              <p className="text-xs text-muted-foreground">{int.role}</p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${INT_STYLE[int.status]}`}>
              {INT_LABEL[int.status]}
            </span>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="lf-panel border-red-200 p-5">
        <p className="lf-card-title text-red-600 mb-0.5">Danger Zone</p>
        <p className="lf-body text-xs mb-4">Irreversible actions — proceed with caution</p>
        <Row label="Export All Data" desc="Download a full CSV of all user and application data">
          <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Export
          </button>
        </Row>
        <Row label="Reset Demo Data" desc="Restore all mock data to its original state">
          <button className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 transition-colors">
            Reset
          </button>
        </Row>
      </div>
    </div>
  )
}
