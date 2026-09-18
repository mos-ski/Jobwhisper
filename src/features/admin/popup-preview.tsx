import type { AdminPopupWidget } from '@/contracts/admin-content.draft'

type PopupPreviewProps = {
  readonly widget: AdminPopupWidget
}

function PopupTypePreview({ widget }: { readonly widget: Extract<AdminPopupWidget, { category: 'popup' }> }) {
  return (
    <div className="w-[22rem] overflow-hidden rounded-panel border border-border bg-surface shadow-panel">
      <div className="relative flex aspect-[863/551] w-full flex-col items-center overflow-hidden px-6 pt-8 text-white">
        <img src="/v3-assets/figma/dfy-widget-background.svg" alt="" className="pointer-events-none absolute inset-0 size-full" />
        <img src="/v3-assets/figma/dfy-widget-wordmark.svg" alt="Jobwhisper" className="absolute top-8 h-[1.15rem] w-[5.85rem]" />
        <div className="absolute inset-x-0 top-[4.5rem] flex flex-col items-center text-center font-gowun font-normal leading-[1.112]">
          <p className="w-full text-[2rem] tracking-[-0.15rem]">{widget.headline || 'Headline'}</p>
          {widget.subHeadline && <p className="mt-1 w-full text-[1.1rem] tracking-[-0.05rem] opacity-80">{widget.subHeadline}</p>}
        </div>
      </div>
      <div className="pb-7 pe-10 ps-6 pt-5">
        <h2 className="whitespace-nowrap font-gowun text-[1.34rem] font-bold leading-[1.112] tracking-[-0.067rem] text-accent-text">{widget.title || 'Title'}</h2>
        <p className="mt-4 font-rethink text-[1.12rem] font-normal leading-[1.4rem] text-ink-muted">{widget.body || 'Body text goes here. Describe what this popup is about.'}</p>
        <div className="mt-4 grid grid-cols-[10.375rem_1fr] items-center gap-3">
          <span className="inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent shadow-control">
            {widget.ctaLabel || 'CTA'}
          </span>
        </div>
      </div>
    </div>
  )
}

function OfferPreview({ widget }: { readonly widget: Extract<AdminPopupWidget, { category: 'offer' }> }) {
  const discountedPrice = widget.price - (widget.price * widget.discount) / 100
  return (
    <div className="w-[22rem] overflow-hidden rounded-panel border border-border bg-surface shadow-panel">
      <div className="relative flex aspect-[863/551] w-full flex-col items-center overflow-hidden px-6 pt-8 text-white">
        <img src="/v3-assets/figma/dfy-widget-background.svg" alt="" className="pointer-events-none absolute inset-0 size-full" />
        <img src="/v3-assets/figma/dfy-widget-wordmark.svg" alt="Jobwhisper" className="absolute top-8 h-[1.15rem] w-[5.85rem]" />
        <div className="absolute inset-x-0 top-[4.5rem] flex flex-col items-center text-center font-gowun font-normal leading-[1.112]">
          <p className="w-full text-[2rem] tracking-[-0.15rem]">{widget.headline || 'Headline'}</p>
          {widget.subHeadline && <p className="mt-1 w-full text-[1.1rem] tracking-[-0.05rem] opacity-80">{widget.subHeadline}</p>}
        </div>
      </div>
      <div className="pb-5 ps-5 pe-5 pt-5">
        {(widget.price > 0 || widget.discount > 0) ? (
          <div className="flex items-end gap-2 font-gowun leading-none whitespace-nowrap">
            {widget.discount > 0 && <span className="text-2xl text-ink-muted line-through">${widget.price}</span>}
            <span className="text-2xl text-accent">${discountedPrice.toFixed(2)}</span>
          </div>
        ) : (
          <div className="flex items-end gap-2 font-gowun leading-none whitespace-nowrap">
            <span className="text-2xl text-accent">$0.00</span>
          </div>
        )}
        {widget.offerList.length > 0 ? (
          <ul className="mt-3 grid gap-2 text-sm leading-5 text-ink-muted">
            {widget.offerList.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span aria-hidden="true" className="flex h-3 w-5 shrink-0 items-center justify-end rounded-sm bg-accent p-0.5">
                  <span className="block h-2 w-2 rounded-sm bg-surface" />
                </span>
                <span>{item || 'Feature item'}</span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-3 grid gap-2 text-sm leading-5 text-ink-muted">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="flex h-3 w-5 shrink-0 items-center justify-end rounded-sm bg-accent p-0.5">
                <span className="block h-2 w-2 rounded-sm bg-surface" />
              </span>
              <span>Feature item</span>
            </li>
          </ul>
        )}
        {widget.timerEnabled && (
          <p className="mt-3 text-xs font-medium text-accent">Limited time offer</p>
        )}
        <div className="mt-4">
          <span className="inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent shadow-control">
            {widget.ctaLabel || 'CTA'}
          </span>
        </div>
      </div>
    </div>
  )
}

function FeatureReleasePreview({ widget }: { readonly widget: Extract<AdminPopupWidget, { category: 'feature-release' }> }) {
  return (
    <div className="w-[22rem] overflow-hidden rounded-panel border border-border bg-surface shadow-panel">
      {widget.mediaUrl ? (
        <div className="relative aspect-video w-full overflow-hidden bg-ink/5">
          {widget.mediaType === 'video' ? (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-ink/10 to-ink/5">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-muted/40">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" opacity="0.3" />
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          ) : (
            <img src={widget.mediaUrl} alt="" className="size-full object-cover" />
          )}
          {widget.mediaType === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-black/60 text-white shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-positive/10 to-positive/5">
          <span className="text-xs text-ink-muted">No media uploaded</span>
        </div>
      )}
      <div className="pb-5 ps-5 pe-5 pt-4">
        <div className="flex items-center gap-2">
          {widget.tag && <span className="inline-flex items-center rounded-full bg-positive-surface px-2 py-0.5 text-xs font-medium text-positive">{widget.tag}</span>}
        </div>
        <p className="mt-2 font-gowun text-base font-semibold text-ink">{widget.title || 'Title'}</p>
        <p className="mt-1.5 text-sm leading-5 text-ink-muted">{widget.body || 'Body text goes here. Describe this feature release.'}</p>
      </div>
    </div>
  )
}

export function PopupPreview({ widget }: PopupPreviewProps) {
  if (widget.category === 'popup') return <PopupTypePreview widget={widget} />
  if (widget.category === 'offer') return <OfferPreview widget={widget} />
  return <FeatureReleasePreview widget={widget} />
}
