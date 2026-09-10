import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

import type { AdminFeatureFlag, AdminFeatureFlagCategory } from '@/contracts/admin-feature-flags.draft'
import type { AdminNavItem, AdminNotification, AdminSearchResult } from '@/contracts/admin.draft'
import type { UserIdentity } from '@/contracts/identity'
import {
  Button,
  Skeleton,
  Switch,
} from '@/ui'

import { AdminShell } from './admin-shell'

const categoryLabels: Record<AdminFeatureFlagCategory, { readonly label: string; readonly description: string }> = {
  products: { label: 'Products', description: 'Also switchable from Products, where the blast radius is shown. Off in either place is off.' },
  app: { label: 'App', description: 'Parts of the app that are not sold. Switching a parent off takes its children with it.' },
  support: { label: 'Support', description: 'The request kinds the support form offers, and the star rating.' },
}

const categoryOrder: readonly AdminFeatureFlagCategory[] = ['products', 'app', 'support']

export type AdminFeatureFlagsViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly flags: readonly AdminFeatureFlag[]
  readonly isLoading?: boolean
  readonly errorMessage?: string
  readonly onRetry?: () => void
}

export function AdminFeatureFlagsView({
  user,
  navItems,
  notifications,
  searchResults,
  flags,
  isLoading = false,
  errorMessage,
  onRetry,
}: AdminFeatureFlagsViewProps) {
  const [overrides, setOverrides] = useState<Readonly<Record<string, boolean>>>({})

  function isEnabled(flag: AdminFeatureFlag): boolean {
    if (flag.enabled === null) return true
    return overrides[flag.id] ?? flag.enabled
  }

  function handleToggle(flag: AdminFeatureFlag, next: boolean) {
    setOverrides((prev) => {
      const nextOverrides = { ...prev, [flag.id]: next }
      // If turning a parent off, turn off all children
      if (!next) {
        flags
          .filter((child) => child.parentId === flag.id)
          .forEach((child) => {
            nextOverrides[child.id] = false
          })
      }
      return nextOverrides
    })
  }

  const grouped = categoryOrder.map((category) => ({
    category,
    ...categoryLabels[category],
    flags: flags.filter((flag) => flag.category === category),
  }))

  return (
    <AdminShell user={user} navItems={navItems} activeModule="feature-flags" notifications={notifications} searchResults={searchResults}>
      <div className="grid gap-6 p-4 sm:p-6">
        <div>
          <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">Feature flags</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Switch parts of the web app on and off. A surface that is off disappears from the sidebar and refuses its own routes — a saved link will not get anyone in.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="bg-surface shadow-panel p-5">
                <Skeleton className="mb-4 h-5 w-24" />
                <Skeleton className="mb-3 h-16" />
                <Skeleton className="mb-3 h-16" />
                <Skeleton className="h-16" />
              </div>
            ))}
          </div>
        ) : errorMessage ? (
          <div role="alert" className="bg-danger-surface p-6 text-center shadow-panel">
            <p className="mt-3 text-sm font-semibold text-ink">Could not load feature flags</p>
            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-ink-muted">{errorMessage}</p>
            {onRetry ? (
              <Button variant="secondary" leadingIcon={<RefreshCw aria-hidden="true" />} onClick={onRetry} className="mt-4">
                Try again
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-6">
            {grouped.map((group) => (
              <section key={group.category} className="bg-surface shadow-panel">
                <div className="border-b border-border px-5 py-4">
                  <h2 className="text-base font-bold text-ink">{group.label}</h2>
                  <p className="mt-0.5 text-sm text-ink-muted">{group.description}</p>
                </div>
                <ul>
                  {group.flags.map((flag) => {
                    const enabled = isEnabled(flag)
                    const isChild = flag.parentId !== undefined
                    const parentOff = flag.parentId !== undefined && !isEnabled(group.flags.find((f) => f.id === flag.parentId)!)
                    return (
                      <li
                        key={flag.id}
                        className={`flex items-center justify-between gap-4 border-b border-border px-5 py-3.5 last:border-b-0 ${isChild ? 'ps-10' : ''}`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-semibold text-ink ${!enabled || parentOff ? 'text-ink-muted' : ''}`}>
                            {isChild && <span aria-hidden="true" className="me-1.5 text-ink-muted">↳</span>}
                            {flag.name}
                          </p>
                          <p className="mt-0.5 text-sm leading-5 text-ink-muted">{flag.description}</p>
                        </div>
                        <Switch
                          checked={enabled}
                          disabled={parentOff}
                          onCheckedChange={(next) => handleToggle(flag, next)}
                          aria-label={`${enabled ? 'Disable' : 'Enable'} ${flag.name}`}
                        />
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
