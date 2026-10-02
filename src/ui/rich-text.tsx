import type { HTMLAttributes } from 'react'

import { cn } from './cn'

export type RichTextProps = HTMLAttributes<HTMLSpanElement> & {
  readonly text: string
}

/**
 * Renders `**bold**` markers as bold spans. Unmatched markers stay literal, so raw
 * model output never shows stripped asterisks or half-rendered markup.
 */
export function RichText({ text, className, ...props }: RichTextProps) {
  // Split keeps capture groups: even indexes are plain text, odd are bold content.
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <span className={cn(className)} {...props}>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <strong key={index} className="font-semibold">
            {part}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </span>
  )
}
