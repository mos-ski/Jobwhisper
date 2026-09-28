import { useState } from 'react'
import { BadgeCheck, Check, Play, Plus, RotateCw, Star } from 'lucide-react'

import type { SuccessManager, SuccessManagerDirectory } from '@/contracts/done-for-you.draft'
import type { AutoApplyProfileSnapshot } from '@/features/auto-apply/auto-apply-view'
import { Avatar, Button, cn, Dialog, DialogClose, DialogPopup, DialogTitle, EmptyState, Popover, PopoverContent, PopoverTrigger, Skeleton } from '@/ui'

import { DfySignupDialog, type DfySignupLead, type DfySignupPackage } from './dfy-signup-dialog'

export type SuccessManagerPickerProps = {
  readonly setupHref: string
  readonly profile: AutoApplyProfileSnapshot
  readonly savedCard: { readonly label: string; readonly expiryLabel: string }
  readonly directory: SuccessManagerDirectory
  readonly onRetry?: () => void
  readonly onSignupComplete?: (lead: DfySignupLead & { readonly managerId: string }) => void
  /** Set on a public page: Start with hands off (e.g. to sign-up) instead of opening the signed-in signup dialog. */
  readonly onStart?: (manager: SuccessManager) => void
}

const FEATURES = [
  'Resume tailored for each role',
  'Job scouting and match review',
  'Applications submitted for you',
  'A Friday progress update',
  'Full Jobwhisper access until your interviews land',
] as const

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function packageFor(manager: SuccessManager): DfySignupPackage {
  return {
    id: manager.interviewsGuaranteed >= 20 ? 'dfy-large' : 'dfy-small',
    guaranteeLabel: `${manager.interviewsGuaranteed} Interviews Guaranteed`,
    priceLabel: money.format(manager.price),
  }
}


const openingDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

function Tags({ manager }: { readonly manager: SuccessManager }) {
  return (
    <ul aria-label={`${manager.name}'s clients have interviewed at, and specialties`} className="flex flex-wrap gap-1.5">
      {manager.companies.map((company) => (
        <li key={company} className="rounded-md bg-positive-surface px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-positive">
          #{company}
        </li>
      ))}
      {manager.specialties.map((specialty) => (
        <li key={specialty} className="rounded-md bg-surface-subtle px-2 py-0.5 text-xs font-medium text-ink">
          {specialty}
        </li>
      ))}
    </ul>
  )
}

function Rating({ value, className }: { readonly value: number; readonly className?: string }) {
  return (
    <div className={cn('grid justify-items-center gap-0.5', className)}>
      <span className="text-xl font-bold text-ink">{value.toFixed(2)}</span>
      <span className="flex text-warning" aria-label={`Rated ${value.toFixed(2)} out of 5`}>
        {[0, 1, 2, 3, 4].map((star) => (
          <Star key={star} aria-hidden="true" className="size-3 fill-current" />
        ))}
      </span>
    </div>
  )
}

function IntroButton({ manager }: { readonly manager: SuccessManager }) {
  const [open, setOpen] = useState(false)
  if (!manager.introVideoUrl) return null
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-positive-surface py-1 pe-1 ps-3 text-sm font-bold text-positive transition-[filter] hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none"
      >
        Watch Intro
        <span className="grid size-6 place-items-center rounded-full bg-surface-inverse text-surface">
          <Play aria-hidden="true" className="size-3 fill-current" />
        </span>
      </button>
      <DialogPopup className="sm:max-w-2xl">
        <div className="mb-3 flex items-center gap-3 pe-10">
          <Avatar name={manager.name} src={manager.photoUrl} alt="" size="md" className="[&>img]:object-top" />
          <div>
            <DialogTitle className="flex items-center gap-1.5 font-gowun text-lg font-bold text-ink">
              {manager.name}
              <BadgeCheck aria-label="Verified" className="size-4 text-accent" />
            </DialogTitle>
            <p className="text-sm text-ink-muted">{manager.title} ({manager.yearsExperience}+ years)</p>
          </div>
        </div>
        <video src={manager.introVideoUrl} controls autoPlay playsInline className="aspect-video w-full rounded-lg bg-surface-inverse">
          <track kind="captions" />
        </video>
        <DialogClose aria-label={`Close ${manager.name}'s intro`} />
      </DialogPopup>
    </Dialog>
  )
}

