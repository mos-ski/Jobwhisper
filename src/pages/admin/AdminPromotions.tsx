import { useState } from 'react'
import { Search, Plus, Megaphone, Eye, MousePointerClick, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCoupons, useCreateCoupon, useUpdateCoupon } from '@/hooks/useAdmin'
import type { Coupon } from '@/lib/adminMockData'
import { useSort } from '@/hooks/useSort'
import { SortableHeader } from '@/components/shared/SortableHeader'
import type { TimePeriod } from '@/components/shared/TimelineFilter'
import { AdminDetailModal } from '@/components/shared/AdminDetailModal'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

type PromoTab = 'promotions' | 'coupons'

const MOCK_PROMOTIONS = [
  { id: '1', name: 'Summer Job Hunt Sale', type: 'Percentage Discount', value: '20%', audience: 'All Users', startDate: '2026-06-01', endDate: '2026-08-31', status: 'active', code: 'SUMMER20', views: 4521, clicks: 1247, conversions: 312 },
  { id: '2', name: 'Welcome Campaign', type: 'Percentage Discount', value: '30%', audience: 'New Signups', startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', code: 'WELCOME30', views: 12400, clicks: 5600, conversions: 1890 },
  { id: '3', name: 'Win-Back Inactive Users', type: 'Fixed Discount', value: '$10', audience: 'Inactive 30+ days', startDate: '2026-06-15', endDate: '2026-07-15', status: 'active', code: 'COMEBACK10', views: 890, clicks: 234, conversions: 67 },
  { id: '4', name: 'Referral Boost', type: 'Lifetime Discount', value: '40%', audience: 'Referral Partners', startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', code: 'REF40', views: 3200, clicks: 1100, conversions: 450 },
  { id: '5', name: 'Black Friday 2025', type: 'Percentage Discount', value: '50%', audience: 'All Users', startDate: '2025-11-25', endDate: '2025-12-01', status: 'ended', code: 'BLACKFRIDAY50', views: 8900, clicks: 3400, conversions: 1200 },
  { id: '6', name: 'New Year Kickoff', type: 'Percentage Discount', value: '25%', audience: 'All Users', startDate: '2025-12-26', endDate: '2026-01-15', status: 'ended', code: 'NEWYEAR25', views: 6700, clicks: 2100, conversions: 567 },
]

const PROMO_STATUS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  ended: 'bg-muted text-muted-foreground',
  scheduled: 'bg-amber-50 text-amber-700',
}

function CreateCouponModal({ onClose }: { onClose: () => void }) {
  const createCoupon = useCreateCoupon()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [discountValue, setDiscountValue] = useState('')
  const [maxUses, setMaxUses] = useState('')
  const [expiresAt, setExpiresAt] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !code || !discountValue) return
    createCoupon.mutate({
      name,
      code,
      discountType,
      discountValue: Number(discountValue),
      duration: 'Custom',
      maxUses: maxUses ? Number(maxUses) : 9999,
      status: 'active',
      expiresAt: expiresAt || '2026-12-31',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="lf-panel w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="lf-card-title">Create Coupon</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="lf-label block mb-1.5">Name <span className="text-red-500">*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Welcome Offer" className="lf-input" />
          </div>
          <div>
            <label className="lf-label block mb-1.5">Code <span className="text-red-500">*</span></label>
            <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. WELCOME20" className="lf-input font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="lf-label block mb-1.5">Type</label>
              <select value={discountType} onChange={e => setDiscountType(e.target.value as any)} className="lf-select">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
            <div>
              <label className="lf-label block mb-1.5">Value <span className="text-red-500">*</span></label>
              <input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder={discountType === 'percentage' ? '20' : '10'} className="lf-input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="lf-label block mb-1.5">Max Uses</label>
              <input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)} placeholder="9999" className="lf-input" />
            </div>
            <div>
              <label className="lf-label block mb-1.5">Expires</label>
              <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="lf-input" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button type="submit" className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function PromotionsView() {
  const [selectedPromo, setSelectedPromo] = useState<typeof MOCK_PROMOTIONS[number] | null>(null)
  const activePromos = MOCK_PROMOTIONS.filter(p => p.status === 'active').length
  const totalViews = MOCK_PROMOTIONS.reduce((s, p) => s + p.views, 0)
  const totalConversions = MOCK_PROMOTIONS.reduce((s, p) => s + p.conversions, 0)
  const overallConversionRate = totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(1) : '0'

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Active Promotions', value: String(activePromos), icon: Megaphone },
          { label: 'Total Impressions', value: totalViews.toLocaleString(), icon: Eye },
          { label: 'Total Clicks', value: MOCK_PROMOTIONS.reduce((s, p) => s + p.clicks, 0).toLocaleString(), icon: MousePointerClick },
          { label: 'Conversion Rate', value: `${overallConversionRate}%`, icon: Calendar },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="lf-panel p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{label}</p>
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Promotions list */}
      <div className="space-y-3">
        {MOCK_PROMOTIONS.map(promo => (
          <button key={promo.id} onClick={() => setSelectedPromo(promo)} className="lf-panel block w-full p-5 text-left transition-colors hover:border-primary/30">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-foreground">{promo.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${PROMO_STATUS[promo.status]}`}>{promo.status}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                  <span>Code: <code className="rounded bg-muted px-1 font-mono">{promo.code}</code></span>
                  <span>Discount: {promo.value}</span>
                  <span>Audience: {promo.audience}</span>
                  <span>{promo.startDate} → {promo.endDate}</span>
                </div>
              </div>
              <div className="flex gap-4 shrink-0 text-right">
                <div>
                  <p className="text-xs text-muted-foreground">Views</p>
                  <p className="text-sm font-semibold text-foreground tabular-nums">{promo.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Clicks</p>
                  <p className="text-sm font-semibold text-foreground tabular-nums">{promo.clicks.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Conversions</p>
                  <p className="text-sm font-semibold text-foreground tabular-nums">{promo.conversions.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      {selectedPromo && (
        <AdminDetailModal
          title={selectedPromo.name}
          subtitle={`${selectedPromo.code} · ${selectedPromo.audience}`}
          onClose={() => setSelectedPromo(null)}
          fields={[
            { label: 'Type', value: selectedPromo.type },
            { label: 'Value', value: selectedPromo.value },
            { label: 'Status', value: selectedPromo.status },
            { label: 'Audience', value: selectedPromo.audience },
            { label: 'Start Date', value: selectedPromo.startDate },
            { label: 'End Date', value: selectedPromo.endDate },
            { label: 'Views', value: selectedPromo.views.toLocaleString() },
            { label: 'Clicks', value: selectedPromo.clicks.toLocaleString() },
            { label: 'Conversions', value: selectedPromo.conversions.toLocaleString() },
            { label: 'Click Rate', value: `${((selectedPromo.clicks / selectedPromo.views) * 100).toFixed(1)}%` },
          ]}
        />
      )}
    </div>
  )
}

function CouponsView() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const updateCoupon = useUpdateCoupon()
  const { data, isLoading } = useCoupons({ search, status: statusFilter })

  const coupons = data?.coupons ?? []
  const { sortKey, sortDirection, toggleSort, sorted: sortedCoupons } = useSort({ data: coupons })
  const active = coupons.filter(c => c.status === 'active').length
  const inactive = coupons.filter(c => c.status === 'inactive' || c.status === 'expired').length

  return (
    <div>
      {showCreate && <CreateCouponModal onClose={() => setShowCreate(false)} />}

      <div className="flex gap-8 px-5 py-4 border-b border-border">
        <div><p className="text-2xl font-bold text-foreground">{coupons.length}</p><p className="text-xs text-muted-foreground mt-0.5">Total Coupons</p></div>
        <div><p className="text-2xl font-bold text-foreground">{active}</p><p className="text-xs text-muted-foreground mt-0.5">Active</p></div>
        <div><p className="text-2xl font-bold text-foreground">{inactive}</p><p className="text-xs text-muted-foreground mt-0.5">Inactive/Expired</p></div>
      </div>

      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input placeholder="Search coupons..." value={search} onChange={e => setSearch(e.target.value)} className="lf-input pl-9 h-9" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="lf-select h-9 text-sm">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
            <Plus className="h-3.5 w-3.5" />Create
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Loading coupons...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <SortableHeader label="Name" sortKey="name" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="lf-table-th" />
                <SortableHeader label="Discount" sortKey="discountValue" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="lf-table-th" />
                <SortableHeader label="Duration" sortKey="duration" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="lf-table-th hidden md:table-cell" />
                <SortableHeader label="Uses" sortKey="usageCount" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="lf-table-th hidden md:table-cell" />
                <SortableHeader label="Code" sortKey="code" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="lf-table-th" />
                <SortableHeader label="Status" sortKey="status" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="lf-table-th" />
                <th className="lf-table-th w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedCoupons.map(c => (
                <tr key={c.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedCoupon(c)}>
                  <td className="lf-table-cell font-medium text-foreground">{c.name}</td>
                  <td className="lf-table-cell text-muted-foreground">
                    {c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`}
                  </td>
                  <td className="lf-table-cell hidden md:table-cell text-muted-foreground">{c.duration}</td>
                  <td className="lf-table-cell hidden md:table-cell">
                    <span className="tabular-nums">{c.usageCount}/{c.maxUses}</span>
                  </td>
                  <td className="lf-table-cell">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">{c.code}</code>
                  </td>
                  <td className="lf-table-cell">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      c.status === 'active' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                    }`}>{c.status}</span>
                  </td>
                  <td className="lf-table-cell">
                    <button
                      onClick={(event) => {
                        event.stopPropagation()
                        updateCoupon.mutate({ id: c.id, updates: { status: c.status === 'active' ? 'inactive' : 'active' } })
                      }}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {c.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedCoupon && (
        <AdminDetailModal
          title={selectedCoupon.name}
          subtitle={selectedCoupon.code}
          onClose={() => setSelectedCoupon(null)}
          fields={[
            { label: 'Discount', value: selectedCoupon.discountType === 'percentage' ? `${selectedCoupon.discountValue}%` : `$${selectedCoupon.discountValue}` },
            { label: 'Duration', value: selectedCoupon.duration },
            { label: 'Status', value: selectedCoupon.status },
            { label: 'Usage', value: `${selectedCoupon.usageCount}/${selectedCoupon.maxUses}` },
            { label: 'Created', value: selectedCoupon.createdAt },
            { label: 'Expires', value: selectedCoupon.expiresAt },
          ]}
        />
      )}
    </div>
  )
}

function CreatePromotionModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [type, setType] = useState<'Percentage Discount' | 'Fixed Discount' | 'Lifetime Discount'>('Percentage Discount')
  const [value, setValue] = useState('')
  const [audience, setAudience] = useState('All Users')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !code || !value) return
    // TODO: wire to mutation
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="lf-panel w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="lf-card-title">Create Promotion</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="lf-label block mb-1.5">Name <span className="text-red-500">*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Summer Sale" className="lf-input" />
          </div>
          <div>
            <label className="lf-label block mb-1.5">Code <span className="text-red-500">*</span></label>
            <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. SUMMER20" className="lf-input font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="lf-label block mb-1.5">Type</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className="lf-select">
                <option value="Percentage Discount">Percentage Discount</option>
                <option value="Fixed Discount">Fixed Discount</option>
                <option value="Lifetime Discount">Lifetime Discount</option>
              </select>
            </div>
            <div>
              <label className="lf-label block mb-1.5">Value <span className="text-red-500">*</span></label>
              <input value={value} onChange={e => setValue(e.target.value)} placeholder={type === 'Fixed Discount' ? '$10' : '20%'} className="lf-input" />
            </div>
          </div>
          <div>
            <label className="lf-label block mb-1.5">Audience</label>
            <select value={audience} onChange={e => setAudience(e.target.value)} className="lf-select">
              <option>All Users</option>
              <option>New Signups</option>
              <option>Pro Users</option>
              <option>Premium Users</option>
              <option>Inactive 30+ days</option>
              <option>Referral Partners</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="lf-label block mb-1.5">Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="lf-input" />
            </div>
            <div>
              <label className="lf-label block mb-1.5">End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="lf-input" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button type="submit" className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminPromotions() {
  const [tab, setTab] = useState<PromoTab>('promotions')
  const [period, setPeriod] = useState<TimePeriod>('12m')
  const [showCreatePromo, setShowCreatePromo] = useState(false)

  return (
    <div className="space-y-6">
      {showCreatePromo && <CreatePromotionModal onClose={() => setShowCreatePromo(false)} />}
      <AdminPageHeader
        title="Promotions"
        actions={[{ label: 'Create Promotion', icon: Plus, onClick: () => setShowCreatePromo(true) }]}
        period={period}
        onPeriodChange={setPeriod}
      />

      <div className="lf-panel overflow-hidden">
        <div className="lf-tabs px-4 pt-1 gap-0">
          {[{ key: 'promotions', label: 'Promotions' }, { key: 'coupons', label: 'Coupons' }].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as PromoTab)}
              className={cn('lf-tab px-4 py-2.5', tab === t.key && 'lf-tab-active')}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'promotions' ? <PromotionsView /> : <CouponsView />}
      </div>
    </div>
  )
}
