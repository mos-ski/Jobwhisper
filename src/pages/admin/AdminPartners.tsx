import { useState } from 'react'
import { TrendingUp, ArrowUpRight, Users, DollarSign, MousePointerClick, Gift, Search, Download, ChevronRight, BarChart3, Settings, Save, Eye, Zap, Star, Target, Plus } from 'lucide-react'
import { useSort } from '@/hooks/useSort'
import { SortableHeader } from '@/components/shared/SortableHeader'
import type { TimePeriod } from '@/components/shared/TimelineFilter'
import { AdminDetailModal } from '@/components/shared/AdminDetailModal'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

const PARTNERS = [
  { id: 'p1', name: 'TechHire Academy', email: 'partners@techhire.io', type: 'Creator', status: 'active', referrals: 1247, revenue: 49880, commission: 7482, conversionRate: 34.2, joinDate: '2025-11-15', lastActive: '2 hr ago', tier: 'Gold' },
  { id: 'p2', name: 'CareerBoost Pro', email: 'team@careerboost.com', type: 'Creator', status: 'active', referrals: 892, revenue: 35680, commission: 5352, conversionRate: 31.8, joinDate: '2025-12-01', lastActive: '5 hr ago', tier: 'Silver' },
  { id: 'p3', name: 'ResumeLab', email: 'biz@resumelab.co', type: 'Creator', status: 'active', referrals: 2134, revenue: 85360, commission: 12804, conversionRate: 38.7, joinDate: '2025-10-20', lastActive: '1 hr ago', tier: 'Platinum' },
  { id: 'p4', name: 'JobReady Bootcamp', email: 'partnerships@jobready.dev', type: 'Referral', status: 'active', referrals: 567, revenue: 22680, commission: 3402, conversionRate: 28.4, joinDate: '2026-01-10', lastActive: '1 day ago', tier: 'Bronze' },
  { id: 'p5', name: 'HireVue Prep', email: 'team@hirevueprep.com', type: 'Creator', status: 'active', referrals: 1089, revenue: 43560, commission: 6534, conversionRate: 36.1, joinDate: '2025-09-05', lastActive: '3 hr ago', tier: 'Gold' },
  { id: 'p6', name: 'SkillBridge', email: 'hello@skillbridge.io', type: 'Referral', status: 'paused', referrals: 234, revenue: 9360, commission: 1404, conversionRate: 22.3, joinDate: '2026-03-18', lastActive: '5 days ago', tier: 'Bronze' },
  { id: 'p7', name: 'PathForward Careers', email: 'admin@pathforward.co', type: 'Creator', status: 'active', referrals: 1567, revenue: 62680, commission: 9402, conversionRate: 33.5, joinDate: '2025-08-12', lastActive: '4 hr ago', tier: 'Gold' },
  { id: 'p8', name: 'TalentForge', email: 'partners@talentforge.com', type: 'Creator', status: 'active', referrals: 756, revenue: 30240, commission: 4536, conversionRate: 29.9, joinDate: '2026-02-28', lastActive: '6 hr ago', tier: 'Silver' },
  { id: 'p9', name: 'CareerSpark', email: 'biz@careerspark.app', type: 'Referral', status: 'inactive', referrals: 89, revenue: 3560, commission: 534, conversionRate: 18.7, joinDate: '2026-05-01', lastActive: '2 weeks ago', tier: 'Bronze' },
  { id: 'p10', name: 'NextStep Learning', email: 'team@nextstep.edu', type: 'Creator', status: 'active', referrals: 1823, revenue: 72920, commission: 10938, conversionRate: 35.8, joinDate: '2025-07-22', lastActive: '30 min ago', tier: 'Platinum' },
]

