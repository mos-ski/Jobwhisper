import { useState } from 'react'
import { DollarSign, CreditCard, Save, RotateCcw, Plus, Trash2, CheckCircle2, XCircle, Settings, X } from 'lucide-react'
import { useSort } from '@/hooks/useSort'
import { SortableHeader } from '@/components/shared/SortableHeader'
import { AdminDetailModal } from '@/components/shared/AdminDetailModal'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

interface PlanFeature {
  key: string
  label: string
}

interface PlanConfig {
  id: string
  name: string
  slug: string
  price: number
  ngnPrice?: number
  interval: 'month' | 'year' | 'one-time'
  credits: number
  color: string
  popular: boolean
  description?: string
  geoRestriction?: string
  features: Record<string, boolean | number | string>
}

const PLAN_FEATURES: PlanFeature[] = [
  { key: 'atsCheck', label: 'ATS Resume Check' },
  { key: 'resumeBuilder', label: 'Resume Builder' },
  { key: 'autoApply', label: 'Auto-Apply' },
  { key: 'copilot', label: 'Interview Copilot' },
  { key: 'interviewPrep', label: 'Interview Prep' },
  { key: 'meeting', label: 'Meeting' },
  { key: 'export', label: 'Export Downloads' },
  { key: 'priority', label: 'Priority Support' },
  { key: 'api', label: 'API Access' },
  { key: 'customDomain', label: 'Custom Domain' },
  { key: 'team', label: 'Team Management' },
]

const DEFAULT_PLANS: PlanConfig[] = [
  {
    id: 'non_subscriber', name: 'Non-subscriber', slug: 'non-subscriber', price: 0, ngnPrice: 0, interval: 'month', credits: 5, color: '#94a3b8', popular: false,
    features: { atsCheck: true, resumeBuilder: '1', autoApply: false, copilot: false, interviewPrep: '3', meeting: false, export: false, priority: false, api: false, customDomain: false, team: false },
  },
  {
    id: 'starter', name: 'Starter', slug: 'starter', price: 27, ngnPrice: 5000, interval: 'month', credits: 15, color: '#2dd4bf', popular: false,
    features: { atsCheck: true, resumeBuilder: '5', autoApply: '10', copilot: '5', interviewPrep: '10', meeting: false, export: true, priority: false, api: false, customDomain: false, team: false },
  },
  {
    id: 'pro', name: 'Pro', slug: 'pro', price: 49, ngnPrice: 20000, interval: 'month', credits: 50, color: '#3b82f6', popular: true,
    features: { atsCheck: true, resumeBuilder: '25', autoApply: '50', copilot: '30', interviewPrep: '25', meeting: false, export: true, priority: true, api: false, customDomain: false, team: false },
  },
  {
    id: 'premium', name: 'Premium', slug: 'premium', price: 79, ngnPrice: 50000, interval: 'month', credits: 100, color: '#8b5cf6', popular: false,
    features: { atsCheck: true, resumeBuilder: 'unlimited', autoApply: 'unlimited', copilot: 'unlimited', interviewPrep: 'unlimited', meeting: true, export: true, priority: true, api: true, customDomain: true, team: false },
  },
  {
    id: 'activation', name: 'Activation', slug: 'activation', price: 10, interval: 'one-time', credits: 10, color: '#f59e0b', popular: false,
    description: 'Funnel entry — auto-renews to Pro at $49/mo',
    geoRestriction: 'US/Global only',
    features: { atsCheck: true, resumeBuilder: '3', autoApply: false, copilot: false, interviewPrep: '5', meeting: false, export: false, priority: false, api: false, customDomain: false, team: false },
  },
  {
    id: 'dfy', name: 'Done For You', slug: 'done-for-you', price: 500, interval: 'one-time', credits: 0, color: '#ef4444', popular: false,
    description: 'Full service — includes 3 months of Pro access',
    geoRestriction: 'US/Global only',
    features: { atsCheck: true, resumeBuilder: 'unlimited', autoApply: 'unlimited', copilot: 'unlimited', interviewPrep: 'unlimited', meeting: true, export: true, priority: true, api: false, customDomain: false, team: false },
  },
  {
    id: 'resume-download', name: 'Resume Download', slug: 'resume-download', price: 1.2, ngnPrice: 1200, interval: 'one-time', credits: 0, color: '#06b6d4', popular: false,
    description: 'One-time single resume download — no subscription required',
    features: { atsCheck: false, resumeBuilder: '1', autoApply: false, copilot: false, interviewPrep: false, meeting: false, export: '1', priority: false, api: false, customDomain: false, team: false },
  },
]

