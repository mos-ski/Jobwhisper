import { Bell, ChevronDown } from 'lucide-react'

import { Avatar, Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger, cn } from '@/ui'

export type DesktopHeaderProps = {
  readonly userName: string
  readonly avatarSrc?: string
  readonly stealth: boolean
  readonly onToggleStealth: () => void
  readonly onOpenSettings: () => void
  readonly onOpenWhatsNew: () => void
  /** Opens What's new from the notifications bell; clears the dot once the dialog shows. */
  readonly onOpenNotifications: () => void
  readonly onSignOut: () => void
  readonly hasNotifications?: boolean
}

/** The title bar's right side on every screen but the live session. */
export function DesktopHeader({ userName, avatarSrc, stealth, onToggleStealth, onOpenSettings, onOpenWhatsNew, onOpenNotifications, onSignOut, hasNotifications = false }: DesktopHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={stealth}
        onClick={onToggleStealth}
        className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-sm text-ink-muted hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        Stealth mode
        <span className={cn('font-semibold', stealth ? 'text-positive' : 'text-danger')}>{stealth ? 'On' : 'Off'}</span>
      </button>
      <button
        type="button"
        aria-label={hasNotifications ? 'Notifications, new' : 'Notifications'}
        onClick={onOpenNotifications}
        className="relative grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <Bell aria-hidden="true" className="size-4" />
        {hasNotifications ? <span aria-hidden="true" className="absolute end-2 top-2 size-2 rounded-full bg-danger" /> : null}
      </button>
      <Menu>
        <MenuTrigger className="inline-flex min-h-9 items-center gap-2 rounded-lg px-1.5 text-sm font-semibold text-ink hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          <Avatar name={userName} src={avatarSrc} alt="" size="sm" />
          {userName}
          <ChevronDown aria-hidden="true" className="size-4 text-ink-muted" />
        </MenuTrigger>
        <MenuContent align="end">
          <MenuItem onClick={onOpenSettings}>Settings</MenuItem>
          <MenuItem onClick={onOpenWhatsNew}>What&rsquo;s new</MenuItem>
          <MenuSeparator />
          <MenuItem onClick={onSignOut}>Log out</MenuItem>
        </MenuContent>
      </Menu>
    </div>
  )
}