const PARTNER_REFERRALS: Record<string, Array<{ id: string; userName: string; email: string; plan: string; amount: number; commission: number; status: string; date: string }>> = {
  p1: [
    { id: 'r1', userName: 'Marcus Chen', email: 'marcus@example.com', plan: 'Pro', amount: 49, commission: 24.50, status: 'converted', date: '2026-07-10' },
    { id: 'r2', userName: 'Jessica Williams', email: 'jessica@example.com', plan: 'Premium', amount: 79, commission: 39.50, status: 'converted', date: '2026-07-09' },
    { id: 'r3', userName: 'Omar Khan', email: 'omar@example.com', plan: 'Starter', amount: 27, commission: 13.50, status: 'converted', date: '2026-07-08' },
    { id: 'r4', userName: 'Sarah Johnson', email: 'sarah@example.com', plan: 'Pro', amount: 49, commission: 24.50, status: 'active', date: '2026-07-07' },
    { id: 'r5', userName: 'Carlos Rodriguez', email: 'carlos@example.com', plan: 'Pro', amount: 49, commission: 24.50, status: 'active', date: '2026-07-05' },
  ],
  p3: [
    { id: 'r8', userName: 'Tyler Washington', email: 'tyler@example.com', plan: 'Premium', amount: 79, commission: 39.50, status: 'converted', date: '2026-07-10' },
    { id: 'r9', userName: 'Priya Patel', email: 'priya@example.com', plan: 'Pro', amount: 49, commission: 24.50, status: 'converted', date: '2026-07-09' },
    { id: 'r10', userName: 'Mia Garcia', email: 'mia@example.com', plan: 'Pro', amount: 49, commission: 24.50, status: 'active', date: '2026-07-08' },
  ],
  p10: [
    { id: 'r17', userName: 'Leo Hernandez', email: 'leo@example.com', plan: 'Pro', amount: 49, commission: 24.50, status: 'converted', date: '2026-07-10' },
    { id: 'r18', userName: 'Zoe Campbell', email: 'zoe@example.com', plan: 'Premium', amount: 79, commission: 39.50, status: 'converted', date: '2026-07-09' },
  ],
}

const TIER_COLORS: Record<string, string> = {
  Platinum: 'bg-violet-50 text-violet-700',
  Gold: 'bg-amber-50 text-amber-700',
  Silver: 'bg-slate-100 text-slate-600',
  Bronze: 'bg-orange-50 text-orange-700',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  paused: 'bg-amber-50 text-amber-700',
  inactive: 'bg-muted text-muted-foreground',
}

const REFERRAL_STATUS_COLORS: Record<string, string> = {
  converted: 'bg-emerald-50 text-emerald-700',
  active: 'bg-blue-50 text-blue-700',
  activation: 'bg-amber-50 text-amber-700',
  churned: 'bg-red-50 text-red-600',
}

type Tab = 'overview' | 'partners' | 'settings'

function InvitePartnerModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType] = useState('Creator')
  const [commission, setCommission] = useState('15')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="lf-panel w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="lf-card-title">Invite Partner</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="lf-label block mb-1.5">Partner Name <span className="text-red-500">*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. TechHire Academy" className="lf-input" />
          </div>
          <div>
            <label className="lf-label block mb-1.5">Email <span className="text-red-500">*</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="partners@example.com" className="lf-input" />
          </div>
          <div>
            <label className="lf-label block mb-1.5">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="lf-select">
              <option>Creator</option>
              <option>Referral</option>
            </select>
          </div>
          <div>
            <label className="lf-label block mb-1.5">Commission %</label>
            <input type="number" value={commission} onChange={e => setCommission(e.target.value)} placeholder="15" className="lf-input" />
          </div>
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button type="submit" className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">Send Invite</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminPartners() {
  const [tab, setTab] = useState<Tab>('overview')
  const [period, setPeriod] = useState<TimePeriod>('12m')
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [selectedPartner, setSelectedPartner] = useState<typeof PARTNERS[0] | null>(null)
  const [selectedReferral, setSelectedReferral] = useState<(typeof PARTNER_REFERRALS)[string][number] | null>(null)
  const [referralSearch, setReferralSearch] = useState('')
  const [showInvitePartner, setShowInvitePartner] = useState(false)

  const filtered = PARTNERS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
    const matchTier = tierFilter === 'all' || p.tier.toLowerCase() === tierFilter
    return matchSearch && matchTier
  })

  const referrals = selectedPartner ? (PARTNER_REFERRALS[selectedPartner.id] || []) : []
  const filteredReferrals = referrals.filter(r =>
    r.userName.toLowerCase().includes(referralSearch.toLowerCase()) ||
    r.email.toLowerCase().includes(referralSearch.toLowerCase())
  )

  const { sortKey: tpSortKey, sortDirection: tpSortDirection, toggleSort: tpToggleSort, sorted: sortedTopPartners } = useSort({ data: PARTNERS })
  const { sortKey: apSortKey, sortDirection: apSortDirection, toggleSort: apToggleSort, sorted: sortedAllPartners } = useSort({ data: filtered })
  const { sortKey: rSortKey, sortDirection: rSortDirection, toggleSort: rToggleSort, sorted: sortedReferrals } = useSort({ data: filteredReferrals })

  const totalRevenue = PARTNERS.reduce((s, p) => s + p.revenue, 0)
  const totalCommission = PARTNERS.reduce((s, p) => s + p.commission, 0)
  const totalReferrals = PARTNERS.reduce((s, p) => s + p.referrals, 0)

  if (selectedPartner) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          breadcrumb={[
            { label: 'Partners', onClick: () => { setSelectedPartner(null); setSelectedReferral(null); setReferralSearch('') } },
            { label: selectedPartner.name },
          ]}
          title={selectedPartner.name}
          badge={selectedPartner.tier}
          badgeClassName={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIER_COLORS[selectedPartner.tier]}`}
          subtitle={`${selectedPartner.email} · ${selectedPartner.type} · Joined ${selectedPartner.joinDate}`}
          actions={[{ label: 'Export Referrals', icon: Download, variant: 'outline', onClick: () => {} }]}
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Total Referrals', value: selectedPartner.referrals.toLocaleString(), icon: MousePointerClick },
            { label: 'Total Revenue', value: `$${selectedPartner.revenue.toLocaleString()}`, icon: DollarSign },
            { label: 'Commission Earned', value: `$${selectedPartner.commission.toLocaleString()}`, icon: Gift },
            { label: 'Conversion Rate', value: `${selectedPartner.conversionRate}%`, icon: BarChart3 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="lf-panel p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-xl font-bold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        <div className="lf-panel overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <p className="lf-card-title">Referrals ({referrals.length})</p>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input value={referralSearch} onChange={e => setReferralSearch(e.target.value)} placeholder="Search referrals..." className="lf-input h-8 pl-8 w-56 text-sm" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="lf-table">
              <thead className="lf-table-head">
                <tr>
                  <SortableHeader label="User" sortKey="userName" activeSortKey={rSortKey} sortDirection={rSortDirection} onToggleSort={rToggleSort} />
                  <SortableHeader label="Plan" sortKey="plan" activeSortKey={rSortKey} sortDirection={rSortDirection} onToggleSort={rToggleSort} className="hidden sm:table-cell" />
                  <SortableHeader label="Amount" sortKey="amount" activeSortKey={rSortKey} sortDirection={rSortDirection} onToggleSort={rToggleSort} />
                  <SortableHeader label="Commission" sortKey="commission" activeSortKey={rSortKey} sortDirection={rSortDirection} onToggleSort={rToggleSort} />
                  <SortableHeader label="Status" sortKey="status" activeSortKey={rSortKey} sortDirection={rSortDirection} onToggleSort={rToggleSort} />
                  <SortableHeader label="Date" sortKey="date" activeSortKey={rSortKey} sortDirection={rSortDirection} onToggleSort={rToggleSort} className="hidden sm:table-cell" />
                </tr>
              </thead>
              <tbody>
                {sortedReferrals.map(r => (
                  <tr key={r.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedReferral(r)}>
                    <td className="lf-table-cell">
                      <div>
                        <p className="font-medium text-foreground">{r.userName}</p>
                        <p className="text-xs text-muted-foreground">{r.email}</p>
                      </div>
                    </td>
                    <td className="lf-table-cell hidden sm:table-cell">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{r.plan}</span>
                    </td>
                    <td className="lf-table-cell tabular-nums">${r.amount}</td>
                    <td className="lf-table-cell tabular-nums font-semibold text-emerald-600">${r.commission.toFixed(2)}</td>
                    <td className="lf-table-cell">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${REFERRAL_STATUS_COLORS[r.status]}`}>{r.status}</span>
                    </td>
                    <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{r.date}</td>
                  </tr>
                ))}
                {filteredReferrals.length === 0 && (
                  <tr><td colSpan={6} className="lf-table-cell text-center text-muted-foreground py-8">{referralSearch ? 'No referrals match search' : 'No referrals yet'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {selectedReferral && (
          <AdminDetailModal
            title={selectedReferral.userName}
            subtitle={selectedReferral.email}
            onClose={() => setSelectedReferral(null)}
            fields={[
              { label: 'Partner', value: selectedPartner.name },
              { label: 'Plan', value: selectedReferral.plan },
              { label: 'Amount', value: `$${selectedReferral.amount}` },
              { label: 'Commission', value: `$${selectedReferral.commission.toFixed(2)}` },
              { label: 'Status', value: selectedReferral.status },
              { label: 'Date', value: selectedReferral.date },
            ]}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showInvitePartner && <InvitePartnerModal onClose={() => setShowInvitePartner(false)} />}
      <AdminPageHeader
        title="Partners & Affiliates"
        subtitle="Creator Program — commissions, bonuses, tiers, and partner management"
        actions={[{ label: 'Invite Partner', icon: Plus, onClick: () => setShowInvitePartner(true) }]}
        period={period}
        onPeriodChange={setPeriod}
        tabs={[
          { key: 'overview', label: 'Overview' },
          { key: 'partners', label: 'All Partners' },
          { key: 'settings', label: 'Program Settings' },
        ]}
        activeTab={tab}
        onTabChange={v => setTab(v as typeof tab)}
      />

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Total Partners', value: String(PARTNERS.length), icon: Users },
              { label: 'Total Referrals', value: totalReferrals.toLocaleString(), icon: MousePointerClick },
              { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign },
              { label: 'Total Commissions', value: `$${totalCommission.toLocaleString()}`, icon: Gift },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="lf-panel p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <p className="text-xl font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>

          {/* Program Structure */}
          <div className="lf-panel p-6">
            <p className="lf-card-title mb-4">Creator Program Structure</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><DollarSign className="h-4 w-4 text-primary" /></div>
                  <p className="text-sm font-semibold text-foreground">50% Recurring Commission</p>
                </div>
                <p className="text-xs text-muted-foreground">Partners earn 50% of every subscriber's monthly payment. Starter $13.50/mo, Pro $24.50/mo, Premium $39.50/mo.</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Star className="h-4 w-4 text-emerald-600" /></div>
                  <p className="text-sm font-semibold text-foreground">$20 Base Pay Per Video</p>
                </div>
                <p className="text-xs text-muted-foreground">Creators get $20 for every video that meets guidelines. Post 3-4 videos/week on TikTok and Instagram.</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center"><Zap className="h-4 w-4 text-amber-600" /></div>
                  <p className="text-sm font-semibold text-foreground">Viral Bonuses</p>
                </div>
                <p className="text-xs text-muted-foreground">10K views = $40, 25K = $75, 50K = $150, 100K = $250, 500K = $500, 1M = $1,000.</p>
              </div>
            </div>
          </div>

          {/* Tier Breakdown */}
          <div className="lf-panel p-6">
            <p className="lf-card-title mb-4">Tier Breakdown</p>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { tier: 'Platinum', minReferrals: '1,500+', color: 'bg-violet-500', perks: '60% commission, exclusive events, advisory role', count: PARTNERS.filter(p => p.tier === 'Platinum').length },
                { tier: 'Gold', minReferrals: '800+', color: 'bg-amber-500', perks: '55% commission, priority support, bonus $500', count: PARTNERS.filter(p => p.tier === 'Gold').length },
                { tier: 'Silver', minReferrals: '300+', color: 'bg-slate-400', perks: '50% commission, standard support', count: PARTNERS.filter(p => p.tier === 'Silver').length },
                { tier: 'Bronze', minReferrals: '0', color: 'bg-orange-500', perks: '50% commission, onboarding materials', count: PARTNERS.filter(p => p.tier === 'Bronze').length },
              ].map(t => (
                <div key={t.tier} className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`h-3 w-3 rounded-full ${t.color}`} />
                    <p className="text-sm font-semibold text-foreground">{t.tier}</p>
                    <span className="ml-auto text-xs font-bold text-muted-foreground">{t.count}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-1">{t.minReferrals} referrals</p>
                  <p className="text-xs text-foreground">{t.perks}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Partners */}
          <div className="lf-panel overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="lf-card-title">Top Partners</p>
            </div>
            <div className="overflow-x-auto">
              <table className="lf-table">
                <thead className="lf-table-head">
                  <tr>
                    <SortableHeader label="Partner" sortKey="name" activeSortKey={tpSortKey} sortDirection={tpSortDirection} onToggleSort={tpToggleSort} />
                    <SortableHeader label="Tier" sortKey="tier" activeSortKey={tpSortKey} sortDirection={tpSortDirection} onToggleSort={tpToggleSort} className="hidden md:table-cell" />
                    <SortableHeader label="Referrals" sortKey="referrals" activeSortKey={tpSortKey} sortDirection={tpSortDirection} onToggleSort={tpToggleSort} />
                    <SortableHeader label="Revenue" sortKey="revenue" activeSortKey={tpSortKey} sortDirection={tpSortDirection} onToggleSort={tpToggleSort} className="hidden sm:table-cell" />
                    <SortableHeader label="Commission" sortKey="commission" activeSortKey={tpSortKey} sortDirection={tpSortDirection} onToggleSort={tpToggleSort} className="hidden sm:table-cell" />
                    <SortableHeader label="Conversion" sortKey="conversionRate" activeSortKey={tpSortKey} sortDirection={tpSortDirection} onToggleSort={tpToggleSort} className="hidden lg:table-cell" />
                    <SortableHeader label="Status" sortKey="status" activeSortKey={tpSortKey} sortDirection={tpSortDirection} onToggleSort={tpToggleSort} />
                    <th className="lf-table-th w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTopPartners.slice(0, 5).map(p => (
                    <tr key={p.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedPartner(p)}>
                      <td className="lf-table-cell">
                        <div>
                          <p className="font-medium text-foreground">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.email}</p>
                        </div>
                      </td>
                      <td className="lf-table-cell hidden md:table-cell">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIER_COLORS[p.tier]}`}>{p.tier}</span>
                      </td>
                      <td className="lf-table-cell tabular-nums font-semibold">{p.referrals.toLocaleString()}</td>
                      <td className="lf-table-cell hidden sm:table-cell tabular-nums">${p.revenue.toLocaleString()}</td>
                      <td className="lf-table-cell hidden sm:table-cell tabular-nums font-semibold text-emerald-600">${p.commission.toLocaleString()}</td>
                      <td className="lf-table-cell hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-10 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${p.conversionRate}%` }} />
                          </div>
                          <span className="text-xs font-semibold tabular-nums">{p.conversionRate}%</span>
                        </div>
                      </td>
                      <td className="lf-table-cell">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                      </td>
                      <td className="lf-table-cell"><ChevronRight className="h-4 w-4 text-muted-foreground" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'partners' && (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search partners..." className="lf-input pl-9 h-9 w-full text-sm" />
            </div>
            <div className="flex items-center gap-1">
              {['all', 'platinum', 'gold', 'silver', 'bronze'].map(t => (
                <button key={t} onClick={() => setTierFilter(t)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  tierFilter === t ? 'bg-foreground text-white' : 'border border-border text-muted-foreground hover:text-foreground'
                }`}>{t === 'all' ? 'All Tiers' : t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
            </div>
            <button className="lf-btn-outline gap-1.5"><Download className="h-3.5 w-3.5" />Export CSV</button>
          </div>

          <div className="lf-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="lf-table">
                <thead className="lf-table-head">
                  <tr>
                    <SortableHeader label="Partner" sortKey="name" activeSortKey={apSortKey} sortDirection={apSortDirection} onToggleSort={apToggleSort} />
                    <SortableHeader label="Tier" sortKey="tier" activeSortKey={apSortKey} sortDirection={apSortDirection} onToggleSort={apToggleSort} className="hidden md:table-cell" />
                    <SortableHeader label="Referrals" sortKey="referrals" activeSortKey={apSortKey} sortDirection={apSortDirection} onToggleSort={apToggleSort} />
                    <SortableHeader label="Revenue" sortKey="revenue" activeSortKey={apSortKey} sortDirection={apSortDirection} onToggleSort={apToggleSort} className="hidden sm:table-cell" />
                    <SortableHeader label="Commission" sortKey="commission" activeSortKey={apSortKey} sortDirection={apSortDirection} onToggleSort={apToggleSort} className="hidden sm:table-cell" />
                    <SortableHeader label="Conversion" sortKey="conversionRate" activeSortKey={apSortKey} sortDirection={apSortDirection} onToggleSort={apToggleSort} className="hidden lg:table-cell" />
                    <SortableHeader label="Status" sortKey="status" activeSortKey={apSortKey} sortDirection={apSortDirection} onToggleSort={apToggleSort} />
                    <SortableHeader label="Last Active" sortKey="lastActive" activeSortKey={apSortKey} sortDirection={apSortDirection} onToggleSort={apToggleSort} className="hidden sm:table-cell" />
                    <th className="lf-table-th w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAllPartners.map(p => (
                    <tr key={p.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedPartner(p)}>
                      <td className="lf-table-cell">
                        <div>
                          <p className="font-medium text-foreground">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.email}</p>
                        </div>
                      </td>
                      <td className="lf-table-cell hidden md:table-cell">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIER_COLORS[p.tier]}`}>{p.tier}</span>
                      </td>
                      <td className="lf-table-cell tabular-nums font-semibold">{p.referrals.toLocaleString()}</td>
                      <td className="lf-table-cell hidden sm:table-cell tabular-nums">${p.revenue.toLocaleString()}</td>
                      <td className="lf-table-cell hidden sm:table-cell tabular-nums font-semibold text-emerald-600">${p.commission.toLocaleString()}</td>
                      <td className="lf-table-cell hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-10 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${p.conversionRate}%` }} />
                          </div>
                          <span className="text-xs font-semibold tabular-nums">{p.conversionRate}%</span>
                        </div>
                      </td>
                      <td className="lf-table-cell">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                      </td>
                      <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{p.lastActive}</td>
                      <td className="lf-table-cell"><ChevronRight className="h-4 w-4 text-muted-foreground" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'settings' && (
        <div className="space-y-6">
          {/* Commission Settings */}
          <div className="lf-panel p-6">
            <p className="lf-card-title mb-4">Commission Structure</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recurring Commission Rates</p>
                {[
                  { label: 'Starter Plan', value: '50%', desc: '$13.50/mo per subscriber' },
                  { label: 'Pro Plan', value: '50%', desc: '$24.50/mo per subscriber' },
                  { label: 'Premium Plan', value: '50%', desc: '$39.50/mo per subscriber' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                    <input defaultValue={item.value} className="lf-input w-20 h-8 text-sm text-center" />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Base Pay</p>
                {[
                  { label: 'Video Base Pay', value: '$20', desc: 'Per video meeting guidelines' },
                  { label: 'Min Videos/Week', value: '3', desc: 'Required posting cadence' },
                  { label: 'Max Videos/Week', value: '4', desc: 'Upper limit' },
                  { label: 'Video Retention (days)', value: '60', desc: 'Must keep videos live' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                    <input defaultValue={item.value} className="lf-input w-20 h-8 text-sm text-center" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Viral Bonuses */}
          <div className="lf-panel p-6">
            <p className="lf-card-title mb-4">Viral Bonus Tiers</p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {[
                { views: '10K', bonus: '$40' },
                { views: '25K', bonus: '$75' },
                { views: '50K', bonus: '$150' },
                { views: '100K', bonus: '$250' },
                { views: '500K', bonus: '$500' },
                { views: '1M', bonus: '$1,000' },
              ].map(v => (
                <div key={v.views} className="rounded-lg border border-border p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{v.bonus}</p>
                  <p className="text-[10px] text-muted-foreground">{v.views} views</p>
                </div>
              ))}
            </div>
          </div>

          {/* Consistency Streak */}
          <div className="lf-panel p-6">
            <p className="lf-card-title mb-4">Consistency Streak Bonuses</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                { streak: '4 weeks', bonus: '+20%', desc: 'Extra on base pay' },
                { streak: '8 weeks', bonus: '+40%', desc: 'Extra on base pay' },
                { streak: '12 weeks', bonus: '+60%', desc: 'Extra on base pay' },
                { streak: '16 weeks', bonus: '+80%', desc: 'Extra on base pay (max)' },
              ].map(s => (
                <div key={s.streak} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.streak} streak</p>
                    <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">{s.bonus}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tier Thresholds */}
          <div className="lf-panel p-6">
            <p className="lf-card-title mb-4">Tier Thresholds & Perks</p>
            <div className="space-y-3">
              {[
                { tier: 'Platinum', min: '1,500', commission: '60%', perks: 'Exclusive events, advisory role, dedicated support', color: 'bg-violet-500' },
                { tier: 'Gold', min: '800', commission: '55%', perks: 'Priority support, bonus $500 on entry', color: 'bg-amber-500' },
                { tier: 'Silver', min: '300', commission: '50%', perks: 'Standard support, onboarding materials', color: 'bg-slate-400' },
                { tier: 'Bronze', min: '0', commission: '50%', perks: 'Onboarding materials, community access', color: 'bg-orange-500' },
              ].map(t => (
                <div key={t.tier} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${t.color}`} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.tier}</p>
                      <p className="text-[10px] text-muted-foreground">{t.minReferrals}+ referrals · {t.perks}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Commission</p>
                      <input defaultValue={t.commission} className="lf-input w-16 h-7 text-sm text-center" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Min Referrals</p>
                      <input defaultValue={t.min} className="lf-input w-20 h-7 text-sm text-center" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Program Settings */}
          <div className="lf-panel p-6">
            <p className="lf-card-title mb-4">Program Settings</p>
            <div className="space-y-3">
              {[
                { label: 'Program Active', desc: 'Accept new partner applications', checked: true },
                { label: 'Auto-Approve', desc: 'Automatically approve applications meeting criteria', checked: false },
                { label: 'Require 5K+ Followers', desc: 'Minimum follower count for application', checked: true },
                { label: 'Weekly Tracker Required', desc: 'Partners must log posts in weekly tracker', checked: true },
                { label: 'Monthly Payouts', desc: 'Pay commissions on 1st of each month', checked: true },
                { label: '60-Day Video Retention', desc: 'Videos must stay live for 60 days to count', checked: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${item.checked ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                    <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${item.checked ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90">
                <Save className="h-3.5 w-3.5" /> Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