const CREDIT_COSTS = [
  { action: 'ATS Resume Check', credits: 1, key: 'ats' },
  { action: 'Resume Build', credits: 2, key: 'resume' },
  { action: 'Auto-Apply (per application)', credits: 1, key: 'auto' },
  { action: 'Copilot Session (per min)', credits: 1, key: 'copilot' },
  { action: 'Interview Practice', credits: 2, key: 'prep' },
  { action: 'Export PDF', credits: 1, key: 'export' },
]

const PRICING_SETTINGS = [
  { label: 'Annual Billing Discount', desc: 'Discount percentage for yearly plans', type: 'number' as const, value: '20' },
  { label: 'Activation Offer Price', desc: 'First-month Pro activation amount before renewal', type: 'number' as const, value: '10' },
  { label: 'Credit Rollover', desc: 'Allow unused credits to roll over to next month', type: 'toggle' as const, checked: true },
  { label: 'Proration', desc: 'Pro-rate charges on plan upgrades/downgrades', type: 'toggle' as const, checked: true },
  { label: 'Grace Period (days)', desc: 'Days after payment failure before suspension', type: 'number' as const, value: '7' },
  { label: 'Refund Window (days)', desc: 'Days after purchase for full refund', type: 'number' as const, value: '14' },
  { label: 'Currency', desc: 'Default billing currency', type: 'select' as const, options: ['USD', 'EUR', 'GBP', 'NGN'] },
  { label: 'Tax Inclusive', desc: 'Include tax in displayed prices', type: 'toggle' as const, checked: false },
]

const ADDONS = [
  { id: 'a1', name: 'Extra 50 Credits', price: 9.99, type: 'credits', active: true },
  { id: 'a2', name: 'Premium Support', price: 19.99, type: 'addon', active: true },
  { id: 'a3', name: 'Team Seat', price: 29.99, type: 'addon', active: true },
  { id: 'a4', name: 'Activation Renewal (Pro)', price: 49, type: 'renewal', active: true },
  { id: 'a5', name: 'DFY Pro Extension (1 mo)', price: 49, type: 'addon', active: true },
  { id: 'a6', name: 'Single Resume Download (US)', price: 1.2, type: 'one-time', active: true },
  { id: 'a7', name: 'Single Resume Download (NG)', price: 1200, type: 'one-time', active: true },
]

