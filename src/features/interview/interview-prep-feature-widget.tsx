import { X } from 'lucide-react'

import { cn } from '@/ui'

export type InterviewPrepFeatureWidgetProps = {
  readonly href: string
  readonly previewVideoSrc: string
  readonly onDismiss?: () => void
  readonly className?: string
}

/** A small, dismissible announcement for Interview Prep in the resume workspace. */
export function InterviewPrepFeatureWidget({ href, previewVideoSrc, onDismiss, className }: InterviewPrepFeatureWidgetProps) {
  return (
    <aside
      className={cn(
        'fixed end-4 top-[4.5rem] z-toast flex w-[min(338px,calc(100vw-2rem))] flex-col gap-[10px] bg-paper px-[11px] py-[10px] shadow-announcement',
        className,
      )}
      aria-label="New Interview Prep feature"
      data-node-id="955:14838"
    >
      <div className="flex h-[78px] w-full shrink-0 flex-col gap-1.5 overflow-hidden bg-feature-announcement px-3 py-2 text-on-feature-announcement" data-node-id="955:14839">
        <div className="relative flex h-6 w-full shrink-0 items-start justify-between" data-node-id="955:14840">
          <div className="flex items-center gap-2">
            <span className="bg-feature-announcement-label px-2.5 py-1 text-xs font-normal leading-4 text-on-feature-announcement">New</span>
            <span className="text-xs font-bold">Interview Prep</span>
          </div>
          {onDismiss ? (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss Interview Prep announcement"
              className="absolute -end-4 -top-4 grid size-11 place-items-center text-on-feature-announcement focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <X aria-hidden="true" className="size-3" />
            </button>
          ) : null}
        </div>
        <p className="w-full break-words text-xs font-normal leading-4">Now you can practice with AI for your next interview at any of your favorite company</p>
      </div>
      <a
        href={href}
        className="block h-[195px] w-full shrink-0 overflow-hidden bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        aria-label="Open Interview Prep"
        data-node-id="955:14847"
      >
        <video
          src={previewVideoSrc}
          aria-label="Interview Prep preview"
          className="pointer-events-none size-full object-cover object-top"
          autoPlay
          loop
          muted
          playsInline
        />
      </a>
    </aside>
  )
}
