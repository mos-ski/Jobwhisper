export type DashboardActionId =
  | 'resume-tailor'
  | 'interview-practice'
  | 'interview-copilot'
  | 'coding-copilot'
  | 'meeting-copilot'
  | 'auto-apply'
  | 'done-for-you'

export type DashboardAction = {
  readonly id: DashboardActionId
  readonly title: string
  readonly description: string
  readonly href: string
  readonly featured?: boolean
  readonly badge?: string
  readonly locked?: boolean
  /** Overrides the default "Upgrade to Premium" dialog copy — e.g. for an add-on unlock instead of a plan upgrade. */
  readonly lockMessage?: string
  readonly lockCta?: string
  readonly lockHref?: string
}

export type DashboardNavItem = {
  readonly label: string
  readonly href: string
  readonly active?: boolean
}

export type DashboardInstallPrompt = {
  readonly title: string
  readonly qrSrc: string
  readonly desktopHref: string
  readonly mobileHref: string
}
