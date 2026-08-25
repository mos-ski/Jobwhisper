import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTemplates, useToggleTemplate } from '@/hooks/useAdmin'
import type { ResumeTemplate } from '@/lib/adminMockData'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

type Category = ResumeTemplate['category']

const CATEGORY_COLORS: Record<Category, string> = {
  'Professional': 'bg-primary text-white',
  'Creative': 'bg-violet-100 text-violet-700',
  'ATS-Optimised': 'bg-teal-50 text-teal-700',
  'Executive': 'bg-amber-50 text-amber-700',
  'Modern': 'bg-blue-50 text-blue-700',
}

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

function AddTemplateModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('Professional')
  const [atsScore, setAtsScore] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="lf-panel w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="lf-card-title">Add Template</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="lf-label block mb-1.5">Name <span className="text-red-500">*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Modern Blue" className="lf-input" />
          </div>
          <div>
            <label className="lf-label block mb-1.5">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as Category)} className="lf-select">
              <option>Professional</option>
              <option>Creative</option>
              <option>ATS-Optimised</option>
              <option>Executive</option>
              <option>Modern</option>
            </select>
          </div>
          <div>
            <label className="lf-label block mb-1.5">ATS Score</label>
            <input type="number" value={atsScore} onChange={e => setAtsScore(e.target.value)} placeholder="85" className="lf-input" />
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

export default function AdminResumeTemplates() {
  const { data, isLoading } = useTemplates()
  const toggleTemplate = useToggleTemplate()
  const [showAddTemplate, setShowAddTemplate] = useState(false)

  const templates = data?.templates ?? []
  const activeCount = data?.active ?? 0
  const usedThisMonth = data?.usedThisMonth ?? 0
  const avgAts = data?.avgAts ?? 0

  return (
    <div className="space-y-6">
      {showAddTemplate && <AddTemplateModal onClose={() => setShowAddTemplate(false)} />}
      <AdminPageHeader
        title="Resume Templates"
        subtitle="Manage templates available to all students"
        actions={[{ label: 'Add Template', icon: Plus, onClick: () => setShowAddTemplate(true) }]}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Templates', value: String(data?.total ?? 0) },
          { label: 'Active', value: String(activeCount), sub: `${templates.length - activeCount} inactive` },
          { label: 'Used This Month', value: usedThisMonth.toLocaleString(), sub: 'across all students' },
          { label: 'Avg ATS Score', value: `${avgAts}/100`, sub: 'across all templates' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="lf-panel p-5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1.5 text-2xl font-bold text-foreground">{value}</p>
            {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="lf-panel p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-3 bg-muted rounded w-16 mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map(t => (
            <div key={t.id} className={`lf-panel p-4 ${!t.active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${CATEGORY_COLORS[t.category]}`}>
                    {t.category}
                  </span>
                </div>
                <Toggle checked={t.active} onChange={() => toggleTemplate.mutate(t.id)} />
              </div>

              <div className="space-y-1.5 text-xs border-t border-border pt-3">
                {[
                  ['Uses', t.usageCount.toLocaleString()],
                  ['ATS Score', `${t.atsScore}/100`],
                  ['Updated', t.lastUpdated],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium text-foreground">{v}</span>
                  </div>
                ))}
              </div>

              <button className="mt-3 w-full rounded-lg border border-border py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                Preview
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
