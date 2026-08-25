import { useState } from 'react'
import { CheckCircle2, AlertTriangle, Info, XCircle, Clock, Shield } from 'lucide-react'
import { useSystemStatus } from '@/hooks/useAdmin'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

type AlertType = 'error' | 'warning' | 'info' | 'success'

const TYPE_CONFIG: Record<AlertType, { icon: React.ElementType; iconCls: string; labelCls: string; label: string }> = {
  error: { icon: XCircle, iconCls: 'text-red-500', labelCls: 'bg-red-50 text-red-600', label: 'Error' },
  warning: { icon: AlertTriangle, iconCls: 'text-amber-500', labelCls: 'bg-amber-50 text-amber-700', label: 'Warning' },
  info: { icon: Info, iconCls: 'text-primary', labelCls: 'bg-primary/10 text-primary', label: 'Info' },
  success: { icon: CheckCircle2, iconCls: 'text-emerald-500', labelCls: 'bg-emerald-50 text-emerald-700', label: 'Success' },
}

const SVC_STYLE: Record<string, { dot: string; text: string; label: string }> = {
  operational: { dot: 'bg-emerald-500', text: 'text-emerald-600', label: 'Operational' },
  degraded: { dot: 'bg-amber-400', text: 'text-amber-600', label: 'Degraded' },
  down: { dot: 'bg-red-500', text: 'text-red-600', label: 'Down' },
}

const RECENT_INCIDENTS = [
  { id: '1', title: 'AI Pipeline Latency Spike', status: 'investigating', started: '12 min ago', services: ['AI Pipeline'] },
  { id: '2', title: 'Elevated Error Rates on Auto-Apply', status: 'resolved', started: '3 hrs ago', duration: '18 min', services: ['Job Board Integrations'] },
  { id: '3', title: 'Database Connection Pool Exhaustion', status: 'resolved', started: '2 days ago', duration: '7 min', services: ['Database'] },
  { id: '4', title: 'Payment Webhook Delays', status: 'resolved', started: '5 days ago', duration: '22 min', services: ['Payment Gateway'] },
]

const INCIDENT_STATUS: Record<string, { color: string; label: string }> = {
  investigating: { color: 'bg-amber-50 text-amber-700', label: 'Investigating' },
  monitoring: { color: 'bg-blue-50 text-blue-700', label: 'Monitoring' },
  resolved: { color: 'bg-emerald-50 text-emerald-700', label: 'Resolved' },
}

export default function AdminNotifications() {
  const { data, isLoading } = useSystemStatus()
  const [alerts, setAlerts] = useState<Array<{ id: string; type: AlertType; title: string; message: string; time: string }>>([])

  const services = data?.services ?? []
  const activeAlerts = data?.alerts ?? []

  if (activeAlerts.length > 0 && alerts.length === 0) {
    setAlerts(activeAlerts as any)
  }

  const dismiss = (id: string) => setAlerts(a => a.filter(x => x.id !== id))
  const operational = services.filter(s => s.status === 'operational').length
  const avgUptime = services.length > 0 ? (services.reduce((s, svc) => s + svc.uptime, 0) / services.length).toFixed(2) : '99.9'

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Notifications" subtitle="System health and active alerts" />

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Services Up', value: `${operational}/${services.length}`, icon: Shield, color: 'text-emerald-500' },
          { label: 'Avg Uptime', value: `${avgUptime}%`, icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Active Alerts', value: String(alerts.length), icon: AlertTriangle, color: alerts.length > 0 ? 'text-amber-500' : 'text-emerald-500' },
          { label: 'Incidents (7d)', value: String(RECENT_INCIDENTS.length), icon: Clock, color: 'text-muted-foreground' },
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

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* System status */}
        <div className="lf-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="lf-card-title">System Status</p>
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-white">
              {operational}/{services.length} Operational
            </span>
          </div>
          <div className="space-y-2">
            {services.map(svc => {
              const s = SVC_STYLE[svc.status]
              return (
                <div key={svc.name} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${s.dot}`} />
                    <span className="text-sm font-medium text-foreground">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground tabular-nums">{svc.uptime}%</span>
                    <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent incidents */}
        <div className="lf-panel p-5">
          <p className="lf-card-title mb-4">Recent Incidents</p>
          <div className="space-y-3">
            {RECENT_INCIDENTS.map(incident => {
              const st = INCIDENT_STATUS[incident.status]
              return (
                <div key={incident.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{incident.title}</p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.color}`}>{st.label}</span>
                        {incident.services.map(svc => (
                          <span key={svc} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{svc}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">{incident.started}</p>
                      {incident.duration && <p className="text-xs text-muted-foreground">Duration: {incident.duration}</p>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="lf-section-title">Active Alerts</h2>
          {alerts.length > 0 && (
            <button
              onClick={() => setAlerts([])}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dismiss all
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="lf-panel py-10 flex items-center gap-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">All systems operational</p>
              <p className="lf-body text-xs mt-0.5">No active alerts. All services are running normally.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {alerts.map(alert => {
              const { icon: Icon, iconCls, labelCls, label } = TYPE_CONFIG[alert.type]
              return (
                <div key={alert.id} className="lf-panel p-4 flex items-start gap-3">
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${iconCls}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${labelCls}`}>{label}</span>
                      <span className="text-sm font-medium text-foreground">{alert.title}</span>
                    </div>
                    <p className="lf-body text-xs">{alert.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground/60">{alert.time}</p>
                  </div>
                  <button
                    onClick={() => dismiss(alert.id)}
                    className="shrink-0 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
