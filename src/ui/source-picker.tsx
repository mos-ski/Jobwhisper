import { forwardRef, type ReactNode } from 'react'
import { Upload } from 'lucide-react'

import { cn } from './cn'

export type SourcePickerOption =
  | { readonly label: string; readonly hint?: string; readonly icon?: ReactNode; readonly emphasis?: 'default' | 'strong'; readonly href: string; readonly onClick?: undefined }
  | { readonly label: string; readonly hint?: string; readonly icon?: ReactNode; readonly emphasis?: 'default' | 'strong'; readonly href?: undefined; readonly onClick: () => void }

export type SourcePickerProps = {
  readonly title: string
  readonly options: readonly SourcePickerOption[]
  readonly className?: string
  readonly historyLink?: {
    readonly label: string
    readonly href: string
  }
}

const tileClassName =
  'flex min-h-32 flex-col items-center justify-center gap-2 rounded-lg border border-input bg-surface px-4 py-6 text-center shadow-control transition-colors duration-normal ease-default hover:border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus'

function SourcePickerTile({ option }: { readonly option: SourcePickerOption }) {
  const content = (
    <>
      <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-surface-raised shadow-control [&>svg]:size-5 [&>svg]:text-ink-muted">
        {option.icon ?? <Upload aria-hidden="true" />}
      </span>
      <span className={cn('block text-sm text-ink', option.emphasis === 'strong' ? 'font-semibold' : 'font-medium')}>{option.label}</span>
      {option.hint ? <span className="block text-xs text-ink-muted">{option.hint}</span> : null}
    </>
  )

  if (option.href) {
    return (
      <a href={option.href} className={tileClassName}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" onClick={option.onClick} className={tileClassName}>
      {content}
    </button>
  )
}

export const SourcePicker = forwardRef<HTMLDivElement, SourcePickerProps>(function SourcePicker(
  { title, options, className, historyLink },
  ref,
) {
  return (
    <div ref={ref} data-slot="source-picker" className={cn('flex min-h-[48rem] flex-col items-center justify-center', className)}>
      <h1 className="text-lg font-semibold leading-7 text-ink">{title}</h1>
      <div className={cn('mt-4 grid w-full gap-3', options.length > 1 ? 'max-w-lg grid-cols-2' : 'max-w-xs grid-cols-1')}>
        {options.map((option) => (
          <SourcePickerTile key={option.label} option={option} />
        ))}
      </div>

      {historyLink ? (
        <a href={historyLink.href} className="mt-6 text-sm font-semibold text-accent underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          {historyLink.label}
        </a>
      ) : null}
    </div>
  )
})