function Name({ manager, as: Heading }: { readonly manager: SuccessManager; readonly as: 'h4' }) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Heading className="flex items-center gap-1.5 font-gowun text-xl font-bold text-ink">
          {manager.name}
          <BadgeCheck aria-label="Verified" className="size-5 shrink-0 text-accent" />
        </Heading>
        <IntroButton manager={manager} />
      </div>
      <p className="text-sm text-ink-muted">
        {manager.title} ({manager.yearsExperience}+ years)
      </p>
    </div>
  )
}

// A soft wash rising from each card's foot, alternating like the plan cards.
const ROW_WASHES = ['from-positive-surface', 'from-accent-subtle'] as const

function ManagerRow({ manager, onStart, index }: { readonly manager: SuccessManager; readonly onStart: () => void; readonly index: number }) {
  const booked = manager.nextOpening !== undefined
  return (
    <li className={cn('grid gap-4 rounded-panel border border-border bg-surface bg-gradient-to-t via-surface to-surface p-5 md:grid-cols-[1fr_auto]', ROW_WASHES[index % ROW_WASHES.length])}>
      <div className="grid min-w-0 gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={manager.name} src={manager.photoUrl} alt="" size="lg" className="size-14 [&>img]:object-top" />
            <Name manager={manager} as="h4" />
          </div>
          <dl className="flex gap-2">
            <div className="grid min-w-20 justify-items-center rounded-lg bg-surface-subtle px-3 py-1.5">
              <dt className="sr-only">Rating</dt>
              <dd><Rating value={manager.rating} /></dd>
            </div>
            <div className="grid min-w-20 content-center justify-items-center rounded-lg bg-surface-subtle px-3 py-1.5">
              <dd className="text-xl font-bold text-ink">{manager.clientsPlaced}</dd>
              <dt className="text-xs text-ink-muted">Clients placed</dt>
            </div>
          </dl>
        </div>
        <Tags manager={manager} />
        <Popover>
          <PopoverTrigger
            openOnHover
            delay={150}
            aria-label={`About ${manager.name}: read the full bio`}
            className="rounded-md text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <span className="line-clamp-2 text-sm leading-6 text-ink-muted">“{manager.bio}”</span>
          </PopoverTrigger>
          <PopoverContent side="top" sideOffset={8} className="w-[min(32rem,calc(100vw-2rem))]">
            <p className="font-semibold text-ink">About {manager.name}</p>
            <p className="mt-3 rounded-lg bg-surface-subtle p-4 text-sm leading-6 text-ink">{manager.bio}</p>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid content-center gap-3 border-t border-border pt-4 md:w-60 md:border-s md:border-t-0 md:ps-5 md:pt-0">
        <p className="w-fit rounded-full bg-positive-surface px-4 py-1 text-sm font-bold text-positive">{manager.interviewsGuaranteed} interviews guaranteed</p>
        <div>
          {manager.listPrice ? <p className="text-base font-semibold text-ink-muted line-through" aria-label={`Was ${money.format(manager.listPrice)}`}>{money.format(manager.listPrice)}</p> : null}
          <p className="flex flex-wrap items-center gap-2">
            <span className="text-3xl font-extrabold text-ink">{money.format(manager.price)}</span>
            {manager.listPrice ? (
              <span className="rounded-full bg-surface-inverse px-2.5 py-0.5 text-sm font-bold text-positive-surface">
                Save {Math.round((1 - manager.price / manager.listPrice) * 100)}%
              </span>
            ) : null}
          </p>
        </div>
        {booked ? (
          <p className="rounded-lg bg-surface-subtle px-3 py-2.5 text-center text-sm font-medium text-ink">
            Fully booked. Next opening {openingDate.format(new Date(manager.nextOpening ?? ''))}
          </p>
        ) : (
          <Button size="lg" onClick={onStart} leadingIcon={<Plus aria-hidden="true" className="size-4" />} className="w-full">
            Start with {manager.name.split(' ')[0]}
          </Button>
        )}
      </div>
    </li>
  )
}

function DirectorySkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading success managers" className="mt-6 grid gap-4">
      <Skeleton className="h-32 rounded-panel" />
      {[0, 1, 2].map((item) => <Skeleton key={item} className="h-44 rounded-panel" />)}
    </div>
  )
}

export function SuccessManagerPicker({ setupHref, profile, savedCard, directory, onRetry, onSignupComplete, onStart }: SuccessManagerPickerProps) {
  const [signup, setSignup] = useState<{ readonly pkg: DfySignupPackage; readonly managerId: string; readonly managerName: string } | null>(null)
  const managers = directory.status === 'ready' ? directory.managers : []
  const available = managers.filter((manager) => manager.nextOpening === undefined)
  const start = (manager: SuccessManager) => (onStart ? onStart(manager) : setSignup({ managerId: manager.id, managerName: manager.name, pkg: packageFor(manager) }))

  return (
    <div className="flex flex-1 flex-col">
        <header className="flex flex-1 flex-col justify-center pb-16 pt-12">
          <h3 className="mx-auto max-w-2xl text-center font-gowun text-2xl leading-tight text-ink sm:text-3xl">
            A Success Manager Who Applies for You,
            <br />
            Built to <strong className="font-bold">Land Your Next Interview</strong>
          </h3>
          {/* One centred row on a wide screen. On a phone every item wraps to its own line, and
              centring each line left the ticks in five different places, so it stacks left-aligned
              as a block that is itself centred. */}
          <ul
            aria-label="What your success manager does"
            className="mx-auto mt-5 flex w-fit max-w-3xl flex-col gap-y-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6"
          >
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm font-medium text-ink">
                <Check aria-hidden="true" className="size-4 shrink-0 text-positive" />
                {feature}
              </li>
            ))}
          </ul>
        </header>

        {directory.status === 'loading' ? <DirectorySkeleton /> : null}

        {directory.status === 'error' ? (
          <div role="alert" className="mx-auto mt-6 grid max-w-md justify-items-center gap-3 rounded-panel border border-border bg-surface p-8 text-center">
            <p className="font-gowun text-lg font-semibold text-ink">We couldn’t load the success managers</p>
            <p className="text-sm text-ink-muted">Your saved details are safe. Try again in a moment.</p>
            <Button variant="secondary" leadingIcon={<RotateCw aria-hidden="true" className="size-4" />} onClick={onRetry}>Try again</Button>
          </div>
        ) : null}

        {directory.status === 'ready' && available.length === 0 ? (
          <EmptyState
            className="mt-6 rounded-panel border border-border bg-surface"
            title="Every success manager is fully booked"
            description="New places open every week. Until then, Auto Apply can keep sending tailored applications for you."
            action={<a href={setupHref} className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Set up Auto Apply</a>}
          />
        ) : null}

        {directory.status === 'ready' && available.length > 0 ? (
          <>
            <section aria-labelledby="all-managers">
              <h3 id="all-managers" className="sr-only">Success managers</h3>
              <ul className="grid gap-4">
                {managers.map((manager, index) => (
                  <ManagerRow key={manager.id} manager={manager} index={index} onStart={() => start(manager)} />
                ))}
              </ul>
            </section>
          </>
        ) : null}

      {signup ? (
        <DfySignupDialog
          open
          onOpenChange={(open) => {
            if (!open) setSignup(null)
          }}
          pkg={signup.pkg}
          managerName={signup.managerName}
          profile={profile}
          setupHref={setupHref}
          savedCard={savedCard}
          onComplete={(lead) => onSignupComplete?.({ ...lead, managerId: signup.managerId })}
        />
      ) : null}
    </div>
  )
}
