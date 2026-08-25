import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, ExternalLink, CreditCard, X, Clock, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser, useUpdateUser } from '@/hooks/useAdmin'
import { ACTIVITY_LOGS, TICKETS, TRANSACTIONS } from '@/lib/adminMockData'
import { useSort } from '@/hooks/useSort'
import { SortableHeader } from '@/components/shared/SortableHeader'

type DetailTab = 'details' | 'subscriptions'
type BillingTab = 'history' | 'methods'

function AssignPlanModal({ onClose }: { onClose: () => void }) {
  const [plan, setPlan] = useState('starter')
  const [billing, setBilling] = useState('monthly')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="lf-panel w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="lf-card-title">Assign Subscription Plan</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="lf-label block mb-1.5">Subscription Plan <span className="text-red-500">*</span></label>
            <select value={plan} onChange={e => setPlan(e.target.value)} className="lf-select">
              <option value="starter">Starter Plan — $27/month</option>
              <option value="pro">Pro Plan — $49/month</option>
              <option value="premium">Premium Plan — $79/month</option>
            </select>
          </div>
          <div>
            <label className="lf-label block mb-1.5">Billing Cycle <span className="text-red-500">*</span></label>
            <select value={billing} onChange={e => setBilling(e.target.value)} className="lf-select">
              <option value="monthly">Monthly ($)</option>
              <option value="annual">Annual ($)</option>
            </select>
          </div>
          <div>
            <label className="lf-label block mb-1.5">Reason <span className="text-muted-foreground font-normal">(Optional)</span></label>
            <input placeholder="e.g. Promotional offer" className="lf-input" />
            <p className="text-xs text-muted-foreground mt-1">Add context for audit trail and tracking purposes</p>
          </div>
          <div>
            <label className="lf-label block mb-1.5">Custom End Date <span className="text-muted-foreground font-normal">(Optional)</span></label>
            <input type="date" className="lf-input" />
            <p className="text-xs text-muted-foreground mt-1">If not set, defaults to monthly from today</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          <button onClick={onClose} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">Continue</button>
        </div>
      </div>
    </div>
  )
}

const STATUS_COLORS: Record<string, string> = {
  success: 'bg-emerald-50 text-emerald-700',
  failed: 'bg-red-50 text-red-600',
  warning: 'bg-amber-50 text-amber-700',
}