// ============================================================
// Modal
// ============================================================
function PlanModal({ plan, onClose, onSave }: { plan: PlanConfig; onClose: () => void; onSave: (p: PlanConfig) => void }) {
  const [form, setForm] = useState({ ...plan })
  const [features, setFeatures] = useState({ ...plan.features })

  const set = (k: string, v: unknown) => setForm(prev => ({ ...prev, [k]: v }))
  const setFeature = (k: string, v: boolean | number | string) => setFeatures(prev => ({ ...prev, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full" style={{ background: form.color }} />
            <h2 className="text-lg font-bold text-foreground">Edit {form.name}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted transition-colors"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Basic Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Plan Name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} className="lf-input h-9 text-sm w-full" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Slug</label>
                <input value={form.slug} onChange={e => set('slug', e.target.value)} className="lf-input h-9 text-sm w-full" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={form.color} onChange={e => set('color', e.target.value)} className="h-9 w-9 rounded border border-border cursor-pointer" />
                  <input value={form.color} onChange={e => set('color', e.target.value)} className="lf-input h-9 text-sm flex-1" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Interval</label>
                <select value={form.interval} onChange={e => set('interval', e.target.value)} className="lf-select h-9 text-sm w-full">
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                  <option value="one-time">One-time</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Description (optional)</label>
              <input value={form.description || ''} onChange={e => set('description', e.target.value)} placeholder="e.g. Funnel entry plan..." className="lf-input h-9 text-sm w-full" />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Pricing</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">USD Price ($)</label>
                <input type="number" value={form.price} onChange={e => set('price', Math.max(0, Number(e.target.value)))} className="lf-input h-9 text-sm w-full" min={0} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">NGN Price (₦)</label>
                <input type="number" value={form.ngnPrice ?? ''} onChange={e => set('ngnPrice', Math.max(0, Number(e.target.value)))} placeholder="N/A" className="lf-input h-9 text-sm w-full" min={0} />
                <p className="text-[10px] text-muted-foreground mt-0.5">Leave empty if not available in NG</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Credits / Month</label>
                <input type="number" value={form.credits} onChange={e => set('credits', Math.max(0, Number(e.target.value)))} className="lf-input h-9 text-sm w-full" min={0} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Geo Restriction</label>
                <input value={form.geoRestriction || ''} onChange={e => set('geoRestriction', e.target.value)} placeholder="None" className="lf-input h-9 text-sm w-full" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.popular} onChange={e => set('popular', e.target.checked)} className="rounded border-border" />
                <span className="text-sm text-foreground">Mark as Most Popular</span>
              </label>
            </div>
          </div>

          {/* Features */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Features</p>
            <div className="space-y-2">
              {PLAN_FEATURES.map(f => {
                const val = features[f.key]
                const isBool = typeof val === 'boolean'
                const strVal = String(val ?? '')
                const isOn = val !== false && val !== 0 && val !== 'false'
                return (
                  <div key={f.key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-foreground">{f.label}</span>
                    {isBool ? (
                      <button onClick={() => setFeature(f.key, !val)} className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${val ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}>
                        <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${val ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          value={isOn && strVal !== 'unlimited' ? 'limited' : strVal === 'unlimited' ? 'unlimited' : 'off'}
                          onChange={e => {
                            if (e.target.value === 'unlimited') setFeature(f.key, 'unlimited')
                            else if (e.target.value === 'limited') {
                              const n = /^\d+$/.test(strVal) ? Number(strVal) : 10
                              setFeature(f.key, n)
                            }
                            else setFeature(f.key, false)
                          }}
                          className="lf-select h-7 text-xs w-24"
                        >
                          <option value="off">Off</option>
                          <option value="limited">Limited</option>
                          <option value="unlimited">Unlimited</option>
                        </select>
                        {strVal !== 'unlimited' && isOn && (
                          <input type="number" value={strVal} onChange={e => setFeature(f.key, Math.max(0, Number(e.target.value)))} className="lf-input h-7 w-16 text-xs text-center" min={0} />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-white rounded-b-2xl">
          <button onClick={onClose} className="lf-btn-outline text-sm">Cancel</button>
          <button onClick={() => onSave({ ...form, features })} className="lf-btn gap-1.5 text-sm">
            <Save className="h-3.5 w-3.5" />Save Plan
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Main Page
// ============================================================
export default function AdminPricing() {
  const [plans, setPlans] = useState<PlanConfig[]>(DEFAULT_PLANS)
  const [editingPlan, setEditingPlan] = useState<PlanConfig | null>(null)
  const [tab, setTab] = useState<'plans' | 'addons' | 'settings'>('plans')
  const [hasChanges, setHasChanges] = useState(false)
  const [selectedAddon, setSelectedAddon] = useState<typeof ADDONS[number] | null>(null)
  const { sortKey, sortDirection, toggleSort, sorted: sortedAddons } = useSort({ data: ADDONS })

  const savePlan = (updated: PlanConfig) => {
    setPlans(prev => prev.map(p => p.id === updated.id ? updated : p))
    setEditingPlan(null)
    setHasChanges(true)
  }

  const resetPlans = () => {
    setPlans(DEFAULT_PLANS)
    setHasChanges(false)
    setEditingPlan(null)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pricing Configuration"
        subtitle="Manage plans, credits, features, and add-ons"
        extra={hasChanges && <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Unsaved changes</span>}
        actions={[
          { label: 'Reset', icon: RotateCcw, onClick: resetPlans, variant: 'outline' },
          { label: 'Save Changes', icon: Save, onClick: () => setHasChanges(false) },
        ]}
        tabs={[
          { key: 'plans', label: 'Plans & Credits' },
          { key: 'addons', label: 'Add-ons' },
          { key: 'settings', label: 'Settings' },
        ]}
        activeTab={tab}
        onTabChange={v => setTab(v as typeof tab)}
      />

      {/* ───── Plans Tab ───── */}
      {tab === 'plans' && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {plans.map(plan => (
              <button key={plan.id} onClick={() => setEditingPlan(plan)} className={`lf-panel p-5 text-left hover:border-foreground/20 transition-all duration-200 group ${editingPlan?.id === plan.id ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground uppercase tracking-wide whitespace-nowrap">Popular</span>}
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ background: plan.color }} />
                  <span className="text-sm font-bold text-foreground">{plan.name}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-xs text-muted-foreground">/{plan.interval === 'one-time' ? 'once' : plan.interval}</span>
                </div>
                {plan.ngnPrice != null && plan.ngnPrice > 0 && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">₦{plan.ngnPrice.toLocaleString()}/mo (NG)</p>
                )}
                {plan.description && <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{plan.description}</p>}
                {plan.geoRestriction && <p className="text-[10px] font-medium text-amber-600 bg-amber-50 rounded px-1.5 py-0.5 mt-1.5 inline-block">{plan.geoRestriction}</p>}
                <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                  <CreditCard className="h-3 w-3" />{plan.credits} credits
                </div>
                <div className="mt-3 pt-3 border-t border-border space-y-1">
                  {PLAN_FEATURES.slice(0, 5).map(f => {
                    const v = plan.features[f.key]
                    const on = v !== false && v !== 0
                    return (
                      <div key={f.key} className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{f.label}</span>
                        {on ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <XCircle className="h-3 w-3 text-muted-foreground/30" />}
                      </div>
                    )
                  })}
                </div>
                <div className="mt-3 flex items-center gap-1 text-[10px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <Settings className="h-3 w-3" />Click to edit
                </div>
              </button>
            ))}
          </div>

          {/* Feature Comparison Table (read-only) */}
          <div className="lf-panel overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="lf-card-title">Feature Comparison</p>
              <p className="lf-body text-xs mt-0.5">Click any plan card above to edit</p>
            </div>
            <div className="overflow-x-auto">
              <table className="lf-table">
                <thead className="lf-table-head">
                  <tr>
                    <th className="lf-table-th sticky left-0 bg-card z-10">Feature</th>
                    {plans.map(p => (
                      <th key={p.id} className="lf-table-th text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                          {p.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLAN_FEATURES.map(f => (
                    <tr key={f.key} className="lf-table-row">
                      <td className="lf-table-cell sticky left-0 bg-card z-10 font-medium text-foreground text-sm">{f.label}</td>
                      {plans.map(p => {
                        const v = p.features[f.key]
                        const on = v !== false && v !== 0
                        return (
                          <td key={p.id} className="lf-table-cell text-center">
                            {typeof v === 'boolean' ? (
                              on ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /> : <XCircle className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                            ) : (
                              <span className={`text-xs font-semibold ${on ? 'text-foreground' : 'text-muted-foreground/30'}`}>{String(v)}</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Credit Costs */}
          <div className="lf-panel p-6">
            <p className="lf-card-title mb-4">Credit Costs (per action)</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CREDIT_COSTS.map(c => (
                <div key={c.key} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm text-foreground">{c.action}</span>
                  <div className="flex items-center gap-1.5">
                    <input defaultValue={c.credits} className="lf-input h-7 w-14 text-sm text-center px-1" min={0} />
                    <span className="text-xs text-muted-foreground">cr</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ───── Add-ons Tab ───── */}
      {tab === 'addons' && (
        <div className="lf-panel overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <p className="lf-card-title">Add-ons & Boosters</p>
            <button className="lf-btn-outline gap-1.5 text-sm"><Plus className="h-3.5 w-3.5" />Add Add-on</button>
          </div>
          <div className="overflow-x-auto">
            <table className="lf-table">
              <thead className="lf-table-head">
                <tr>
                  <SortableHeader label="Add-on" sortKey="name" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Type" sortKey="type" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Price" sortKey="price" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Status" sortKey="active" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <th className="lf-table-th w-20"></th>
                </tr>
              </thead>
              <tbody>
                {sortedAddons.map(a => (
                  <tr key={a.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedAddon(a)}>
                    <td className="lf-table-cell font-medium text-foreground">{a.name}</td>
                    <td className="lf-table-cell"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">{a.type}</span></td>
                    <td className="lf-table-cell tabular-nums font-semibold">${a.price}{a.type === 'addon' || a.type === 'renewal' ? '/mo' : ''}</td>
                    <td className="lf-table-cell">
                      <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${a.active ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}>
                        <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${a.active ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </td>
                    <td className="lf-table-cell"><button onClick={(event) => event.stopPropagation()} className="text-muted-foreground hover:text-red-600 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───── Settings Tab ───── */}
      {tab === 'settings' && (
        <div className="lf-panel p-6 max-w-2xl space-y-4">
          <p className="lf-card-title">Pricing Settings</p>
          {PRICING_SETTINGS.map(item => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              {item.type === 'toggle' ? (
                <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${item.checked ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                  <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${item.checked ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              ) : item.type === 'number' ? (
                <input defaultValue={item.value} className="lf-input w-20 h-8 text-sm text-center" />
              ) : (
                <select defaultValue={item.options?.[0]} className="lf-select h-8 text-sm w-auto">
                  {item.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ───── Edit Modal ───── */}
      {editingPlan && <PlanModal plan={editingPlan} onClose={() => setEditingPlan(null)} onSave={savePlan} />}
      {selectedAddon && (
        <AdminDetailModal
          title={selectedAddon.name}
          subtitle={selectedAddon.type}
          onClose={() => setSelectedAddon(null)}
          fields={[
            { label: 'Price', value: `$${selectedAddon.price}` },
            { label: 'Type', value: selectedAddon.type },
            { label: 'Status', value: selectedAddon.active ? 'Active' : 'Inactive' },
            { label: 'Billing Behavior', value: selectedAddon.type === 'credits' ? 'Adds credits to account' : selectedAddon.type === 'one-time' ? 'One-time purchase' : selectedAddon.type === 'renewal' ? 'Plan renewal' : 'Recurring add-on' },
          ]}
        />
      )}
    </div>
  )
}
