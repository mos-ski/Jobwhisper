import { useState, useRef } from 'react'
import { Search, Plus, MessageSquare, Clock, GripVertical, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTickets, useUpdateTicket } from '@/hooks/useAdmin'
import type { SupportTicket } from '@/lib/adminMockData'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

const COLUMNS = [
  { key: 'open', label: 'Open', color: '#21A0FC', headerBg: 'bg-primary/5', borderColor: 'border-primary/20' },
  { key: 'in_progress', label: 'In Progress', color: '#f59e0b', headerBg: 'bg-amber-50', borderColor: 'border-amber-200' },
  { key: 'resolved', label: 'Resolved', color: '#22c55e', headerBg: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  { key: 'closed', label: 'Closed', color: '#94a3b8', headerBg: 'bg-muted/50', borderColor: 'border-border' },
] as const

const PRIORITY_DOT: Record<string, string> = {
  urgent: 'bg-red-500',
  high: 'bg-red-400',
  medium: 'bg-amber-400',
  low: 'bg-slate-300',
}

const CATEGORY_LABELS: Record<string, string> = {
  billing: 'Billing',
  technical: 'Technical',
  account: 'Account',
  feature_request: 'Feature Request',
  bug_report: 'Bug Report',
}

function NewTicketModal({ onClose }: { onClose: () => void }) {
  const [subject, setSubject] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('Bug Report')
  const [priority, setPriority] = useState('medium')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !email) return
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="lf-panel w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="lf-card-title">New Support Ticket</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="lf-label block mb-1.5">Subject <span className="text-red-500">*</span></label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief description" className="lf-input" />
          </div>
          <div>
            <label className="lf-label block mb-1.5">Email <span className="text-red-500">*</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@example.com" className="lf-input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="lf-label block mb-1.5">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="lf-select">
                <option>Bug Report</option>
                <option>Billing</option>
                <option>Account</option>
                <option>Feature Request</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="lf-label block mb-1.5">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className="lf-select">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="lf-label block mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Detailed description..." rows={3} className="lf-input resize-none" />
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

function TicketDetailModal({ ticket, onClose, onStatusChange }: {
  ticket: SupportTicket
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="lf-panel w-full max-w-lg p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-mono text-xs text-muted-foreground">{ticket.id}</span>
            <h2 className="text-lg font-bold text-foreground mt-1">{ticket.subject}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              COLUMNS.find(c => c.key === ticket.status) ? `text-white` : 'bg-muted text-muted-foreground'
            }`} style={{ backgroundColor: COLUMNS.find(c => c.key === ticket.status)?.color }}>
              {COLUMNS.find(c => c.key === ticket.status)?.label ?? ticket.status}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-foreground">
              {ticket.status === 'closed' ? (
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              ) : (
                <span className={cn('h-2 w-2 rounded-full', PRIORITY_DOT[ticket.priority])} />
              )}
              {ticket.priority}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p><strong>From:</strong> {ticket.userName} ({ticket.email})</p>
            <p><strong>Category:</strong> {CATEGORY_LABELS[ticket.category] ?? ticket.category}</p>
            <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-foreground">{ticket.description}</p>
          </div>
          <div className="flex gap-2">
            {COLUMNS.map(col => (
              <button
                key={col.key}
                onClick={() => { onStatusChange(ticket.id, col.key); onClose() }}
                className={cn(
                  'flex-1 rounded-lg border py-2 text-xs font-medium transition-colors',
                  ticket.status === col.key
                    ? 'text-white border-transparent'
                    : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
                style={ticket.status === col.key ? { backgroundColor: col.color } : undefined}
              >
                {col.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TicketCard({ ticket, onClick, onDragStart }: {
  ticket: SupportTicket
  onClick: () => void
  onDragStart: (e: React.DragEvent, ticket: SupportTicket) => void
}) {
  const isClosed = ticket.status === 'closed'
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, ticket)}
      onClick={onClick}
      className={cn(
        "group relative rounded-lg border border-border/60 bg-white p-3.5 cursor-grab active:cursor-grabbing transition-all hover:border-border hover:shadow-md hover:shadow-black/5",
        isClosed && "opacity-60 hover:opacity-100"
      )}
    >
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
      </div>

      <div className="flex items-start gap-2.5 mb-2.5">
        {isClosed ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
        ) : (
          <span className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', PRIORITY_DOT[ticket.priority])} />
        )}
        <p className={cn("text-sm font-semibold text-foreground leading-snug line-clamp-2 pr-4", isClosed && "line-through decoration-muted-foreground/40")}>{ticket.subject}</p>
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2 pl-[18px]">{ticket.description}</p>

      <div className="flex items-center justify-between pl-[18px]">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground">
            {ticket.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <span className="text-xs text-muted-foreground">{ticket.userName.split(' ')[0]}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground/60">
          <span className="text-[10px] rounded bg-muted/60 px-1.5 py-0.5 font-medium">
            {CATEGORY_LABELS[ticket.category] ?? ticket.category}
          </span>
          <Clock className="h-3 w-3" />
          <span className="text-[10px] font-medium">{timeAgo(ticket.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

function KanbanColumn({ column, tickets, onDrop, onTicketClick, onDragStart, searchQuery, priorityFilter }: {
  column: typeof COLUMNS[number]
  tickets: SupportTicket[]
  onDrop: (e: React.DragEvent, status: string) => void
  onTicketClick: (ticket: SupportTicket) => void
  onDragStart: (e: React.DragEvent, ticket: SupportTicket) => void
  searchQuery: string
  priorityFilter: string
}) {
  const [dragOver, setDragOver] = useState(false)
  const filtered = tickets.filter(t => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!t.subject.toLowerCase().includes(q) && !t.userName.toLowerCase().includes(q) && !t.email.toLowerCase().includes(q)) return false
    }
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
    return true
  })

  return (
    <div
      className={cn(
        'flex flex-col min-w-[260px] max-w-[340px] flex-1 rounded-xl border transition-colors',
        dragOver ? 'border-primary/50 bg-primary/5' : 'border-border/60 bg-muted/20'
      )}
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); onDrop(e, column.key) }}
    >
      <div className={cn('flex items-center justify-between px-4 py-3 rounded-t-xl border-b', column.headerBg, column.borderColor)}>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: column.color }} />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{column.label}</span>
        </div>
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/80 px-1.5 text-[10px] font-bold text-foreground shadow-sm border border-border/40">
          {filtered.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 min-h-[120px] max-h-[calc(100vh-280px)]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/40">
            <MessageSquare className="h-6 w-6 mb-2" />
            <p className="text-xs font-medium">No tickets</p>
          </div>
        ) : (
          filtered.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => onTicketClick(ticket)}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default function AdminSupport() {
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [showNewTicket, setShowNewTicket] = useState(false)

  const { data, isLoading } = useTickets({ search, status: 'all', priority: priorityFilter })
  const updateTicket = useUpdateTicket()

  const tickets = data?.tickets ?? []
  const stats = data?.stats

  const ticketsByStatus = {
    open: tickets.filter(t => t.status === 'open'),
    in_progress: tickets.filter(t => t.status === 'in_progress'),
    resolved: tickets.filter(t => t.status === 'resolved'),
    closed: tickets.filter(t => t.status === 'closed'),
  }

  const handleDragStart = (e: React.DragEvent, ticket: SupportTicket) => {
    e.dataTransfer.setData('ticketId', ticket.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    const ticketId = e.dataTransfer.getData('ticketId')
    if (!ticketId) return
    updateTicket.mutate({ id: ticketId, updates: { status: newStatus as SupportTicket['status'] } })
  }

  return (
    <div className="space-y-5">
      {showNewTicket && <NewTicketModal onClose={() => setShowNewTicket(false)} />}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onStatusChange={(id, status) => updateTicket.mutate({ id, updates: { status: status as SupportTicket['status'] } })}
        />
      )}

      <AdminPageHeader
        title="Support"
        subtitle="Drag tickets between columns to update status"
        actions={[{ label: 'New Ticket', icon: Plus, onClick: () => setShowNewTicket(true) }]}
      />

      {/* Toolbar: stats + search + priority — all in one row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Compact stat pills */}
        <div className="flex items-center gap-1.5">
          {COLUMNS.map(col => {
            const count = tickets.filter(t => t.status === col.key).length
            return (
              <div key={col.key} className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-white px-3 py-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: col.color }} />
                <span className="text-xs font-semibold text-foreground">{count}</span>
                <span className="text-[10px] text-muted-foreground hidden sm:inline">{col.label}</span>
              </div>
            )
          })}
        </div>

        <div className="h-5 w-px bg-border/60 hidden sm:block" />

        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-[280px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="Search tickets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="lf-input pl-8 h-8 text-xs"
          />
        </div>

        {/* Priority filter */}
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="lf-select h-8 text-xs max-w-[140px]">
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Kanban board */}
      {isLoading ? (
        <div className="lf-panel p-8 text-center text-sm text-muted-foreground">Loading tickets...</div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {COLUMNS.map(col => (
            <KanbanColumn
              key={col.key}
              column={col}
              tickets={tickets}
              onDrop={handleDrop}
              onTicketClick={setSelectedTicket}
              onDragStart={handleDragStart}
              searchQuery={search}
              priorityFilter={priorityFilter}
            />
          ))}
        </div>
      )}
    </div>
  )
}
