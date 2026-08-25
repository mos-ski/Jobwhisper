import { useState } from 'react'
import { Search, Download, Activity, CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useActivityLogs } from '@/hooks/useAdmin'
import { ACTIVITY_LOGS } from '@/lib/adminMockData'
import { useSort } from '@/hooks/useSort'
import { SortableHeader } from '@/components/shared/SortableHeader'
import type { TimePeriod } from '@/components/shared/TimelineFilter'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

type TabKey = 'all' | 'auth' | 'application' | 'payment' | 'admin' | 'system'

const STATUS_COLORS: Record<string, string> = {
  success: 'bg-emerald-50 text-emerald-700',
  failed: 'bg-red-50 text-red-600',
  warning: 'bg-amber-50 text-amber-700',
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'auth', label: 'Auth' },
  { key: 'application', label: 'Applications' },
  { key: 'payment', label: 'Payments' },
  { key: 'admin', label: 'Admin' },
  { key: 'system', label: 'System' },
]

export default function AdminActivityLogs() {
  const [tab, setTab] = useState<TabKey>('all')
  const [period, setPeriod] = useState<TimePeriod>('12m')
  const [search, setSearch] = useState('')
  const [selectedLog, setSelectedLog] = useState<typeof logs[0] | null>(null)
  const { data, isLoading } = useActivityLogs({ category: tab, search })

  const logs = data?.logs ?? []

  const { sortKey, sortDirection, toggleSort, sorted } = useSort({ data: logs })

  // Compute stats from all logs
  const totalEvents = ACTIVITY_LOGS.length
  const failedToday = ACTIVITY_LOGS.filter(l => l.status === 'failed').length
  const successRate = Math.round(((totalEvents - failedToday) / totalEvents) * 100)
  const adminActions = ACTIVITY_LOGS.filter(l => l.category === 'admin').length

  const exportCSV = () => {
    const headers = ['Time', 'User', 'Email', 'Action', 'Resource', 'IP', 'Status', 'Category']
    const rows = logs.map(l => [l.timestamp, l.userName, l.email, l.action, l.resource, l.ip, l.status, l.category])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'activity-logs.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Activity Logs"
        subtitle="System-wide event log — filterable audit trail"
        actions={[{ label: 'Export', icon: Download, onClick: exportCSV, variant: 'outline' }]}
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Events', value: String(totalEvents), icon: Activity, color: 'text-primary' },
          { label: 'Failed Today', value: String(failedToday), icon: XCircle, color: 'text-red-500' },
          { label: 'Success Rate', value: `${successRate}%`, icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Admin Actions', value: String(adminActions), icon: AlertTriangle, color: 'text-amber-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="lf-panel p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{label}</p>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className="mt-1.5 text-2xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="Search by user, action, or IP..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="lf-input pl-9 h-9"
          />
        </div>
        <span className="text-xs text-muted-foreground">{logs.length} events</span>
      </div>

      <div className="lf-panel overflow-hidden">
        <div className="lf-tabs px-4 pt-1 gap-0">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn('lf-tab px-4 py-2.5', tab === t.key && 'lf-tab-active')}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No logs found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="lf-table">
              <thead className="lf-table-head">
                <tr>
                  <SortableHeader label="Time" sortKey="timestamp" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="w-24" />
                  <SortableHeader label="User" sortKey="userName" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Action" sortKey="action" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                  <SortableHeader label="Resource" sortKey="resource" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden md:table-cell" />
                  <SortableHeader label="IP" sortKey="ip" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden lg:table-cell" />
                  <SortableHeader label="Status" sortKey="status" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="w-24" />
                  <SortableHeader label="Category" sortKey="category" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden sm:table-cell w-24" />
                </tr>
              </thead>
              <tbody>
                {sorted.map(log => (
                  <tr key={log.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedLog(log)}>
                    <td className="lf-table-cell font-mono text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="lf-table-cell text-xs">
                      <div>
                        <p className="font-medium text-foreground">{log.userName}</p>
                        <p className="text-muted-foreground">{log.email}</p>
                      </div>
                    </td>
                    <td className="lf-table-cell font-medium text-foreground">{log.action}</td>
                    <td className="lf-table-cell hidden md:table-cell text-muted-foreground">{log.resource}</td>
                    <td className="lf-table-cell hidden lg:table-cell font-mono text-xs text-muted-foreground">{log.ip}</td>
                    <td className="lf-table-cell">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[log.status]}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="lf-table-cell hidden sm:table-cell">
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-muted text-muted-foreground">
                        {log.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="lf-panel w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="lf-card-title">Log Detail</h2>
              <button onClick={() => setSelectedLog(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'User', value: selectedLog.userName },
                { label: 'Email', value: selectedLog.email },
                { label: 'Action', value: selectedLog.action },
                { label: 'Resource', value: selectedLog.resource },
                { label: 'IP', value: selectedLog.ip },
                { label: 'Status', value: selectedLog.status },
                { label: 'Category', value: selectedLog.category },
                { label: 'Timestamp', value: new Date(selectedLog.timestamp).toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedLog(null)} className="mt-5 w-full rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