const TICKET_STATUS_COLORS: Record<string, string> = {
  open: 'bg-primary text-white',
  in_progress: 'bg-amber-50 text-amber-700',
  resolved: 'bg-emerald-50 text-emerald-700',
  closed: 'bg-muted text-muted-foreground',
}

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: user, isLoading } = useUser(id)
  const updateUser = useUpdateUser()

  const [detailTab, setDetailTab] = useState<DetailTab>('details')
  const [billingTab, setBillingTab] = useState<BillingTab>('history')
  const [showAssign, setShowAssign] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="lf-panel p-6 animate-pulse">
          <div className="h-16 w-16 rounded-full bg-muted mx-auto" />
          <div className="h-5 bg-muted rounded w-32 mx-auto mt-3" />
          <div className="h-3 bg-muted rounded w-48 mx-auto mt-2" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="lf-panel p-16 text-center">
          <p className="text-sm text-muted-foreground">User not found</p>
          <Link to="/admin/users" className="text-sm text-primary hover:underline mt-2 inline-block">Back to users</Link>
        </div>
      </div>
    )
  }

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase()
  const isPaid = user.plan !== 'non_subscriber'

  const planPrices: Record<string, string> = {
    premium: '$79',
    pro: '$49',
    starter: '$27',
    non_subscriber: '$0',
  }

  // Filter related data for this user
  const userLogs = ACTIVITY_LOGS.filter(l => l.email === user.email).slice(0, 5)
  const userTickets = TICKETS.filter(t => t.userId === user.id).slice(0, 5)
  const userTransactions = TRANSACTIONS.filter(t => t.userId === user.id).slice(0, 5)
  const creditPct = user.credits > 0 ? Math.round((user.creditsUsed / user.credits) * 100) : 0

  const { sortKey: txSortKey, sortDirection: txSortDirection, toggleSort: txToggleSort, sorted: sortedTransactions } = useSort({ data: userTransactions })
  const { sortKey: bSortKey, sortDirection: bSortDirection, toggleSort: bToggleSort, sorted: sortedBilling } = useSort({ data: user.billingHistory })

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/admin/users" className="hover:text-foreground transition-colors">Users</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate">{user.name}</span>
      </div>

      {/* Profile header */}
      <div className="lf-panel p-6 text-center relative">
        <button className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
          Login to user's account <ExternalLink className="h-3 w-3" />
        </button>
        <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <span className="text-lg font-bold text-primary">{initials}</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
        <p className="lf-body text-sm mt-0.5">{user.email}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
          {[
            ['Date Created', new Date(user.signupDate).toLocaleDateString()],
            ['Last Seen', new Date(user.lastActive).toLocaleDateString()],
            ['Location', user.location],
            ['Plan', user.plan.charAt(0).toUpperCase() + user.plan.slice(1)],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-1.5">
              <span className="text-muted-foreground">{k}:</span>
              <span className="font-medium text-foreground">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="lf-tabs">
          {[{ key: 'details', label: 'User Details' }, { key: 'subscriptions', label: 'Subscriptions' }].map(t => (
            <button
              key={t.key}
              onClick={() => setDetailTab(t.key as DetailTab)}
              className={cn('lf-tab', detailTab === t.key && 'lf-tab-active')}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* User Details */}
        {detailTab === 'details' && (
          <div className="mt-5 space-y-5">
            {/* Profile completion */}
            <div className="lf-panel p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 shrink-0">
                    <svg className="rotate-[-90deg]" viewBox="0 0 36 36" width="48" height="48">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
                        strokeDasharray={`${75 * 0.942} 100`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
                      75%
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Profile Completion</p>
                    <p className="lf-body text-xs">{user.bio || 'No bio provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div>
              <div className="rounded-t-lg border border-border border-b-0 bg-muted/40 px-4 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Profile Details</p>
              </div>
              <div className="lf-panel rounded-t-none overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="lf-table">
                    <thead className="lf-table-head">
                      <tr>
                        <th className="lf-table-th">Phone</th>
                        <th className="lf-table-th">Status</th>
                        <th className="lf-table-th">Location</th>
                        <th className="lf-table-th hidden md:table-cell">Resumes</th>
                        <th className="lf-table-th hidden md:table-cell">Applications</th>
                        <th className="lf-table-th hidden lg:table-cell">Interviews</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="lf-table-row">
                        <td className="lf-table-cell">{user.phone || '—'}</td>
                        <td className="lf-table-cell">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                          }`}>{user.status}</span>
                        </td>
                        <td className="lf-table-cell">{user.location}</td>
                        <td className="lf-table-cell hidden md:table-cell">{user.resumesCreated}</td>
                        <td className="lf-table-cell hidden md:table-cell">{user.applicationsSent}</td>
                        <td className="lf-table-cell hidden lg:table-cell">{user.interviewsPrepped}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Activity Summary */}
            <div>
              <div className="rounded-t-lg border border-border border-b-0 bg-muted/40 px-4 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Activity Summary</p>
              </div>
              <div className="lf-panel rounded-t-none overflow-hidden">
                <div className="grid grid-cols-3 divide-x divide-border">
                  <div className="p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{user.resumesCreated}</p>
                    <p className="text-xs text-muted-foreground mt-1">Resumes Created</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{user.applicationsSent}</p>
                    <p className="text-xs text-muted-foreground mt-1">Applications Sent</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{user.interviewsPrepped}</p>
                    <p className="text-xs text-muted-foreground mt-1">Interviews Prepped</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Credits Usage */}
            <div>
              <div className="rounded-t-lg border border-border border-b-0 bg-muted/40 px-4 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Credits Usage</p>
              </div>
              <div className="lf-panel rounded-t-none overflow-hidden p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.creditsUsed} of {user.credits} credits used</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{user.credits - user.creditsUsed} credits remaining</p>
                  </div>
                  <span className="text-2xl font-bold text-foreground">{creditPct}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${creditPct > 80 ? 'bg-red-500' : creditPct > 50 ? 'bg-amber-500' : 'bg-primary'}`}
                    style={{ width: `${creditPct}%` }}
                  />
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <CreditCard className="h-3.5 w-3.5" />Give Credits
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Reset Usage
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="rounded-t-lg border border-border border-b-0 bg-muted/40 px-4 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Recent Activity</p>
              </div>
              <div className="lf-panel rounded-t-none overflow-hidden">
                {userLogs.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No activity recorded yet</p>
                ) : (
                  <div className="divide-y divide-border">
                    {userLogs.map(log => (
                      <div key={log.id} className="flex items-center gap-3 px-5 py-3">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{log.action}</p>
                          <p className="text-xs text-muted-foreground">{log.resource} · {log.ip}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS_COLORS[log.status]}`}>
                            {log.status}
                          </span>
                          <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Transactions */}
            <div>
              <div className="rounded-t-lg border border-border border-b-0 bg-muted/40 px-4 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Recent Transactions</p>
              </div>
              <div className="lf-panel rounded-t-none overflow-hidden">
                {userTransactions.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No transactions yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="lf-table">
                      <thead className="lf-table-head">
                        <tr>
                          <SortableHeader label="Date" sortKey="date" activeSortKey={txSortKey} sortDirection={txSortDirection} onToggleSort={txToggleSort} />
                          <SortableHeader label="Type" sortKey="type" activeSortKey={txSortKey} sortDirection={txSortDirection} onToggleSort={txToggleSort} />
                          <SortableHeader label="Amount" sortKey="amount" activeSortKey={txSortKey} sortDirection={txSortDirection} onToggleSort={txToggleSort} />
                          <SortableHeader label="Status" sortKey="status" activeSortKey={txSortKey} sortDirection={txSortDirection} onToggleSort={txToggleSort} />
                        </tr>
                      </thead>
                      <tbody>
                        {sortedTransactions.map(tx => (
                          <tr key={tx.id} className="lf-table-row">
                            <td className="lf-table-cell text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</td>
                            <td className="lf-table-cell capitalize">{tx.type.replace('_', ' ')}</td>
                            <td className="lf-table-cell font-semibold tabular-nums">${Math.abs(tx.amount).toFixed(2)}</td>
                            <td className="lf-table-cell">
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                tx.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                                tx.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                'bg-red-50 text-red-600'
                              }`}>{tx.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Support Tickets */}
            <div>
              <div className="rounded-t-lg border border-border border-b-0 bg-muted/40 px-4 py-2 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Support Tickets</p>
                {userTickets.length > 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{userTickets.length}</span>
                )}
              </div>
              <div className="lf-panel rounded-t-none overflow-hidden">
                {userTickets.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No support tickets</p>
                ) : (
                  <div className="divide-y divide-border">
                    {userTickets.map(ticket => (
                      <div key={ticket.id} className="flex items-center gap-3 px-5 py-3">
                        <AlertTriangle className={`h-3.5 w-3.5 shrink-0 ${
                          ticket.priority === 'high' || ticket.priority === 'urgent' ? 'text-red-500' : 'text-muted-foreground'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{ticket.subject}</p>
                          <p className="text-xs text-muted-foreground">{ticket.category} · {new Date(ticket.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${TICKET_STATUS_COLORS[ticket.status]}`}>
                          {ticket.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Subscriptions */}
        {detailTab === 'subscriptions' && (
          <div className="mt-5 space-y-5">
            <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
              <p className="text-sm text-primary">
                This user is currently on the <strong>{user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} plan</strong>.
                {isPaid && <> Next billing date is <strong>{user.billingHistory[0]?.date ? new Date(user.billingHistory[0].date).toLocaleDateString() : 'N/A'}</strong>.</>}
              </p>
            </div>

            <div className="lf-panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{user.plan}_Plan</span>
                  <p className="mt-3 text-3xl font-bold text-foreground">
                    {planPrices[user.plan]}<span className="text-sm font-normal text-muted-foreground ml-1">/per month</span>
                  </p>
                </div>
                {isPaid ? (
                  <div className="flex flex-wrap gap-2 justify-end">
                    {[['↑ Upgrade', false], ['↓ Downgrade', false], ['⏸ Pause', false], ['✕ Cancel', true]].map(([label, danger]) => (
                      <button key={String(label)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        danger ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' : 'border-border text-muted-foreground hover:text-foreground'
                      }`}>{label}</button>
                    ))}
                  </div>
                ) : (
                  <button onClick={() => setShowAssign(true)} className="rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
                    + Assign Plan
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="lf-panel p-5">
                <p className="text-sm text-muted-foreground">Credits</p>
                <p className="mt-1 text-4xl font-bold text-foreground">{user.credits}</p>
                <p className="text-xs text-muted-foreground mt-1">{user.creditsUsed} used of {user.credits}</p>
                <button className="mt-4 flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <CreditCard className="h-3.5 w-3.5" />Give Credits
                </button>
              </div>
              <div className="lf-panel p-5">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="mt-1 text-4xl font-bold text-foreground">${user.totalSpent}</p>
                <p className="text-xs text-muted-foreground mt-1">across all billing periods</p>
              </div>
            </div>

            <div className="lf-panel overflow-hidden">
              <div className="lf-tabs px-4 pt-1 gap-0">
                {[{ key: 'history', label: 'Billing History' }, { key: 'methods', label: 'Payment Methods' }].map(t => (
                  <button key={t.key} onClick={() => setBillingTab(t.key as BillingTab)}
                    className={cn('lf-tab px-4 py-2.5', billingTab === t.key && 'lf-tab-active')}>
                    {t.label}
                  </button>
                ))}
              </div>
              {billingTab === 'history' ? (
                <div>
                  {user.billingHistory.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">No payment history available.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="lf-table">
                        <thead className="lf-table-head">
                          <tr>
                            <SortableHeader label="Date" sortKey="date" activeSortKey={bSortKey} sortDirection={bSortDirection} onToggleSort={bToggleSort} />
                            <SortableHeader label="Description" sortKey="description" activeSortKey={bSortKey} sortDirection={bSortDirection} onToggleSort={bToggleSort} />
                            <SortableHeader label="Amount" sortKey="amount" activeSortKey={bSortKey} sortDirection={bSortDirection} onToggleSort={bToggleSort} />
                            <SortableHeader label="Status" sortKey="status" activeSortKey={bSortKey} sortDirection={bSortDirection} onToggleSort={bToggleSort} />
                          </tr>
                        </thead>
                        <tbody>
                          {sortedBilling.map(bill => (
                            <tr key={bill.id} className="lf-table-row">
                              <td className="lf-table-cell text-muted-foreground">{new Date(bill.date).toLocaleDateString()}</td>
                              <td className="lf-table-cell font-medium text-foreground">{bill.description}</td>
                              <td className="lf-table-cell font-semibold tabular-nums">${bill.amount}</td>
                              <td className="lf-table-cell">
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  bill.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                }`}>{bill.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <p className="py-12 text-center text-sm text-muted-foreground">No payment methods on file.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {showAssign && <AssignPlanModal onClose={() => setShowAssign(false)} />}
    </div>
  )
}
