import { useState } from 'react'
import { Mail, Bell, Smartphone, Send } from 'lucide-react'
import { useBroadcasts, useCreateBroadcast } from '@/hooks/useAdmin'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

const CHANNEL_ICON: Record<string, React.ElementType> = { email: Mail, in_app: Bell, push: Smartphone }
const CHANNEL_LABEL: Record<string, string> = { email: 'Email', in_app: 'In-App', push: 'Push' }

export default function AdminBroadcast() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState('all')
  const [channels, setChannels] = useState({ email: true, in_app: false, push: false })
  const [schedule, setSchedule] = useState<'now' | 'later'>('now')
  const [sent, setSent] = useState(false)

  const { data, isLoading } = useBroadcasts()
  const createBroadcast = useCreateBroadcast()

  const broadcasts = data?.broadcasts ?? []

  const toggleChannel = (ch: keyof typeof channels) =>
    setChannels(c => ({ ...c, [ch]: !c[ch] }))

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !body) return
    const selectedChannels = Object.entries(channels).filter(([, v]) => v).map(([k]) => k)
    createBroadcast.mutate({
      subject,
      message: body,
      audience,
      channel: selectedChannels,
      recipients: audience === 'all' ? 9396 : audience === 'paid' ? 2880 : 2460,
      status: schedule === 'now' ? 'sent' : 'scheduled',
    })
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    setSubject('')
    setBody('')
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Broadcast" subtitle="Send messages and announcements to your users" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Compose */}
        <div className="lf-panel p-6 lg:col-span-3">
          <p className="lf-card-title mb-5">New Message</p>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="lf-label block mb-1.5">Audience</label>
              <select value={audience} onChange={e => setAudience(e.target.value)} className="lf-select">
                <option value="all">All Users (9,396)</option>
                <option value="paid">Paid Users (2,880)</option>
                <option value="non_subscriber">Non-subscribers (6,516)</option>
                <option value="inactive">Inactive — 30+ days (311)</option>
              </select>
            </div>

            <div>
              <label className="lf-label block mb-1.5">Channels</label>
              <div className="flex gap-2 flex-wrap">
                {(['email', 'in_app', 'push'] as const).map(ch => {
                  const Icon = CHANNEL_ICON[ch]
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => toggleChannel(ch)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                        channels[ch]
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {CHANNEL_LABEL[ch]}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="lf-label block mb-1.5">Subject</label>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Message subject..."
                className="lf-input"
              />
            </div>

            <div>
              <label className="lf-label block mb-1.5">Message</label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Write your message..."
                rows={5}
                className="lf-input resize-none py-2.5 h-auto"
              />
            </div>

            <div>
              <label className="lf-label block mb-1.5">Schedule</label>
              <div className="flex gap-2">
                {(['now', 'later'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSchedule(s)}
                    className={`rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      schedule === s
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {s === 'now' ? 'Send Now' : 'Schedule for Later'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="h-3.5 w-3.5" />
              {sent ? '✓ Message Sent' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Sent history */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="lf-section-title">Sent History</h2>
          {isLoading ? (
            <div className="lf-panel p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : broadcasts.length === 0 ? (
            <div className="lf-panel p-4 text-center text-sm text-muted-foreground">No broadcasts yet</div>
          ) : (
            broadcasts.map(msg => (
              <div key={msg.id} className="lf-panel p-4 space-y-2">
                <p className="text-sm font-medium text-foreground leading-snug">{msg.subject}</p>
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  <span>{msg.audience}</span>
                  <span>·</span>
                  <span>{msg.recipients.toLocaleString()} recipients</span>
                  {msg.openRate && (
                    <>
                      <span>·</span>
                      <span className="font-medium text-emerald-600">{msg.openRate}% opened</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {msg.channel.map(ch => {
                    const Icon = CHANNEL_ICON[ch] || Bell
                    return <Icon key={ch} className="h-3.5 w-3.5 text-muted-foreground" />
                  })}
                  <span className="ml-1 text-xs text-muted-foreground">{new Date(msg.sentAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
