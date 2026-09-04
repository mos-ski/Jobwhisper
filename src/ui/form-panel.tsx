import { forwardRef, useEffect, useId, useRef, useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type FormHTMLAttributes, type InputHTMLAttributes, type MouseEvent, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight, Check, FileText, Pencil } from 'lucide-react'

import { cn } from './cn'
import { Dialog, DialogPopup, DialogTitle } from './dialog'
import { SelectField } from './select-field'

function ResumeFileIcon({ className }: { readonly className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <g clipPath="url(#resume-file-clip)">
        <path d="M7.79293 1.34766H3.59883C3.28101 1.34766 2.97622 1.47391 2.75149 1.69863C2.52676 1.92336 2.40051 2.22816 2.40051 2.54597V12.1325C2.40051 12.4503 2.52676 12.7551 2.75149 12.9798C2.97622 13.2046 3.28101 13.3308 3.59883 13.3308H10.7887C11.1065 13.3308 11.4113 13.2046 11.6361 12.9798C11.8608 12.7551 11.987 12.4503 11.987 12.1325V5.54176L7.79293 1.34766Z" fill="#EA4335" stroke="#EA4335" strokeWidth="1.12342" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.79004 1.34766V5.54176H11.9841" fill="white" stroke="#EA4335" strokeWidth="1.12342" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="resume-file-clip">
          <rect width="14.3798" height="14.3798" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function ScrollCue() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function update() {
      const hasOverflow = document.documentElement.scrollHeight > window.innerHeight + 24
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24
      setVisible(hasOverflow && !atBottom)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollBy({ top: window.innerHeight * 0.6, behavior: 'smooth' })}
      aria-label="Scroll down for more"
      className="fixed inset-x-0 bottom-4 z-sticky mx-auto grid size-11 place-items-center rounded-pill bg-accent text-on-accent shadow-control animate-bounce focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus motion-reduce:animate-none sm:hidden"
    >
      <ChevronDown aria-hidden="true" className="size-5" />
    </button>
  )
}

export type FormUploadedFile = {
  readonly fileName: string
  readonly changeHref: string
  readonly onChangeClick?: () => void
}

export type FormPanelProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'title'> & {
  readonly title: string
  readonly step?: string
  readonly uploadedFile?: FormUploadedFile
  readonly footer?: ReactNode
  readonly children: ReactNode
  readonly className?: string
  readonly bodyClassName?: string
}

export const FormPanel = forwardRef<HTMLFormElement, FormPanelProps>(
  function FormPanel({ title, step, uploadedFile, footer, children, className, bodyClassName, ...props }, ref) {
    return (
      <>
        <form ref={ref} data-slot="form-panel" className={cn('mx-auto w-full max-w-[30rem] border border-border bg-surface shadow-panel', className)} {...props}>
          <header data-slot="form-panel-header" className="flex min-h-20 items-center justify-center gap-2 border-b border-border px-6 py-7 text-center">
            <h1 className="font-gowun text-xl font-medium leading-7 text-ink">{title}</h1>
            {step ? <span className="text-sm font-medium leading-5 text-ink-muted">{step}</span> : null}
          </header>
          {uploadedFile ? (
            <UploadedFileStrip
              fileName={uploadedFile.fileName}
              changeHref={uploadedFile.changeHref}
              onChangeClick={uploadedFile.onChangeClick}
            />
          ) : null}
          <div data-slot="form-panel-body" className={cn('grid gap-3 px-6 py-8 sm:px-8', bodyClassName)}>
            {children}
          </div>
          {footer}
        </form>
        <ScrollCue />
      </>
    )
  },
)

export type UploadedFileStripProps = {
  readonly fileName: string
  readonly changeHref: string
  readonly onChangeClick?: () => void
  readonly className?: string
}

