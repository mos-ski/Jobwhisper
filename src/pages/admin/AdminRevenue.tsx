import { useState } from 'react'
import { TrendingUp, TrendingDown, Download, Search, Globe, MapPin, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTransactions } from '@/hooks/useAdmin'
import { useSort } from '@/hooks/useSort'
import { SortableHeader } from '@/components/shared/SortableHeader'
import type { TimePeriod } from '@/components/shared/TimelineFilter'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'
import { NG_REVENUE, NG_TRANSACTIONS, GLOBAL_REVENUE } from '@/lib/adminMockData'
import { AdminDetailModal } from '@/components/shared/AdminDetailModal'

type TxTab = 'revenue' | 'payouts' | 'ng'

function ChangeBadge({ value }: { value: string }) {
  const isDown = value.startsWith('-')
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
      isDown ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
    }`}>
      {isDown ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
      {value}
    </span>
  )
}

function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="lf-panel p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-foreground">{value}</p>
      <div className="mt-2 flex items-center gap-2">
        <ChangeBadge value={change} />
        <span className="text-xs text-muted-foreground">vs last month</span>
      </div>
    </div>
  )
}

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700',
  failed: 'bg-red-50 text-red-600',
  refunded: 'bg-muted text-muted-foreground',
  pending: 'bg-amber-50 text-amber-700',
}

function TransactionTable({ rows }: { rows: { id: string; type: string; amount: number; plan: string; date: string; status: string; userName: string; email: string }[] }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRow, setSelectedRow] = useState<typeof rows[0] | null>(null)

  const filtered = rows.filter(r => {
    const matchesSearch = !search ||
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || r.type === typeFilter
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const { sortKey, sortDirection, toggleSort, sorted } = useSort({ data: filtered })

  const exportCSV = () => {
    const headers = ['ID', 'User', 'Email', 'Type', 'Amount', 'Plan', 'Status', 'Date']
    const csvRows = filtered.map(r => [r.id, r.userName, r.email, r.type, String(r.amount), r.plan, r.status, new Date(r.date).toLocaleDateString()])
    const csv = [headers, ...csvRows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Global Revenue Stats */}
      <div className="p-4 border-b border-border bg-slate-50/50">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 mb-4">
          {[
            { label: 'Total Revenue (USD)', value: `$${GLOBAL_REVENUE.totalUsd.toLocaleString()}` },
            { label: 'This Month (USD)', value: `$${GLOBAL_REVENUE.thisMonthUsd.toLocaleString()}` },
            { label: 'Global Users', value: String(GLOBAL_REVENUE.totalUsers) },
            { label: 'Conversion Rate', value: `${GLOBAL_REVENUE.conversionRate}%` },
          ].map(s => (
            <div key={s.label} className="rounded-lg border border-border bg-white p-3">
              <p className="text-[10px] font-medium text-muted-foreground uppercase">{s.label}</p>
              <p className="text-lg font-bold text-foreground mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Premium', count: GLOBAL_REVENUE.premiumUsers, color: '#8b5cf6' },
            { label: 'Pro', count: GLOBAL_REVENUE.proUsers, color: '#3b82f6' },
            { label: 'Starter', count: GLOBAL_REVENUE.starterUsers, color: '#2dd4bf' },
            { label: 'Non-subscriber', count: GLOBAL_REVENUE.nonSubscriberUsers, color: '#94a3b8' },
          ].map(p => (
            <div key={p.label} className="flex items-center gap-2 rounded-lg border border-border bg-white p-2.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
              <span className="text-xs font-medium text-foreground">{p.label}</span>
              <span className="ml-auto text-sm font-bold tabular-nums">{p.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} className="lf-input pl-9 h-9 text-sm w-full" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="lf-select h-9 text-sm w-auto shrink-0">
            <option value="all">All Types</option>
            <option value="subscription">Subscription</option>
            <option value="one_time">One-time</option>
            <option value="refund">Refund</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="lf-select h-9 text-sm w-auto shrink-0">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <button onClick={exportCSV} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <Download className="h-3.5 w-3.5" />Export
          </button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">No transactions found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <SortableHeader label="User" sortKey="userName" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                <SortableHeader label="Type" sortKey="type" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                <SortableHeader label="Amount" sortKey="amount" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                <SortableHeader label="Plan" sortKey="plan" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden md:table-cell" />
                <SortableHeader label="Date" sortKey="date" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden sm:table-cell" />
                <SortableHeader label="Status" sortKey="status" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
              </tr>
            </thead>
            <tbody>
              {sorted.map(row => (
                <tr key={row.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedRow(row)}>
                  <td className="lf-table-cell">
                    <div>
                      <p className="font-medium text-foreground text-sm">{row.userName}</p>
                      <p className="text-xs text-muted-foreground">{row.email}</p>
                    </div>
                  </td>
                  <td className="lf-table-cell capitalize">{row.type.replace('_', ' ')}</td>
                  <td className="lf-table-cell font-semibold tabular-nums">${Math.abs(row.amount).toFixed(2)}</td>
                  <td className="lf-table-cell hidden md:table-cell capitalize">{row.plan}</td>
                  <td className="lf-table-cell hidden sm:table-cell text-muted-foreground">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="lf-table-cell">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[row.status]}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="lf-panel w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Transaction Details</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{selectedRow.id}</p>
              </div>
              <button onClick={() => setSelectedRow(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">User</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{selectedRow.userName}</p>
                  <p className="text-xs text-muted-foreground">{selectedRow.email}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">Amount</p>
                  <p className="text-lg font-bold text-foreground mt-0.5">${Math.abs(selectedRow.amount).toFixed(2)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">Type</p>
                  <p className="text-sm font-medium text-foreground mt-0.5 capitalize">{selectedRow.type.replace('_', ' ')}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">Plan</p>
                  <p className="text-sm font-medium text-foreground mt-0.5 capitalize">{selectedRow.plan}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">Status</p>
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium mt-0.5 ${STATUS_COLORS[selectedRow.status]}`}>{selectedRow.status}</span>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">Date</p>
                  <p className="text-sm text-foreground mt-0.5">{new Date(selectedRow.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setSelectedRow(null)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function NgRevenueTable() {
  const [search, setSearch] = useState('')
  const [selectedRow, setSelectedRow] = useState<typeof NG_TRANSACTIONS[number] | null>(null)

  const filtered = NG_TRANSACTIONS.filter(r =>
    !search ||
    r.userName.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  )

  const { sortKey: ngSortKey, sortDirection: ngSortDirection, toggleSort: ngToggleSort, sorted: ngSorted } = useSort({ data: filtered })

  const exportNgCSV = () => {
    const headers = ['User', 'Email', 'Plan', 'Amount (₦)', 'Amount ($)', 'Type', 'Status', 'Date']
    const csvRows = filtered.map(r => [r.userName, r.email, r.plan, String(r.amountNgn), String(r.amountUsd), r.type, r.status, r.date])
    const csv = [headers, ...csvRows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ng-transactions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* NG Revenue Stats */}
      <div className="p-4 border-b border-border bg-slate-50/50">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 mb-4">
          {[
            { label: 'NG Revenue (₦)', value: `₦${NG_REVENUE.totalNgn.toLocaleString()}` },
            { label: 'NG Revenue (USD)', value: `$${NG_REVENUE.totalUsd.toLocaleString()}` },
            { label: 'NG Users', value: String(NG_REVENUE.totalUsers) },
            { label: 'NG Conversion', value: `${NG_REVENUE.conversionRate}%` },
          ].map(s => (
            <div key={s.label} className="rounded-lg border border-border bg-white p-3">
              <p className="text-[10px] font-medium text-muted-foreground uppercase">{s.label}</p>
              <p className="text-lg font-bold text-foreground mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Premium', count: NG_REVENUE.premiumUsers, color: '#8b5cf6' },
            { label: 'Pro', count: NG_REVENUE.proUsers, color: '#3b82f6' },
            { label: 'Starter', count: NG_REVENUE.starterUsers, color: '#2dd4bf' },
          ].map(p => (
            <div key={p.label} className="flex items-center gap-2 rounded-lg border border-border bg-white p-2.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
              <span className="text-xs font-medium text-foreground">{p.label}</span>
              <span className="ml-auto text-sm font-bold tabular-nums">{p.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* NG Transactions */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input placeholder="Search NG users..." value={search} onChange={e => setSearch(e.target.value)} className="lf-input pl-9 h-9 text-sm w-full" />
          </div>
          <button onClick={exportNgCSV} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <Download className="h-3.5 w-3.5" />Export NG
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="lf-table">
          <thead className="lf-table-head">
            <tr>
              <SortableHeader label="User" sortKey="userName" activeSortKey={ngSortKey} sortDirection={ngSortDirection} onToggleSort={ngToggleSort} />
              <SortableHeader label="Plan" sortKey="plan" activeSortKey={ngSortKey} sortDirection={ngSortDirection} onToggleSort={ngToggleSort} className="hidden sm:table-cell" />
              <SortableHeader label="Amount (₦)" sortKey="amountNgn" activeSortKey={ngSortKey} sortDirection={ngSortDirection} onToggleSort={ngToggleSort} />
              <SortableHeader label="Amount ($)" sortKey="amountUsd" activeSortKey={ngSortKey} sortDirection={ngSortDirection} onToggleSort={ngToggleSort} className="hidden md:table-cell" />
              <SortableHeader label="Status" sortKey="status" activeSortKey={ngSortKey} sortDirection={ngSortDirection} onToggleSort={ngToggleSort} />
              <SortableHeader label="Date" sortKey="date" activeSortKey={ngSortKey} sortDirection={ngSortDirection} onToggleSort={ngToggleSort} className="hidden sm:table-cell" />
            </tr>
          </thead>
          <tbody>
            {ngSorted.map(row => (
              <tr key={row.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedRow(row)}>
                <td className="lf-table-cell">
                  <div>
                    <p className="font-medium text-foreground text-sm">{row.userName}</p>
                    <p className="text-xs text-muted-foreground">{row.email}</p>
                  </div>
                </td>
                <td className="lf-table-cell hidden sm:table-cell">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">{row.plan}</span>
                </td>
                <td className="lf-table-cell font-semibold tabular-nums">₦{Math.abs(row.amountNgn).toLocaleString()}</td>
                <td className="lf-table-cell hidden md:table-cell tabular-nums text-muted-foreground">${Math.abs(row.amountUsd)}</td>
                <td className="lf-table-cell">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[row.status]}`}>{row.status}</span>
                </td>
                <td className="lf-table-cell hidden sm:table-cell text-muted-foreground">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedRow && (
        <AdminDetailModal
          title={selectedRow.userName}
          subtitle={selectedRow.email}
          onClose={() => setSelectedRow(null)}
          fields={[
            { label: 'Plan', value: selectedRow.plan },
            { label: 'Amount (NGN)', value: `₦${Math.abs(selectedRow.amountNgn).toLocaleString()}` },
            { label: 'Amount (USD)', value: `$${Math.abs(selectedRow.amountUsd)}` },
            { label: 'Type', value: selectedRow.type },
            { label: 'Status', value: selectedRow.status },
            { label: 'Date', value: selectedRow.date },
          ]}
        />
      )}
    </div>
  )
}

export default function AdminRevenue() {
  const [tab, setTab] = useState<TxTab>('revenue')
  const [period, setPeriod] = useState<TimePeriod>('12m')
  const { data, isLoading } = useTransactions()

  const revenue = data?.revenue
  const transactions = data?.transactions ?? []

  const globalRevenue = revenue?.thisMonthRevenue ?? 0
  const ngRevenueUsd = NG_REVENUE.thisMonthUsd

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Revenue"
        subtitle="Financial overview — Global and Nigeria breakdown"
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* Global + NG Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Earned (Global)" value={`$${globalRevenue.toLocaleString()}`} change="+12.4%" />
        <StatCard label="NG Revenue (₦)" value={`₦${NG_REVENUE.totalNgn.toLocaleString()}`} change="+18.7%" />
        <StatCard label="NG Revenue (USD)" value={`$${ngRevenueUsd.toLocaleString()}`} change="+15.3%" />
        <StatCard label="NG Users" value={String(NG_REVENUE.totalUsers)} change="+24.1%" />
      </div>

      {/* Geo Breakdown Bar */}
      <div className="lf-panel p-4">
        <div className="flex items-center gap-3 mb-3">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">Revenue by Region</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="h-4 w-full rounded-full bg-muted overflow-hidden flex">
              <div className="h-full bg-primary transition-all duration-700" style={{ width: `${globalRevenue > 0 ? ((globalRevenue - ngRevenueUsd) / globalRevenue) * 100 : 100}%` }} />
              <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${globalRevenue > 0 ? (ngRevenueUsd / globalRevenue) * 100 : 0}%` }} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Global (${(globalRevenue - ngRevenueUsd).toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">Nigeria (${ngRevenueUsd.toLocaleString()} / ₦{NG_REVENUE.thisMonthNgn.toLocaleString()})</span>
          </div>
        </div>
      </div>

      {/* Transaction Tabs */}
      <div>
        <h2 className="lf-section-title mb-3">Transactions</h2>
        <div className="lf-panel overflow-hidden">
          <div className="lf-tabs px-4 pt-1 gap-0">
            {[
              { key: 'revenue', label: 'Global Revenue', icon: Globe },
              { key: 'ng', label: 'Nigeria Revenue', icon: MapPin },
              { key: 'payouts', label: 'Payout Requests', icon: null },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as TxTab)}
                className={cn('lf-tab px-4 py-2.5 gap-1.5', tab === t.key && 'lf-tab-active')}
              >
                {t.icon && <t.icon className="h-3.5 w-3.5" />}
                {t.label}
              </button>
            ))}
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading transactions...</div>
          ) : tab === 'revenue' ? (
            <TransactionTable rows={transactions} />
          ) : tab === 'ng' ? (
            <NgRevenueTable />
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">No payout requests yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
