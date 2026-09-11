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
        'fixed end-4 top-[4.5rem] z-toast w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-sm bg-surface p-2.5 shadow-popover motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-end-4 motion-reduce:animate-none',
        className,
      )}
      aria-label="New Interview Prep feature"
    >
      <div className="flex flex-col gap-1.5 overflow-hidden rounded-sm bg-accent px-3 py-2 text-on-accent">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-surface-inverse px-2.5 py-1 text-xs font-normal text-on-accent">New</span>
            <span className="text-xs font-bold">Interview Prep</span>
          </div>
          {onDismiss ? (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss Interview Prep announcement"
              className="grid size-8 shrink-0 place-items-center rounded-sm text-on-accent/90 transition-colors hover:bg-on-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          ) : null}
        </div>
        <p className="text-xs leading-4">Now you can practice with AI for your next interview at any of your favorite companies.</p>
      </div>
      <a
        href={href}
        className="mt-2 block h-[12.1875rem] overflow-hidden rounded-sm bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        aria-label="Open Interview Prep"
      >
        <video
          src={previewVideoSrc}
          aria-label="Interview Prep preview"
          className="size-full object-cover object-top"
          autoPlay
          loop
          muted
          playsInline
        />
      </a>
    </aside>
  )
}