export const UploadedFileStrip = forwardRef<HTMLDivElement, UploadedFileStripProps>(
  function UploadedFileStrip({ fileName, changeHref, onChangeClick, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="uploaded-file-strip"
        className={cn('mx-auto flex min-h-8 w-[calc(100%-4rem)] max-w-[26rem] items-center justify-between gap-3 rounded-b-lg bg-accent-subtle px-4 py-1 text-xs font-normal leading-none text-ink-muted', className)}
        {...props}
      >
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <ResumeFileIcon className="size-3.5 shrink-0" />
          <span className="truncate">{fileName}</span>
        </span>
        <a
          href={changeHref}
          onClick={onChangeClick}
          className="shrink-0 text-[10.5px] font-semibold leading-5 text-accent underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          Change
        </a>
      </div>
    )
  },
)

export type UploadedFileDialogProps = {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly fileName: string
  readonly fileUrl?: string
  readonly continueHref: string
  readonly defaultChecked?: boolean
  readonly onDefaultChange?: (checked: boolean) => void
}

export function UploadedFileDialog({ open, onOpenChange, fileName, fileUrl, continueHref, defaultChecked, onDefaultChange }: UploadedFileDialogProps) {
  const [progress, setProgress] = useState(0)
  const ready = progress >= 100

  useEffect(() => {
    if (!open) {
      setProgress(0)
      return
    }
    setProgress(0)
    const start = Date.now()
    const duration = 1100
    let frame: number

    function tick() {
      const pct = Math.min(100, Math.round(((Date.now() - start) / duration) * 100))
      setProgress(pct)
      if (pct < 100) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup aria-label="Resume uploaded" className="sm:max-w-lg">
        <DialogTitle className="font-gowun">Resume uploaded</DialogTitle>
        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          {fileUrl ? (
            <iframe
              src={fileUrl}
              title={`Preview of ${fileName}`}
              className="h-64 w-full bg-surface-subtle"
            />
          ) : (
            <div className="flex h-64 flex-col items-center justify-center gap-3 bg-surface-subtle px-6 text-center">
              <div className="grid size-14 place-items-center rounded-xl bg-accent-subtle">
                <ResumeFileIcon className="size-7" />
              </div>
              <div className="grid gap-1">
                <p className="text-sm font-medium text-ink">{fileName}</p>
                <p className="text-xs text-ink-muted">PDF document, preview available after processing</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-surface-subtle px-4 py-3">
          <ResumeFileIcon className="size-5 shrink-0" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{fileName}</span>
          {ready ? <Check aria-hidden="true" className="size-4 shrink-0 text-positive" /> : null}
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-pill bg-surface-subtle" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-pill bg-accent transition-[width] duration-100 ease-linear" style={{ width: `${progress}%` }} />
        </div>
        <label
          className={cn(
            'mt-5 flex min-h-6 items-center gap-2 text-sm font-medium text-ink transition-opacity duration-normal ease-default',
            ready ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <input
            type="checkbox"
            checked={defaultChecked ?? false}
            onChange={(event) => onDefaultChange?.(event.target.checked)}
            disabled={!ready}
            className="size-4 shrink-0 rounded-sm border-input text-accent focus:ring-1 focus:ring-focus focus:ring-offset-0"
          />
          Always use this resume
        </label>
        <a
          href={ready ? continueHref : undefined}
          aria-disabled={!ready}
          className={cn(
            'mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control transition-opacity duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
            !ready && 'pointer-events-none opacity-50',
          )}
        >
          Continue
        </a>
      </DialogPopup>
    </Dialog>
  )
}

export type FormPanelFooterProps = {
  readonly backHref: string
  readonly nextHref: string
  readonly nextLabel?: string
  readonly backLabel?: string
  readonly nextIcon?: ReactNode
  readonly nextDisabled?: boolean
  readonly onNextClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  readonly className?: string
}

export const FormPanelFooter = forwardRef<HTMLElement, FormPanelFooterProps>(
  function FormPanelFooter({ backHref, nextHref, nextLabel = 'Continue', backLabel = 'Back', nextIcon, nextDisabled, onNextClick, className, ...props }, ref) {
    return (
      <footer ref={ref} data-slot="form-panel-footer" className={cn('flex items-center justify-between gap-4 border-t border-border px-6 py-4', className)} {...props}>
        <a href={backHref} className="inline-flex min-h-11 items-center gap-1 rounded-lg py-2.5 text-base font-semibold leading-6 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <ArrowLeft aria-hidden="true" className="size-4" />
          {backLabel}
        </a>
        <a
          href={nextHref}
          aria-disabled={nextDisabled}
          onClick={onNextClick}
          className={cn(
            'inline-flex min-h-11 items-center justify-center gap-3 rounded-lg bg-accent px-4 py-2.5 text-base font-semibold leading-6 text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
            nextDisabled && 'pointer-events-none opacity-50',
          )}
        >
          {nextLabel}
          {nextIcon ? <span className="shrink-0 [&>svg]:size-5">{nextIcon}</span> : <ArrowRight aria-hidden="true" className="size-5" />}
        </a>
      </footer>
    )
  },
)

export type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  readonly id: string
  readonly label: string
  readonly error?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField({ id, label, error, className, disabled, ...props }, ref) {
    const errorId = `${id}-error`

    return (
      <div data-slot="form-field" className="grid gap-1.5">
        <label htmlFor={id} className="text-sm font-medium leading-5 text-ink">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'min-h-11 w-full rounded-lg border border-input bg-surface px-3 py-2.5 text-sm leading-6 text-ink shadow-control outline-none placeholder:text-ink-muted transition-colors duration-normal ease-default focus:border-focus focus:ring-2 focus:ring-focus disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} role="alert" aria-live="polite" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)

export type FormSelectOption = {
  readonly label: string
  readonly value: string
}

export type FormSelectFieldProps = {
  readonly id: string
  readonly label: string
  readonly hideLabel?: boolean
  readonly options: readonly FormSelectOption[]
  readonly error?: string
  readonly value?: string
  readonly defaultValue?: string
  readonly onValueChange?: (value: string) => void
  readonly placeholder?: string
  readonly disabled?: boolean
  readonly required?: boolean
  readonly name?: string
  readonly className?: string
}

export const FormSelectField = SelectField

export type FormTextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
  readonly id: string
  readonly label: string
  readonly error?: string
}

export const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  function FormTextArea({ id, label, error, className, disabled, ...props }, ref) {
    const errorId = `${id}-error`

    return (
      <div data-slot="form-textarea" className="grid gap-1.5">
        <label htmlFor={id} className="text-sm font-medium leading-5 text-ink">
          {label}
        </label>
        <span className="relative block">
          <textarea
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'min-h-40 w-full resize-none rounded-lg border border-input bg-surface px-3.5 py-3 text-base text-ink shadow-control outline-none placeholder:text-ink-muted transition-colors duration-normal ease-default focus:border-focus focus:ring-2 focus:ring-focus sm:text-sm disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-danger focus:border-danger focus:ring-danger/20',
              className,
            )}
            {...props}
          />
        </span>
        {error ? (
          <p id={errorId} role="alert" aria-live="polite" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)

function AiSuggestionIcon({ className }: { readonly className?: string }) {
  const uid = useId()
  const gradientA = `${uid}-a`
  const gradientB = `${uid}-b`
  return (
    <svg viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path
        d="M4.79915 3.05872C4.96373 2.96571 5.1262 2.92311 5.31301 2.90274C5.79751 2.84992 6.22593 3.16771 6.29348 3.65563C6.32633 3.89292 6.27123 4.14433 6.23296 4.38189C6.17596 4.72143 6.12196 5.06148 6.071 5.40197C6.01209 5.80053 5.78793 6.95482 6.61524 6.60148C7.11758 6.38694 7.51442 5.81425 7.84329 5.38838C8.33054 4.75752 8.75898 4.0724 9.21816 3.41906C9.54011 2.96374 9.88074 2.52204 10.2394 2.09505C10.6521 1.60974 11.3982 0.958544 12.0543 0.882917C12.5469 0.826103 12.8245 1.38502 12.906 1.79021C12.9679 2.09833 12.9732 2.39618 12.9798 2.71201C12.9968 3.52456 12.9283 4.33841 12.9497 5.15032C12.9556 5.33328 13.0267 5.7186 13.175 5.83564C13.5548 6.13556 14.1798 5.18896 14.363 4.96368C14.6923 4.55995 15.025 4.15905 15.3611 3.76096C15.4401 3.66887 15.9034 3.11749 15.9969 3.20435C16.0747 3.558 14.6583 5.846 14.4264 6.2347C14.1064 6.76369 13.7938 7.2929 13.4446 7.80423C13.1271 8.26922 12.7874 8.84081 12.2516 9.07632C11.9234 9.23685 11.4954 9.01091 11.3652 8.67863C11.128 8.07364 11.1235 7.33144 11.0306 6.691C10.9771 6.3223 10.9582 5.90518 10.8291 5.56327C10.6534 5.16526 10.3465 5.00124 9.92421 5.04423C9.30186 5.10759 8.72425 5.83385 8.36467 6.29293C7.9979 6.75866 7.65496 7.2426 7.3371 7.74293C7.0019 8.2757 6.70383 8.816 6.37677 9.34766C5.9425 10.0434 5.49856 10.7331 5.04508 11.4165C4.72143 11.9005 4.25608 12.7991 3.61088 12.8747C3.16076 12.9274 2.82072 12.4747 2.84566 12.047C2.87534 11.5379 3.05494 11.0082 3.1986 10.5157L3.77529 8.56347C3.99974 7.8056 4.58384 5.96647 4.5222 5.27275C4.51304 5.16969 4.48028 5.0315 4.39495 4.9634C4.28006 4.87171 4.11572 4.94526 4.0073 5.0105C3.27383 5.45184 0.585779 8.84764 0.332402 8.87807C0.0467409 8.76828 1.20107 7.15663 1.31976 6.99027C1.99115 6.04936 2.64095 5.0877 3.43489 4.24364C3.85113 3.80112 4.25808 3.3547 4.79915 3.05872Z"
        fill={`url(#${gradientA})`}
      />
      <path d="M14.25 9.5L14.7227 10.7773L16 11.25L14.7227 11.7227L14.25 13L13.7773 11.7227L12.5 11.25L13.7773 10.7773L14.25 9.5Z" fill={`url(#${gradientB})`} />
      <defs>
        <linearGradient id={gradientA} x1="0.287109" y1="6.87891" x2="16" y2="6.87891" gradientUnits="userSpaceOnUse">
          <stop stopColor="#134ABE" />
          <stop offset="1" stopColor="#FF5E93" />
        </linearGradient>
        <linearGradient id={gradientB} x1="12.5" y1="11.25" x2="16" y2="11.25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#134ABE" />
          <stop offset="1" stopColor="#FF5E93" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export type AiSuggestionActionProps = ButtonHTMLAttributes<HTMLButtonElement>

export const AiSuggestionAction = forwardRef<HTMLButtonElement, AiSuggestionActionProps>(
  function AiSuggestionAction({ className, type = 'button', children = 'AI Suggestion', ...props }, ref) {
    return (
      <button
        ref={ref}
        data-slot="ai-suggestion-action"
        type={type}
        className={cn('ms-auto inline-flex min-h-7 items-center gap-1.5 rounded-soft px-1 text-sm font-bold leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', className)}
        {...props}
      >
        <AiSuggestionIcon className="h-[13px] w-4 shrink-0" />
        <span className="bg-gradient-to-r from-[#134ABE] to-[#FF5E93] bg-clip-text text-transparent">{children}</span>
      </button>
    )
  },
)

export type DocumentDropActionProps = {
  readonly label?: string
  readonly hint?: string
  readonly actionHref?: string
  readonly onTrigger?: () => void
  readonly children?: ReactNode
  readonly className?: string
}

export const DocumentDropAction = forwardRef<HTMLElement, DocumentDropActionProps>(
  function DocumentDropAction({ label = 'Documents', hint = 'Add context, notes, or other docs', actionHref, onTrigger, children, className, ...props }, ref) {
    const dropzoneClassName = 'grid min-h-20 place-items-center rounded-lg border border-dashed border-input bg-surface-subtle px-4 py-6 text-center text-sm font-medium text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus'

    return (
      <section ref={ref} data-slot="document-drop-action" className={cn('grid gap-2', className)} aria-labelledby="document-drop-title" {...props}>
        <h2 id="document-drop-title" className="text-sm font-medium leading-5 text-ink">
          {label} <span className="font-normal text-ink-muted">(optional)</span>
        </h2>
        {actionHref ? (
          <a href={actionHref} className={dropzoneClassName}>
            {children ?? hint}
          </a>
        ) : (
          <button type="button" onClick={onTrigger} className={dropzoneClassName}>
            {children ?? hint}
          </button>
        )}
      </section>
    )
  },
)

export type FormChoiceOption<TValue extends string = string> = {
  readonly label: string
  readonly value: TValue
}

export type FormChoiceGroupProps<TValue extends string = string> = {
  readonly label: string
  readonly name: string
  readonly options: readonly FormChoiceOption<TValue>[]
  readonly selected: TValue
  readonly onSelectedChange?: (value: TValue) => void
  readonly className?: string
}

export function FormChoiceGroup<TValue extends string = string>({ label, name, options, selected, onSelectedChange, className }: FormChoiceGroupProps<TValue>) {
  return (
    <section data-slot="form-choice-group" className={cn('grid gap-2.5', className)}>
      <h2 className="text-xs font-semibold leading-5 text-ink-muted">{label}</h2>
      <div className="grid gap-2.5 sm:grid-cols-3">
        {options.map((option) => (
          <label
            key={option.value}
            data-slot="form-choice"
            data-variant={option.value === selected ? 'selected' : 'default'}
            className={cn(
              'flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors duration-normal ease-default focus-within:ring-2 focus-within:ring-focus',
              option.value === selected ? 'border-accent bg-accent-subtle font-semibold text-accent' : 'border-input bg-surface font-medium text-ink-muted hover:border-border hover:text-ink',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              className="sr-only"
              checked={option.value === selected}
              onChange={() => onSelectedChange?.(option.value)}
            />
            <span className={cn('grid size-4 place-items-center rounded-full border', option.value === selected ? 'border-accent bg-surface' : 'border-input bg-surface')}>
              {option.value === selected ? <span className="size-2 rounded-full bg-accent" /> : null}
            </span>
            {option.label}
          </label>
        ))}
      </div>
    </section>
  )
}

export type ExampleResponseCardProps = {
  readonly children: ReactNode
  readonly helperText?: string
  readonly className?: string
}

export const ExampleResponseCard = forwardRef<HTMLDivElement, ExampleResponseCardProps>(
  function ExampleResponseCard({ children, helperText, className, ...props }, ref) {
    return (
      <div ref={ref} data-slot="example-response-card" className={cn('grid gap-3', className)} {...props}>
        <blockquote className="font-gowun font-medium rounded-lg border border-border bg-surface-subtle px-4 py-3 text-sm leading-6 text-ink-muted">
          {children}
        </blockquote>
        {helperText ? <p className="text-xs leading-5 text-ink-muted">{helperText}</p> : null}
      </div>
    )
  },
)

export type PermissionStepItem = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly status: 'available' | 'complete' | 'disabled'
  readonly actionLabel: string
  readonly icon?: ReactNode
}

export type PermissionStepsProps = {
  readonly steps: readonly PermissionStepItem[]
  readonly actionHref: string
  readonly previewSrc?: string
  readonly startHref?: string
  readonly startLabel?: string
  readonly className?: string
  readonly onRequestPermission?: (stepId: string) => void
  readonly pendingStepId?: string | null
  readonly grantedStepIds?: ReadonlySet<string>
  readonly errorStepId?: string | null
  readonly errorMessage?: string
  readonly videoStepId?: string
  readonly videoStream?: MediaStream | null
}

export const PermissionSteps = forwardRef<HTMLDivElement, PermissionStepsProps>(
  function PermissionSteps(
    {
      steps,
      actionHref,
      previewSrc,
      startHref,
      startLabel = 'Start',
      className,
      onRequestPermission,
      pendingStepId,
      grantedStepIds,
      errorStepId,
      errorMessage = 'Permission was denied. Check your browser settings and try again.',
      videoStepId = 'video',
      videoStream,
      ...props
    },
    ref,
  ) {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
      if (videoRef.current) videoRef.current.srcObject = videoStream ?? null
    }, [videoStream])

    return (
      <div ref={ref} data-slot="permission-steps" className={cn('grid gap-4', className)} {...props}>
        {steps.map((step, index) => {
          const isGranted = grantedStepIds?.has(step.id) ?? false
          const status = isGranted ? 'complete' : step.status
          const isPending = pendingStepId === step.id
          const hasError = errorStepId === step.id
          const showLiveVideo = step.id === videoStepId && videoStream
          return (
            <section key={step.id} className="grid gap-3 rounded-lg border border-border bg-surface p-3 shadow-control">
              <div className="flex items-start gap-3">
                <span className={cn('grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold', status === 'complete' ? 'bg-positive-surface text-positive' : 'bg-accent text-on-accent')}>
                  {status === 'complete' ? <Check aria-hidden="true" className="size-4" /> : index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-5 text-ink">{step.title}</span>
                  <span className="mt-1 block text-xs font-medium leading-5 text-ink-muted">{step.description}</span>
                </span>
              </div>
              {showLiveVideo ? (
                <video ref={videoRef} autoPlay muted playsInline className="aspect-video w-full scale-x-[-1] rounded-lg bg-black object-cover" />
              ) : previewSrc && step.id === videoStepId ? (
                <img src={previewSrc} alt="" className="aspect-video w-full rounded-lg object-cover" />
              ) : null}
              {hasError ? <p className="text-xs font-medium text-danger">{errorMessage}</p> : null}
              {status !== 'complete' ? (
                onRequestPermission ? (
                  <button
                    type="button"
                    disabled={step.status === 'disabled' || isPending}
                    onClick={() => onRequestPermission(step.id)}
                    className={cn(
                      'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                      step.status === 'disabled' ? 'pointer-events-none bg-muted text-on-accent opacity-50' : 'bg-accent text-on-accent shadow-control disabled:opacity-70',
                    )}
                  >
                    {step.icon ?? <ArrowRight aria-hidden="true" className="size-5" />}
                    {isPending ? 'Requesting…' : step.actionLabel}
                  </button>
                ) : (
                  <a
                    href={actionHref}
                    aria-disabled={step.status === 'disabled'}
                    className={cn(
                      'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                      step.status === 'disabled' ? 'pointer-events-none bg-muted text-on-accent opacity-50' : 'bg-accent text-on-accent shadow-control',
                    )}
                  >
                    {step.icon ?? <ArrowRight aria-hidden="true" className="size-5" />}
                    {step.actionLabel}
                  </a>
                )
              ) : null}
            </section>
          )
        })}
        {startHref ? (
          <a href={startHref} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            {startLabel}
            <ChevronRight aria-hidden="true" className="size-5" />
          </a>
        ) : null}
      </div>
    )
  },
)

export type SummaryRow = {
  readonly id: string
  readonly title: string
  readonly value: ReactNode
  readonly details?: ReactNode
  readonly icon?: ReactNode
  readonly href?: string
}

export type ReviewSummaryListProps = {
  readonly rows: readonly SummaryRow[]
  readonly className?: string
}

export const ReviewSummaryList = forwardRef<HTMLDivElement, ReviewSummaryListProps>(
  function ReviewSummaryList({ rows, className, ...props }, ref) {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    return (
      <div ref={ref} data-slot="review-summary-list" className={cn('grid min-w-0 gap-3', className)} {...props}>
        {rows.map((row) => {
          const isExpanded = expandedId === row.id
          return (
            <div key={row.id} className="rounded-lg border border-border bg-surface">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : row.id)}
                className="flex min-h-16 w-full items-center gap-4 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent-subtle">
                  {row.icon ?? <FileText aria-hidden="true" className="size-5 text-accent" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold leading-5 text-ink">{row.title}</span>
                  <span className="mt-1 block text-xs leading-4 text-ink-muted line-clamp-2">{row.value}</span>
                </span>
                <ChevronDown aria-hidden="true" className={cn('size-4 shrink-0 text-ink-muted transition-transform duration-200', isExpanded && 'rotate-180')} />
              </button>
              {isExpanded && row.details ? (
                <div className="border-t border-border px-4 pb-4 pt-4">
                  <div className="text-sm leading-6 text-ink-muted">{row.details}</div>
                  {row.href ? (
                    <a href={row.href} className="mt-3 inline-flex min-h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                      <Pencil aria-hidden="true" className="size-3" />
                      Edit
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    )
  },
)

export type OptionStackItem = {
  readonly id: string
  readonly label: string
  readonly href: string
  readonly icon?: ReactNode
  readonly variant?: 'default' | 'primary'
  readonly disabled?: boolean
}

export type OptionStackProps = {
  readonly options: readonly OptionStackItem[]
  readonly className?: string
}

export const OptionStack = forwardRef<HTMLDivElement, OptionStackProps>(
  function OptionStack({ options, className, ...props }, ref) {
    return (
      <div ref={ref} data-slot="option-stack" className={cn('grid gap-3', className)} {...props}>
        {options.map((option) => (
          <a
            key={option.id}
            href={option.href}
            aria-disabled={option.disabled}
            className={cn(
              'flex min-h-14 items-center gap-3 rounded-lg border border-input bg-surface px-4 py-3 text-sm font-semibold text-ink shadow-control transition-colors duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
              option.disabled ? 'pointer-events-none opacity-50' : 'hover:bg-surface-subtle',
            )}
          >
            <span className={cn('grid size-7 shrink-0 place-items-center rounded-md', option.variant === 'primary' ? 'bg-accent text-on-accent' : 'bg-surface-subtle text-ink-muted')}>
              {option.icon}
            </span>
            {option.label}
          </a>
        ))}
      </div>
    )
  },
)

export type GoogleAuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const GoogleAuthButton = forwardRef<HTMLButtonElement, GoogleAuthButtonProps>(
  function GoogleAuthButton({ className, type = 'button', children = 'Sign in with Google', ...props }, ref) {
    return (
      <button
        ref={ref}
        data-slot="google-auth-button"
        type={type}
        className={cn('inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-lg border border-input bg-surface px-4 py-2 text-base font-semibold text-ink shadow-control transition-colors duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', className)}
        {...props}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0">
          <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3.02h3.88c2.27-2.09 3.57-5.17 3.57-8.84Z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.12-6.73-4.96H1.26v3.11A12 12 0 0 0 12 24Z" />
          <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.62H1.26a12 12 0 0 0 0 10.76l4.01-3.11Z" />
          <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.6 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.62l4.01 3.11C6.22 6.9 8.87 4.77 12 4.77Z" />
        </svg>
        {children}
      </button>
    )
  },
)

export type FormDividerLabelProps = {
  readonly children: ReactNode
  readonly className?: string
}

export const FormDividerLabel = forwardRef<HTMLDivElement, FormDividerLabelProps>(
  function FormDividerLabel({ children, className, ...props }, ref) {
    return (
      <div ref={ref} data-slot="form-divider-label" className={cn('flex items-center gap-3', className)} {...props}>
        <span className="h-px flex-1 bg-border" />
        <span className="text-sm font-medium leading-5 text-ink">{children}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    )
  },
)

export type FormLinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  readonly variant?: 'primary' | 'secondary'
}

export const FormLinkButton = forwardRef<HTMLAnchorElement, FormLinkButtonProps>(
  function FormLinkButton({ className, variant = 'primary', children, ...props }, ref) {
    return (
      <a
        ref={ref}
        data-slot="form-link-button"
        data-variant={variant}
        className={cn(
          'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
          variant === 'primary' ? 'bg-accent text-on-accent' : 'border border-input bg-surface text-ink',
          className,
        )}
        {...props}
      >
        {children}
      </a>
    )
  },
)
