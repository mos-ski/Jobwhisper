import { Mail, Smartphone } from 'lucide-react'

type BroadcastPreviewProps = {
  readonly title: string
  readonly body: string
  readonly showEmail?: boolean
  readonly showInApp?: boolean
}

function EmailPreview({ title, body }: { readonly title: string; readonly body: string }) {
  return (
    <div className="overflow-hidden rounded-panel border border-border bg-surface shadow-panel">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <Mail aria-hidden="true" className="size-4 text-ink-muted" />
        <span className="text-xs font-semibold text-ink-muted">Email Preview</span>
      </div>
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <img src="/v3-assets/figma/dfy-widget-wordmark.svg" alt="Jobwhisper" className="h-4" />
        </div>
        <p className="text-xs text-ink-muted">From: Jobwhisper &lt;notifications@jobwhisper.com&gt;</p>
        <h3 className="mt-2 font-gowun text-base font-bold text-ink">{title || 'Subject line'}</h3>
        <div className="mt-3 rounded-lg border border-border bg-canvas p-4">
          <div className="text-sm leading-6 text-ink-muted [&_a]:text-accent [&_a]:underline [&_h1]:font-gowun [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-ink [&_h2]:font-gowun [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-ink [&_li]:mb-0.5 [&_li]:ps-4 [&_ol]:list-decimal [&_p]:mb-2 [&_ul]:list-disc" dangerouslySetInnerHTML={{ __html: body || '<p>Message body will appear here.</p>' }} />
        </div>
        <div className="mt-4 flex justify-center">
          <span className="inline-flex min-h-10 items-center justify-center rounded-lg bg-accent px-6 text-sm font-semibold text-on-accent">Open Jobwhisper</span>
        </div>
      </div>
    </div>
  )
}

function InAppPreview({ title, body }: { readonly title: string; readonly body: string }) {
  return (
    <div className="overflow-hidden rounded-panel border border-border bg-surface shadow-panel">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <Smartphone aria-hidden="true" className="size-4 text-ink-muted" />
        <span className="text-xs font-semibold text-ink-muted">In-App Notification</span>
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3 rounded-lg border border-accent/20 bg-accent-subtle p-4">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-on-accent">
            <img src="/v3-assets/figma/dfy-widget-wordmark.svg" alt="" className="h-3 brightness-0 invert" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">{title || 'Notification Title'}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-ink-muted">{body ? body.replace(/<[^>]*>/g, ' ').slice(0, 120) : 'Notification body will appear here.'}</p>
          </div>
        </div>
        <div className="mt-4 [&_a]:text-accent [&_a]:underline [&_h2]:font-gowun [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-ink [&_li]:mb-0.5 [&_li]:ps-4 [&_ol]:list-decimal [&_p]:mb-2 [&_p]:text-xs [&_p]:leading-5 [&_p]:text-ink-muted [&_ul]:list-disc" dangerouslySetInnerHTML={{ __html: body || '<p>Full in-app message will appear here.</p>' }} />
      </div>
    </div>
  )
}

export function BroadcastPreview({ title, body, showEmail = true, showInApp = true }: BroadcastPreviewProps) {
  return (
    <div className="flex flex-col gap-4">
      {showEmail && <EmailPreview title={title} body={body} />}
      {showInApp && <InAppPreview title={title} body={body} />}
    </div>
  )
}
