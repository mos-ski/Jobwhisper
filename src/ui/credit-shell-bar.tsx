import type { ReactNode } from 'react'

import { CreditUsageIndicator, type CreditUsageIndicatorProps } from './credit-usage-indicator'
import { ShellBar, type ShellBarProps } from './shell-bar'

export type CreditShellBarProps = Omit<ShellBarProps, 'children'> & {
  readonly creditUsage?: Pick<CreditUsageIndicatorProps, 'remainingCents' | 'totalCents' | 'formatCredits' | 'billingHref'>
  readonly children?: ReactNode
}

export function CreditShellBar({ creditUsage, children, className, ...props }: CreditShellBarProps) {
  return (
    <ShellBar {...props} className={className}>
      {creditUsage ? (
        <CreditUsageIndicator
          remainingCents={creditUsage.remainingCents}
          totalCents={creditUsage.totalCents}
          formatCredits={creditUsage.formatCredits}
          billingHref={creditUsage.billingHref}
          className="hidden sm:flex"
        />
      ) : null}
      {children}
    </ShellBar>
  )
}
