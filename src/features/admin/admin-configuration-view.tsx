import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { AlertTriangle, ArrowDown, ArrowUp, Ban, Check, Plus, TicketPercent, Trash2 } from 'lucide-react'

import type {
  AdminAllowanceResetAnchor,
  AdminConfigChange,
  AdminConfigFeatureDefinition,
  AdminConfigFeatureId,
  AdminConfigPlanId,
  AdminCoupon,
  AdminCouponDraft,
  AdminCouponScopeOption,
  AdminCouponStatus,
  AdminCouponType,
  AdminCreditEconomicsConfig,
  AdminDoneForYouPackageConfig,
  AdminDoneForYouPackageId,
  AdminMarketplacePricingConfig,
  AdminOnboardingSurveyConfig,
  AdminPlanConfig,
  AdminReferralProgramConfig,
  AdminSurveyQuestionType,
  AdminTrialConfig,
  AdminUnsubscribedAllowanceConfig,
} from '@/contracts/admin-configuration.draft'
import type { AdminNavItem, AdminNotification, AdminSearchResult } from '@/contracts/admin.draft'
import type { UserIdentity } from '@/contracts/identity'
import {
  Badge,
  Button,
  cn,
  DataTable,
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
  EmptyState,
  formatUsd,
  SelectField,
  Skeleton,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextField,
  type BadgeVariant,
  type DataTableColumn,
} from '@/ui'

import { AdminShell } from './admin-shell'

export type AdminConfigurationTab = 'pricing' | 'coupons' | 'trials'

export type AdminConfigurationViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly tab: AdminConfigurationTab
  readonly onTabChange?: (tab: AdminConfigurationTab) => void
  readonly plans: readonly AdminPlanConfig[]
  readonly featureDefinitions: readonly AdminConfigFeatureDefinition[]
  readonly creditEconomics: AdminCreditEconomicsConfig
  readonly doneForYouPackages: readonly AdminDoneForYouPackageConfig[]
  readonly marketplacePricing: AdminMarketplacePricingConfig
  readonly unsubscribedAllowance: AdminUnsubscribedAllowanceConfig
  readonly coupons: readonly AdminCoupon[]
  readonly couponScopeOptions: readonly AdminCouponScopeOption[]
  readonly trial: AdminTrialConfig
  readonly survey: AdminOnboardingSurveyConfig
  readonly referral: AdminReferralProgramConfig
  /** Today as a `YYYY-MM-DD` calendar string. Decides whether a new coupon starts active or scheduled. */
  readonly today: string
  readonly isLoading?: boolean
  readonly onSavePricing?: (changes: readonly AdminConfigChange[]) => void
  readonly onSaveTrials?: (changes: readonly AdminConfigChange[]) => void
  readonly onCreateCoupon?: (draft: AdminCouponDraft) => void
  readonly onDeactivateCoupon?: (couponId: string) => void
  readonly onSaveReferral?: (changes: readonly AdminConfigChange[]) => void
}

const numberFormatter = new Intl.NumberFormat('en-US')
const moneyPattern = /^\d{1,7}(\.\d{1,2})?$/
const wholePattern = /^\d{1,9}$/
const codePattern = /^[A-Z0-9]+$/
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function centsToInput(cents: number): string {
  const value = (cents / 100).toFixed(2)
  return value.endsWith('.00') ? value.slice(0, -3) : value
}

function parseCents(value: string): number | null {
  const trimmed = value.trim().replace(/^\$/, '')
  if (!moneyPattern.test(trimmed)) return null
  const [whole, fraction = ''] = trimmed.split('.')
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
}

function parseWhole(value: string): number | null {
  const trimmed = value.trim()
  if (!wholePattern.test(trimmed)) return null
  return Number(trimmed)
}

function moneyLabel(value: string): string {
  const cents = parseCents(value)
  return cents === null ? value.trim() || 'blank' : formatUsd(cents)
}

function countLabel(value: string): string {
  const parsed = parseWhole(value)
  return parsed === null ? value.trim() || 'blank' : numberFormatter.format(parsed)
}

function onOffLabel(enabled: boolean): string {
  return enabled ? 'On' : 'Off'
}

function formatCalendarDate(value: string): string {
  const parts = value.split('-')
  if (parts.length !== 3) return value
  const month = monthNames[Number(parts[1]) - 1]
  if (!month) return value
  return `${month} ${Number(parts[2])}, ${parts[0]}`
}

function shortPrompt(prompt: string): string {
  const trimmed = prompt.trim()
  if (!trimmed) return 'Untitled question'
  return trimmed.length > 32 ? `${trimmed.slice(0, 31)}…` : trimmed
}

const resetAnchorLabels: Record<AdminAllowanceResetAnchor, string> = {
  'rolling-30-day': 'Rolling 30 days from the last reset',
  'calendar-month': 'First of the calendar month',
}

const questionTypeLabels: Record<AdminSurveyQuestionType, string> = {
  'single-select': 'Single select',
  'multi-select': 'Multi select',
  'free-text': 'Free text',
}

const couponTypeLabels: Record<AdminCouponType, string> = {
  'percent-off': 'Percent off',
  'fixed-amount-off': 'Fixed amount off',
  'trial-extension': 'Free trial extension',
}

const couponStatusLabels: Record<AdminCouponStatus, string> = {
  active: 'Active',
  scheduled: 'Scheduled',
  expired: 'Expired',
  capped: 'Capped',
  deactivated: 'Deactivated',
}

const couponStatusVariants: Record<AdminCouponStatus, BadgeVariant> = {
  active: 'positive',
  scheduled: 'info',
  expired: 'neutral',
  capped: 'warning',
  deactivated: 'danger',
}

function couponValueLabel(coupon: AdminCoupon): string {
  if (coupon.type === 'percent-off') return `${coupon.value}% off`
  if (coupon.type === 'fixed-amount-off') return `${formatUsd(coupon.value)} off`
  return `${coupon.value} extra ${coupon.value === 1 ? 'day' : 'days'}`
}

/* ------------------------------------------------------------------ shared pieces */

type ConfigFieldProps = {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly onChange: (value: string) => void
  readonly hint?: string
  readonly error?: string
  readonly type?: 'text' | 'date'
  readonly inputMode?: 'decimal' | 'numeric' | 'text'
  readonly min?: string
  readonly placeholder?: string
}

function ConfigField({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  type = 'text',
  inputMode = 'decimal',
  min,
  placeholder,
}: ConfigFieldProps) {
  const hintId = `${id}-hint`
  const describedBy = hint ? (error ? `${hintId} ${id}-error` : hintId) : undefined

  return (
    <div className="grid gap-1.5">
      <TextField
        id={id}
        label={label}
        value={value}
        error={error}
        type={type}
        min={min}
        placeholder={placeholder}
        inputMode={type === 'date' ? undefined : inputMode}
        autoComplete="off"
        spellCheck={false}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? (
        <p id={hintId} className="text-xs leading-5 text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function SectionPanel({
  id,
  title,
  description,
  children,
  action,
}: {
  readonly id: string
  readonly title: string
  readonly description?: string
  readonly children: ReactNode
  readonly action?: ReactNode
}) {
  return (
    <section aria-labelledby={id} className="bg-surface p-4 shadow-panel sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 id={id} className="font-gowun text-lg font-bold text-ink">
            {title}
          </h3>
          {description ? <p className="mt-1 max-w-prose text-sm leading-6 text-ink-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function ImpactNote({ children }: { readonly children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-soft border border-warning/40 bg-warning-surface p-3 text-sm leading-6 text-warning">
      <AlertTriangle aria-hidden="true" className="mt-1 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  )
}

function ChangeReviewDialog({
  open,
  onOpenChange,
  title,
  description,
  impact,
  changes,
  confirmLabel,
  onConfirm,
}: {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly title: string
  readonly description: string
  readonly impact: string
  readonly changes: readonly AdminConfigChange[]
  readonly confirmLabel: string
  readonly onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup aria-label={title} className="sm:max-w-2xl">
        <DialogClose aria-label="Close review without applying" />
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse text-sm">
            <caption className="sr-only">Every edited field, its current value, and the value that will replace it</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2 pe-3 text-start text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Field
                </th>
                <th scope="col" className="py-2 pe-3 text-start text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Current
                </th>
                <th scope="col" className="py-2 text-start text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  New
                </th>
              </tr>
            </thead>
            <tbody>
              {changes.map((change) => (
                <tr key={change.id} className="border-b border-border align-top last:border-b-0">
                  <th scope="row" className="py-2.5 pe-3 text-start font-medium text-ink">
                    <span className="block">{change.field}</span>
                    <span className="mt-0.5 block text-xs font-normal text-ink-muted">{change.section}</span>
                  </th>
                  <td className="py-2.5 pe-3 text-ink-muted line-through">{change.before}</td>
                  <td className="py-2.5 font-semibold text-ink">{change.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <ImpactNote>{impact}</ImpactNote>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="secondary" size="lg" onClick={() => onOpenChange(false)}>
            Keep editing
          </Button>
          <Button size="lg" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </DialogPopup>
    </Dialog>
  )
}

function ConfigActionBar({
  changeCount,
  errorCount,
  savedMessage,
  reviewLabel,
  onDiscard,
}: {
  readonly changeCount: number
  readonly errorCount: number
  readonly savedMessage: string | null
  readonly reviewLabel: string
  readonly onDiscard: () => void
}) {
  const dirty = changeCount > 0

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-subtle p-3 sm:p-4">
      <p aria-live="polite" className="min-w-0 text-sm leading-6 text-ink">
        {dirty ? (
          <>
            <span className="font-semibold">
              {changeCount} unsaved {changeCount === 1 ? 'change' : 'changes'}
            </span>
            <span className="text-ink-muted"> · nothing is live until you review and apply</span>
          </>
        ) : savedMessage ? (
          <span className="inline-flex items-center gap-2 font-semibold text-positive">
            <Check aria-hidden="true" className="size-4 shrink-0" />
            {savedMessage}
          </span>
        ) : (
          <span className="text-ink-muted">No unsaved changes.</span>
        )}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="secondary" size="md" onClick={onDiscard} disabled={!dirty}>
          Discard
        </Button>
        <Button type="submit" size="md" disabled={!dirty}>
          {reviewLabel}
        </Button>
      </div>
      {errorCount > 0 ? (
        <p role="alert" className="w-full text-sm font-semibold leading-6 text-danger">
          {errorCount} {errorCount === 1 ? 'field needs' : 'fields need'} fixing before these changes can be reviewed. Each one is
          marked below.
        </p>
      ) : null}
    </div>
  )
}

function FeatureToggleList({
  idPrefix,
  contextLabel,
  definitions,
  toggles,
  onToggle,
}: {
  readonly idPrefix: string
  readonly contextLabel: string
  readonly definitions: readonly AdminConfigFeatureDefinition[]
  readonly toggles: readonly FeatureToggle[]
  readonly onToggle: (featureId: AdminConfigFeatureId, enabled: boolean) => void
}) {
  return (
    <div className="grid gap-3">
      {definitions.map((definition) => {
        const toggle = toggles.find((item) => item.id === definition.id)
        const enabled = toggle?.enabled ?? false
        return (
          <div key={`${idPrefix}-${definition.id}`} className="grid gap-1">
            <Switch
              label={definition.label}
              aria-label={`${definition.label}, ${contextLabel}`}
              checked={enabled}
              onCheckedChange={(next) => onToggle(definition.id, next)}
            />
            <p className="ps-14 text-xs leading-5 text-ink-muted">{definition.detail}</p>
          </div>
        )
      })}
    </div>
  )
}

type FeatureToggle = { readonly id: AdminConfigFeatureId; readonly enabled: boolean }

function toFeatureToggles(
  definitions: readonly AdminConfigFeatureDefinition[],
  record: Readonly<Record<AdminConfigFeatureId, boolean>>,
): readonly FeatureToggle[] {
  return definitions.map((definition) => ({ id: definition.id, enabled: record[definition.id] }))
}

function setFeatureToggle(
  toggles: readonly FeatureToggle[],
  featureId: AdminConfigFeatureId,
  enabled: boolean,
): readonly FeatureToggle[] {
  return toggles.map((toggle) => (toggle.id === featureId ? { ...toggle, enabled } : toggle))
}

/* ------------------------------------------------------------------ pricing tab */

type PlanForm = {
  readonly id: AdminConfigPlanId
  readonly name: string
  readonly positioning: string
  readonly subscriberCount: number
  readonly monthlyPrice: string
  readonly annualPrice: string
  readonly monthlyCredits: string
  readonly knowledgeBaseDocumentLimit: string
  readonly features: readonly FeatureToggle[]
  readonly introOfferLabel: string | null
  readonly introOfferEnabled: boolean
  readonly introFirstMonthPrice: string
}

type PackageForm = {
  readonly id: AdminDoneForYouPackageId
  readonly name: string
  readonly price: string
  readonly jobCount: string
  readonly accessMonths: string
  readonly inCheckoutCart: boolean
}

type PricingForm = {
  readonly plans: readonly PlanForm[]
  readonly copilotRate: string
  readonly topUpPrice: string
  readonly topUpMinimum: string
  readonly packages: readonly PackageForm[]
  readonly marketplaceMin: string
  readonly marketplaceMax: string
}

function buildPricingForm(
  plans: readonly AdminPlanConfig[],
  definitions: readonly AdminConfigFeatureDefinition[],
  economics: AdminCreditEconomicsConfig,
  packages: readonly AdminDoneForYouPackageConfig[],
  marketplace: AdminMarketplacePricingConfig,
): PricingForm {
  return {
    plans: plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      positioning: plan.positioning,
      subscriberCount: plan.subscriberCount,
      monthlyPrice: centsToInput(plan.monthlyPriceCents),
      annualPrice: centsToInput(plan.annualPriceCents),
      monthlyCredits: String(plan.monthlyCredits),
      knowledgeBaseDocumentLimit: String(plan.knowledgeBaseDocumentLimit),
      features: toFeatureToggles(definitions, plan.features),
      introOfferLabel: plan.introOffer ? plan.introOffer.label : null,
      introOfferEnabled: plan.introOffer ? plan.introOffer.enabled : false,
      introFirstMonthPrice: plan.introOffer ? centsToInput(plan.introOffer.firstMonthPriceCents) : '',
    })),
    copilotRate: centsToInput(economics.copilotRateCents),
    topUpPrice: centsToInput(economics.topUpPriceCents),
    topUpMinimum: centsToInput(economics.topUpMinimumCents),
    packages: packages.map((item) => ({
      id: item.id,
      name: item.name,
      price: centsToInput(item.priceCents),
      jobCount: String(item.jobCount),
      accessMonths: String(item.includedAccessMonths),
      inCheckoutCart: item.inCheckoutCart,
    })),
    marketplaceMin: centsToInput(marketplace.minPriceCents),
    marketplaceMax: centsToInput(marketplace.maxPriceCents),
  }
}

function validatePricing(form: PricingForm): Readonly<Record<string, string>> {
  const errors: Record<string, string> = {}

  for (const plan of form.plans) {
    const monthly = parseCents(plan.monthlyPrice)
    if (monthly === null || monthly <= 0) {
      errors[`${plan.id}-monthly`] = 'Enter a price above $0.00, using at most two decimals, for example 47 or 47.50.'
    }
    const annual = parseCents(plan.annualPrice)
    if (annual === null || annual <= 0) {
      errors[`${plan.id}-annual`] = 'Enter a price above $0.00, using at most two decimals.'
    } else if (monthly !== null && monthly > 0 && annual >= monthly * 12) {
      errors[`${plan.id}-annual`] = `Annual has to undercut 12 months of monthly (${formatUsd(monthly * 12)}) or nobody has a reason to pay yearly.`
    }
    const credits = parseWhole(plan.monthlyCredits)
    if (credits === null || credits < 1) {
      errors[`${plan.id}-credits`] = 'Enter a whole number of credits, at least 1. One credit is one minute of Copilot.'
    }
    const documents = parseWhole(plan.knowledgeBaseDocumentLimit)
    if (documents === null || documents < 1 || documents > 100) {
      errors[`${plan.id}-documents`] = 'Enter a whole number between 1 and 100 documents.'
    }
    if (plan.introOfferLabel !== null && plan.introOfferEnabled) {
      const intro = parseCents(plan.introFirstMonthPrice)
      if (intro === null || intro <= 0) {
        errors[`${plan.id}-intro`] = 'Enter a first month price above $0.00, or switch the offer off.'
      } else if (monthly !== null && intro >= monthly) {
        errors[`${plan.id}-intro`] = `The first month has to be below the renewal price (${formatUsd(monthly)}) or it is not an offer.`
      }
    }
  }

  const copilotRate = parseCents(form.copilotRate)
  if (copilotRate === null || copilotRate <= 0) {
    errors['copilot-rate'] = 'Enter a rate above $0.00, for example 0.10.'
  }
  const topUpPrice = parseCents(form.topUpPrice)
  if (topUpPrice === null || topUpPrice <= 0) {
    errors['top-up-price'] = 'Enter a price above $0.00, for example 0.40.'
  }
  const topUpMinimum = parseCents(form.topUpMinimum)
  if (topUpMinimum === null || topUpMinimum <= 0) {
    errors['top-up-minimum'] = 'Enter a minimum above $0.00, for example 10.'
  } else if (topUpPrice !== null && topUpPrice > 0 && topUpMinimum % topUpPrice !== 0) {
    errors['top-up-minimum'] = `The minimum has to buy a whole number of credits. At ${formatUsd(topUpPrice)} each, try ${formatUsd(Math.ceil(topUpMinimum / topUpPrice) * topUpPrice)}.`
  }

  let smallPrice: number | null = null
  for (const item of form.packages) {
    const price = parseCents(item.price)
    if (price === null || price <= 0) {
      errors[`${item.id}-price`] = 'Enter a price above $0.00.'
    }
    if (item.id === 'dfy-small') smallPrice = price
    if (item.id === 'dfy-large' && price !== null && smallPrice !== null && price <= smallPrice) {
      errors[`${item.id}-price`] = `The 100 job package has to cost more than the 50 job package (${formatUsd(smallPrice)}).`
    }
    const jobs = parseWhole(item.jobCount)
    if (jobs === null || jobs < 1) {
      errors[`${item.id}-jobs`] = 'Enter a whole number of jobs, at least 1.'
    }
    const months = parseWhole(item.accessMonths)
    if (months === null || months < 1 || months > 24) {
      errors[`${item.id}-months`] = 'Enter a whole number of months between 1 and 24.'
    }
  }

  const marketplaceMin = parseCents(form.marketplaceMin)
  if (marketplaceMin === null || marketplaceMin <= 0) {
    errors['marketplace-min'] = 'Enter a price above $0.00.'
  }
  const marketplaceMax = parseCents(form.marketplaceMax)
  if (marketplaceMax === null || marketplaceMax <= 0) {
    errors['marketplace-max'] = 'Enter a price above $0.00.'
  } else if (marketplaceMin !== null && marketplaceMax <= marketplaceMin) {
    errors['marketplace-max'] = `The ceiling has to sit above the floor (${formatUsd(marketplaceMin)}).`
  }

  return errors
}

function pricingChanges(
  baseline: PricingForm,
  form: PricingForm,
  definitions: readonly AdminConfigFeatureDefinition[],
): readonly AdminConfigChange[] {
  const changes: AdminConfigChange[] = []

  function push(id: string, section: string, field: string, before: string, after: string) {
    if (before !== after) changes.push({ id, section, field, before, after })
  }

  for (const plan of form.plans) {
    const base = baseline.plans.find((item) => item.id === plan.id)
    if (!base) continue
    const section = `${plan.name} plan`
    push(`${plan.id}-monthly`, section, 'Monthly price', moneyLabel(base.monthlyPrice), moneyLabel(plan.monthlyPrice))
    push(`${plan.id}-annual`, section, 'Annual price', moneyLabel(base.annualPrice), moneyLabel(plan.annualPrice))
    push(
      `${plan.id}-credits`,
      section,
      'Monthly credit allowance',
      `${countLabel(base.monthlyCredits)} credits`,
      `${countLabel(plan.monthlyCredits)} credits`,
    )
    push(
      `${plan.id}-documents`,
      section,
      'Knowledge Base documents',
      countLabel(base.knowledgeBaseDocumentLimit),
      countLabel(plan.knowledgeBaseDocumentLimit),
    )
    if (plan.introOfferLabel !== null) {
      push(`${plan.id}-intro-enabled`, section, plan.introOfferLabel, onOffLabel(base.introOfferEnabled), onOffLabel(plan.introOfferEnabled))
      push(
        `${plan.id}-intro-price`,
        section,
        'First month price',
        moneyLabel(base.introFirstMonthPrice),
        moneyLabel(plan.introFirstMonthPrice),
      )
    }
    for (const definition of definitions) {
      const beforeToggle = base.features.find((item) => item.id === definition.id)?.enabled ?? false
      const afterToggle = plan.features.find((item) => item.id === definition.id)?.enabled ?? false
      push(`${plan.id}-${definition.id}`, section, definition.label, onOffLabel(beforeToggle), onOffLabel(afterToggle))
    }
  }

  push('copilot-rate', 'Credit economics', 'Copilot rate per credit-minute', moneyLabel(baseline.copilotRate), moneyLabel(form.copilotRate))
  push('top-up-price', 'Credit economics', 'Top-up price per credit', moneyLabel(baseline.topUpPrice), moneyLabel(form.topUpPrice))
  push('top-up-minimum', 'Credit economics', 'Minimum top-up purchase', moneyLabel(baseline.topUpMinimum), moneyLabel(form.topUpMinimum))

  for (const item of form.packages) {
    const base = baseline.packages.find((entry) => entry.id === item.id)
    if (!base) continue
    push(`${item.id}-price`, item.name, 'Package price', moneyLabel(base.price), moneyLabel(item.price))
    push(`${item.id}-jobs`, item.name, 'Jobs included', countLabel(base.jobCount), countLabel(item.jobCount))
    push(
      `${item.id}-months`,
      item.name,
      'Bundled product access',
      `${countLabel(base.accessMonths)} months`,
      `${countLabel(item.accessMonths)} months`,
    )
    push(`${item.id}-cart`, item.name, 'Offered in the checkout cart', onOffLabel(base.inCheckoutCart), onOffLabel(item.inCheckoutCart))
  }

  push('marketplace-min', 'Marketplace', 'Lowest item price', moneyLabel(baseline.marketplaceMin), moneyLabel(form.marketplaceMin))
  push('marketplace-max', 'Marketplace', 'Highest item price', moneyLabel(baseline.marketplaceMax), moneyLabel(form.marketplaceMax))

  return changes
}

function PricingTab({
  plans,
  featureDefinitions,
  creditEconomics,
  doneForYouPackages,
  marketplacePricing,
  unsubscribedAllowance,
  onSavePricing,
  onEditAllowance,
}: {
  readonly plans: readonly AdminPlanConfig[]
  readonly featureDefinitions: readonly AdminConfigFeatureDefinition[]
  readonly creditEconomics: AdminCreditEconomicsConfig
  readonly doneForYouPackages: readonly AdminDoneForYouPackageConfig[]
  readonly marketplacePricing: AdminMarketplacePricingConfig
  readonly unsubscribedAllowance: AdminUnsubscribedAllowanceConfig
  readonly onSavePricing?: (changes: readonly AdminConfigChange[]) => void
  readonly onEditAllowance: () => void
}) {
  const initial = useMemo(
    () => buildPricingForm(plans, featureDefinitions, creditEconomics, doneForYouPackages, marketplacePricing),
    [plans, featureDefinitions, creditEconomics, doneForYouPackages, marketplacePricing],
  )
  const [baseline, setBaseline] = useState<PricingForm>(initial)
  const [form, setForm] = useState<PricingForm>(initial)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const [blocked, setBlocked] = useState(false)

  const errors = useMemo(() => validatePricing(form), [form])
  const errorCount = Object.keys(errors).length
  const changes = useMemo(() => pricingChanges(baseline, form, featureDefinitions), [baseline, form, featureDefinitions])

  function updatePlan(planId: AdminConfigPlanId, patch: Partial<PlanForm>) {
    setSavedMessage(null)
    setForm((prev) => ({ ...prev, plans: prev.plans.map((plan) => (plan.id === planId ? { ...plan, ...patch } : plan)) }))
  }

  function updatePackage(packageId: AdminDoneForYouPackageId, patch: Partial<PackageForm>) {
    setSavedMessage(null)
    setForm((prev) => ({ ...prev, packages: prev.packages.map((item) => (item.id === packageId ? { ...item, ...patch } : item)) }))
  }

  function updateForm(patch: Partial<PricingForm>) {
    setSavedMessage(null)
    setForm((prev) => ({ ...prev, ...patch }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (errorCount > 0) {
      setBlocked(true)
      return
    }
    setBlocked(false)
    setReviewOpen(true)
  }

  function handleConfirm() {
    setBaseline(form)
    setReviewOpen(false)
    setSavedMessage(`${changes.length} pricing ${changes.length === 1 ? 'change is' : 'changes are'} live for new and renewing subscribers.`)
    onSavePricing?.(changes)
  }

  const copilotRateCents = parseCents(form.copilotRate)
  const topUpPriceCents = parseCents(form.topUpPrice)
  const topUpMinimumCents = parseCents(form.topUpMinimum)

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="grid gap-5">
        <ConfigActionBar
          changeCount={changes.length}
          errorCount={blocked ? errorCount : 0}
          savedMessage={savedMessage}
          reviewLabel="Review changes"
          onDiscard={() => {
            setForm(baseline)
            setBlocked(false)
            setSavedMessage(null)
          }}
        />

        <section aria-labelledby="plans-heading" className="grid gap-4">
          <div>
            <h2 id="plans-heading" className="text-lg font-bold text-ink">
              Ace Your Interview plans
            </h2>
            <p className="mt-1 max-w-prose text-sm leading-6 text-ink-muted">
              The only recurring subscription Jobwhisper sells. Every field here is charged to live accounts on their next renewal.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {form.plans.map((plan) => (
              <section
                key={plan.id}
                aria-labelledby={`${plan.id}-heading`}
                className="grid content-start gap-4 bg-surface p-4 shadow-panel sm:p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 id={`${plan.id}-heading`} className="font-gowun text-lg font-bold text-ink">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-ink-muted">{numberFormatter.format(plan.subscriberCount)} live subscribers</p>
                </div>
                <p className="text-sm leading-6 text-ink-muted">{plan.positioning}</p>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <ConfigField
                    id={`${plan.id}-monthly`}
                    label="Monthly price, USD"
                    value={plan.monthlyPrice}
                    error={errors[`${plan.id}-monthly`]}
                    onChange={(value) => updatePlan(plan.id, { monthlyPrice: value })}
                  />
                  <ConfigField
                    id={`${plan.id}-annual`}
                    label="Annual price, USD"
                    value={plan.annualPrice}
                    error={errors[`${plan.id}-annual`]}
                    hint={
                      parseCents(plan.monthlyPrice) !== null && parseCents(plan.annualPrice) !== null
                        ? `Saves ${formatUsd(Math.max(0, (parseCents(plan.monthlyPrice) ?? 0) * 12 - (parseCents(plan.annualPrice) ?? 0)))} against paying monthly.`
                        : undefined
                    }
                    onChange={(value) => updatePlan(plan.id, { annualPrice: value })}
                  />
                  <ConfigField
                    id={`${plan.id}-credits`}
                    label="Monthly credits"
                    inputMode="numeric"
                    value={plan.monthlyCredits}
                    error={errors[`${plan.id}-credits`]}
                    hint={
                      parseWhole(plan.monthlyCredits) !== null && copilotRateCents !== null
                        ? `About ${countLabel(plan.monthlyCredits)} minutes of Copilot, worth ${formatUsd((parseWhole(plan.monthlyCredits) ?? 0) * copilotRateCents)} at the current rate.`
                        : undefined
                    }
                    onChange={(value) => updatePlan(plan.id, { monthlyCredits: value })}
                  />
                  <ConfigField
                    id={`${plan.id}-documents`}
                    label="Knowledge Base documents"
                    inputMode="numeric"
                    value={plan.knowledgeBaseDocumentLimit}
                    error={errors[`${plan.id}-documents`]}
                    hint="A flat ceiling on stored documents. Not metered against credits."
                    onChange={(value) => updatePlan(plan.id, { knowledgeBaseDocumentLimit: value })}
                  />
                </div>

                {plan.introOfferLabel !== null ? (
                  <div className="grid gap-3 rounded-soft border border-accent/30 bg-accent-subtle p-3">
                    <Switch
                      label={plan.introOfferLabel}
                      aria-label={`${plan.introOfferLabel}, ${plan.name} plan`}
                      checked={plan.introOfferEnabled}
                      onCheckedChange={(next) => updatePlan(plan.id, { introOfferEnabled: next })}
                    />
                    <ConfigField
                      id={`${plan.id}-intro`}
                      label="First month price, USD"
                      value={plan.introFirstMonthPrice}
                      error={errors[`${plan.id}-intro`]}
                      hint={`Charged once, then renews at ${moneyLabel(plan.monthlyPrice)} every month.`}
                      onChange={(value) => updatePlan(plan.id, { introFirstMonthPrice: value })}
                    />
                    {!plan.introOfferEnabled ? (
                      <p className="text-xs leading-5 text-ink-muted">
                        Switched off. New subscribers pay {moneyLabel(plan.monthlyPrice)} from the first month.
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <fieldset className="border-t border-border pt-4">
                  <legend className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Included capabilities</legend>
                  <div className="mt-3">
                    <FeatureToggleList
                      idPrefix={plan.id}
                      contextLabel={`${plan.name} plan`}
                      definitions={featureDefinitions}
                      toggles={plan.features}
                      onToggle={(featureId, enabled) =>
                        updatePlan(plan.id, { features: setFeatureToggle(plan.features, featureId, enabled) })
                      }
                    />
                  </div>
                </fieldset>
              </section>
            ))}
          </div>
        </section>

        <SectionPanel
          id="credit-economics-heading"
          title="Credit economics"
          description="One credit is one minute of Copilot. The rate below sets what that minute is worth; the top-up price is what a subscriber pays to buy more mid-cycle."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <ConfigField
              id="copilot-rate"
              label="Copilot rate per credit-minute, USD"
              value={form.copilotRate}
              error={errors['copilot-rate']}
              hint={
                copilotRateCents !== null
                  ? `Starter's ${countLabel(form.plans[0]?.monthlyCredits ?? '0')} credits are worth ${formatUsd((parseWhole(form.plans[0]?.monthlyCredits ?? '0') ?? 0) * copilotRateCents)} of Copilot time.`
                  : undefined
              }
              onChange={(value) => updateForm({ copilotRate: value })}
            />
            <ConfigField
              id="top-up-price"
              label="Top-up price per credit, USD"
              value={form.topUpPrice}
              error={errors['top-up-price']}
              hint="What a subscriber pays for extra credits when the monthly allowance runs out."
              onChange={(value) => updateForm({ topUpPrice: value })}
            />
            <ConfigField
              id="top-up-minimum"
              label="Minimum top-up purchase, USD"
              value={form.topUpMinimum}
              error={errors['top-up-minimum']}
              hint={
                topUpMinimumCents !== null && topUpPriceCents !== null && topUpPriceCents > 0 && topUpMinimumCents % topUpPriceCents === 0
                  ? `${formatUsd(topUpMinimumCents)} buys ${numberFormatter.format(topUpMinimumCents / topUpPriceCents)} credits. A hard floor, not a suggestion.`
                  : 'A hard floor, not a suggestion. The amount has to convert to a whole number of credits.'
              }
              onChange={(value) => updateForm({ topUpMinimum: value })}
            />
          </div>
        </SectionPanel>

        <SectionPanel
          id="packages-heading"
          title="Done For You packages and Marketplace"
          description="One-time purchases. Neither needs a subscription, and neither draws on the monthly credit allowance."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {form.packages.map((item) => (
              <section
                key={item.id}
                aria-labelledby={`${item.id}-heading`}
                className="grid gap-4 rounded-soft border border-border bg-surface-subtle p-4"
              >
                <h4 id={`${item.id}-heading`} className="text-sm font-bold text-ink">
                  {item.name}
                </h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <ConfigField
                    id={`${item.id}-price`}
                    label="Price, USD"
                    value={item.price}
                    error={errors[`${item.id}-price`]}
                    onChange={(value) => updatePackage(item.id, { price: value })}
                  />
                  <ConfigField
                    id={`${item.id}-jobs`}
                    label="Jobs included"
                    inputMode="numeric"
                    value={item.jobCount}
                    error={errors[`${item.id}-jobs`]}
                    onChange={(value) => updatePackage(item.id, { jobCount: value })}
                  />
                  <ConfigField
                    id={`${item.id}-months`}
                    label="Months of product access"
                    inputMode="numeric"
                    value={item.accessMonths}
                    error={errors[`${item.id}-months`]}
                    onChange={(value) => updatePackage(item.id, { accessMonths: value })}
                  />
                </div>
                <Switch
                  label="Offer in the checkout cart"
                  aria-label={`Offer ${item.name} in the checkout cart`}
                  checked={item.inCheckoutCart}
                  onCheckedChange={(next) => updatePackage(item.id, { inCheckoutCart: next })}
                />
                {item.id === 'dfy-large' && item.inCheckoutCart ? (
                  <ImpactNote>
                    The two packages are tiers of the same offer, not additive purchases. With both in the cart a buyer can select the 50
                    job and the 100 job package together. Sell the 100 job package through the nurture flow instead.
                  </ImpactNote>
                ) : null}
              </section>
            ))}
          </div>

          <div className="mt-4 grid gap-4 rounded-soft border border-border bg-surface-subtle p-4 sm:grid-cols-2">
            <ConfigField
              id="marketplace-min"
              label="Marketplace floor price, USD"
              value={form.marketplaceMin}
              error={errors['marketplace-min']}
              hint={`${marketplacePricing.itemCount} items are currently priced inside this band.`}
              onChange={(value) => updateForm({ marketplaceMin: value })}
            />
            <ConfigField
              id="marketplace-max"
              label="Marketplace ceiling price, USD"
              value={form.marketplaceMax}
              error={errors['marketplace-max']}
              hint="Swipe files, templates and scripts. One-time, no subscription attached."
              onChange={(value) => updateForm({ marketplaceMax: value })}
            />
          </div>
        </SectionPanel>
      </form>

      <SectionPanel
        id="unsubscribed-heading"
        title="Unsubscribed allowance"
        description="What an account gets before it subscribes to anything."
        action={
          <Button type="button" variant="secondary" size="md" onClick={onEditAllowance}>
            Edit in Trials and onboarding
          </Button>
        }
      >
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-soft border border-border bg-surface-subtle p-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Free allowance</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">
              {numberFormatter.format(unsubscribedAllowance.freeMinutes)} minutes
            </dd>
          </div>
          <div className="rounded-soft border border-border bg-surface-subtle p-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Reset anchor</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">{resetAnchorLabels[unsubscribedAllowance.resetAnchor]}</dd>
          </div>
        </dl>
        <p className="mt-3 max-w-prose text-sm leading-6 text-ink-muted">
          Fifty minutes is roughly one interview session, so the balance refills{' '}
          {unsubscribedAllowance.resetPeriodDays} days after it was last reset rather than waiting for a calendar boundary.
        </p>
        <div className="mt-3">
          <ImpactNote>
            This is a default state, not a fourth tier. It is deliberately never rendered as a Free plan card: no row in the pricing
            table, no card beside Starter, Pro and Premium. Adding one turns the default into something we are seen to be selling.
          </ImpactNote>
        </div>
      </SectionPanel>

      <ChangeReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        title="Review pricing changes"
        description="Check every line before this reaches live accounts."
        impact="Applying this changes what live subscribers are charged at their next renewal, and what every pricing surface shows from now on."
        changes={changes}
        confirmLabel="Apply to live pricing"
        onConfirm={handleConfirm}
      />
    </>
  )
}

/* ------------------------------------------------------------------ coupons tab */

type CouponFormState = {
  readonly code: string
  readonly type: AdminCouponType
  readonly value: string
  readonly scopeId: string
  readonly redemptionCap: string
  readonly startsOn: string
  readonly expiresOn: string
  readonly note: string
}

const emptyCouponForm: CouponFormState = {
  code: '',
  type: 'percent-off',
  value: '',
  scopeId: 'everything',
  redemptionCap: '',
  startsOn: '',
  expiresOn: '',
  note: '',
}

function validateCoupon(
  form: CouponFormState,
  existingCodes: ReadonlySet<string>,
  today: string,
): Readonly<Record<string, string>> {
  const errors: Record<string, string> = {}
  const code = form.code.trim()

  if (!code) {
    errors.code = 'Enter a code. This is the string a customer types at checkout.'
  } else if (!codePattern.test(code)) {
    errors.code = 'Use uppercase letters and digits only, with no spaces or dashes, for example SPRING25.'
  } else if (code.length < 4 || code.length > 24) {
    errors.code = 'Use between 4 and 24 characters so it stays readable on a checkout page.'
  } else if (existingCodes.has(code)) {
    errors.code = `${code} is already in use. Pick a different code.`
  }

  if (form.type === 'percent-off') {
    const percent = parseWhole(form.value)
    if (percent === null || percent < 1 || percent > 100) {
      errors.value = 'Enter a whole percent between 1 and 100.'
    }
  } else if (form.type === 'fixed-amount-off') {
    const amount = parseCents(form.value)
    if (amount === null || amount < 1 || amount > 50_000) {
      errors.value = 'Enter an amount between $0.01 and $500.00, using at most two decimals.'
    }
  } else {
    const days = parseWhole(form.value)
    if (days === null || days < 1 || days > 90) {
      errors.value = 'Enter a whole number of extra trial days between 1 and 90.'
    }
  }

  const cap = parseWhole(form.redemptionCap)
  if (cap === null || cap < 1) {
    errors.redemptionCap = 'Enter a cap above zero. A code with no ceiling cannot be budgeted for.'
  } else if (cap > 1_000_000) {
    errors.redemptionCap = 'Enter a cap of 1,000,000 or fewer redemptions.'
  }

  if (!form.startsOn) {
    errors.startsOn = 'Choose the day the code starts working.'
  } else if (form.startsOn < today) {
    errors.startsOn = 'Choose today or a later date. A code cannot start in the past.'
  }

  if (form.expiresOn && form.startsOn && form.expiresOn <= form.startsOn) {
    errors.expiresOn = 'Choose a date after the start date, or leave this empty for a code with no end date.'
  }

  return errors
}

function CreateCouponDialog({
  open,
  onOpenChange,
  scopeOptions,
  existingCodes,
  today,
  onCreate,
}: {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly scopeOptions: readonly AdminCouponScopeOption[]
  readonly existingCodes: ReadonlySet<string>
  readonly today: string
  readonly onCreate: (form: CouponFormState) => void
}) {
  const [form, setForm] = useState<CouponFormState>(emptyCouponForm)
  const [blocked, setBlocked] = useState(false)

  const errors = useMemo(() => validateCoupon(form, existingCodes, today), [form, existingCodes, today])
  const errorCount = Object.keys(errors).length

  function update(patch: Partial<CouponFormState>) {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (errorCount > 0) {
      setBlocked(true)
      return
    }
    onCreate(form)
    setForm(emptyCouponForm)
    setBlocked(false)
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setForm(emptyCouponForm)
      setBlocked(false)
    }
    onOpenChange(next)
  }

  const valueLabel =
    form.type === 'percent-off' ? 'Percent off' : form.type === 'fixed-amount-off' ? 'Amount off, USD' : 'Extra trial days'
  const valueHint =
    form.type === 'percent-off'
      ? 'A whole percent from 1 to 100.'
      : form.type === 'fixed-amount-off'
        ? 'Taken off the first charge only.'
        : 'Added on top of the standard trial length.'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPopup aria-label="Create a coupon" className="sm:max-w-xl">
        <DialogClose aria-label="Close without creating a coupon" />
        <DialogTitle>Create a coupon</DialogTitle>
        <DialogDescription>The code goes live the day it starts and stops the moment it hits its cap.</DialogDescription>

        <form onSubmit={handleSubmit} noValidate className="mt-4 grid gap-4">
          {blocked && errorCount > 0 ? (
            <p role="alert" className="rounded-soft border border-danger/40 bg-danger-surface p-3 text-sm font-semibold leading-6 text-danger">
              {errorCount} {errorCount === 1 ? 'field needs' : 'fields need'} fixing before this coupon can be created. Each one is
              marked below.
            </p>
          ) : null}

          <ConfigField
            id="coupon-code"
            label="Code"
            inputMode="text"
            placeholder="SPRING25"
            value={form.code}
            error={errors.code}
            hint="Uppercase letters and digits, 4 to 24 characters."
            onChange={(value) => update({ code: value.toUpperCase() })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              id="coupon-type"
              label="Type"
              value={form.type}
              options={[
                { value: 'percent-off', label: couponTypeLabels['percent-off'] },
                { value: 'fixed-amount-off', label: couponTypeLabels['fixed-amount-off'] },
                { value: 'trial-extension', label: couponTypeLabels['trial-extension'] },
              ]}
              onValueChange={(value) => {
                const next: AdminCouponType =
                  value === 'fixed-amount-off' ? 'fixed-amount-off' : value === 'trial-extension' ? 'trial-extension' : 'percent-off'
                update({ type: next, value: '' })
              }}
            />
            <ConfigField
              id="coupon-value"
              label={valueLabel}
              inputMode={form.type === 'fixed-amount-off' ? 'decimal' : 'numeric'}
              value={form.value}
              error={errors.value}
              hint={valueHint}
              onChange={(value) => update({ value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              id="coupon-scope"
              label="Applies to"
              value={form.scopeId}
              options={scopeOptions.map((option) => ({ value: option.id, label: option.label }))}
              onValueChange={(value) => update({ scopeId: value })}
            />
            <ConfigField
              id="coupon-cap"
              label="Redemption cap"
              inputMode="numeric"
              value={form.redemptionCap}
              error={errors.redemptionCap}
              hint="The code stops working once this many customers have used it."
              onChange={(value) => update({ redemptionCap: value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ConfigField
              id="coupon-starts"
              label="Starts on"
              type="date"
              min={today}
              value={form.startsOn}
              error={errors.startsOn}
              onChange={(value) => update({ startsOn: value })}
            />
            <ConfigField
              id="coupon-expires"
              label="Expires on"
              type="date"
              min={form.startsOn || today}
              value={form.expiresOn}
              error={errors.expiresOn}
              hint="Leave empty for a code with no end date."
              onChange={(value) => update({ expiresOn: value })}
            />
          </div>

          <ConfigField
            id="coupon-note"
            label="Internal note"
            inputMode="text"
            placeholder="Where this code is being handed out"
            value={form.note}
            hint="Only ever shown in the admin console."
            onChange={(value) => update({ note: value })}
          />

          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="secondary" size="lg" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="lg">
              Create coupon
            </Button>
          </div>
        </form>
      </DialogPopup>
    </Dialog>
  )
}

const couponFilters: readonly (AdminCouponStatus | 'all')[] = [
  'all',
  'active',
  'scheduled',
  'capped',
  'expired',
  'deactivated',
]

function CouponsTab({
  coupons,
  couponScopeOptions,
  today,
  authorName,
  onCreateCoupon,
  onDeactivateCoupon,
}: {
  readonly coupons: readonly AdminCoupon[]
  readonly couponScopeOptions: readonly AdminCouponScopeOption[]
  readonly today: string
  readonly authorName: string
  readonly onCreateCoupon?: (draft: AdminCouponDraft) => void
  readonly onDeactivateCoupon?: (couponId: string) => void
}) {
  const [createOpen, setCreateOpen] = useState(false)
  const [deactivateId, setDeactivateId] = useState<string | null>(null)
  const [deactivatedIds, setDeactivatedIds] = useState<ReadonlySet<string>>(() => new Set())
  const [createdCoupons, setCreatedCoupons] = useState<readonly AdminCoupon[]>([])
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<AdminCouponStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const allCoupons = useMemo<readonly AdminCoupon[]>(
    () =>
      [...createdCoupons, ...coupons].map((coupon) =>
        deactivatedIds.has(coupon.id) ? { ...coupon, status: 'deactivated' as const } : coupon,
      ),
    [coupons, createdCoupons, deactivatedIds],
  )

  const existingCodes = useMemo(() => new Set(allCoupons.map((coupon) => coupon.code)), [allCoupons])
  const visibleCoupons = useMemo(
    () => (statusFilter === 'all' ? allCoupons : allCoupons.filter((coupon) => coupon.status === statusFilter)),
    [allCoupons, statusFilter],
  )
  const deactivateTarget = allCoupons.find((coupon) => coupon.id === deactivateId) ?? null

  function handleCreate(form: CouponFormState) {
    const scope = couponScopeOptions.find((option) => option.id === form.scopeId) ?? couponScopeOptions[0]
    const numericValue =
      form.type === 'fixed-amount-off' ? (parseCents(form.value) ?? 0) : (parseWhole(form.value) ?? 0)
    const created: AdminCoupon = {
      id: `coupon-new-${form.code}`,
      code: form.code.trim(),
      type: form.type,
      value: numericValue,
      scopeId: scope?.id ?? 'everything',
      scopeLabel: scope?.label ?? 'Everything',
      redemptions: 0,
      redemptionCap: parseWhole(form.redemptionCap) ?? 0,
      startsOn: formatCalendarDate(form.startsOn),
      expiresOn: form.expiresOn ? formatCalendarDate(form.expiresOn) : 'No end date',
      status: form.startsOn <= today ? 'active' : 'scheduled',
      createdBy: authorName,
      note: form.note.trim() || 'Created from the admin console.',
    }
    setCreatedCoupons((prev) => [created, ...prev])
    setCreateOpen(false)
    setStatusFilter('all')
    setStatusMessage(
      created.status === 'active'
        ? `${created.code} is live now, capped at ${numberFormatter.format(created.redemptionCap)} redemptions.`
        : `${created.code} is scheduled to start on ${created.startsOn}.`,
    )
    onCreateCoupon?.({
      code: created.code,
      type: form.type,
      value: form.value,
      scopeId: form.scopeId,
      redemptionCap: form.redemptionCap,
      startsOn: form.startsOn,
      expiresOn: form.expiresOn,
      note: form.note,
    })
  }

  function handleDeactivate() {
    if (!deactivateTarget) return
    const id = deactivateTarget.id
    setDeactivatedIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setStatusMessage(`${deactivateTarget.code} is deactivated. New checkouts will reject it from now on.`)
    setDeactivateId(null)
    onDeactivateCoupon?.(id)
  }

  const columns: readonly DataTableColumn<AdminCoupon>[] = [
    {
      key: 'code',
      label: 'Code',
      sortable: false,
      className: 'w-56 font-semibold text-ink',
      render: (row) => <span className="block truncate">{row.code}</span>,
    },
    {
      key: 'type',
      label: 'Type',
      sortable: false,
      className: 'w-44',
      render: (row) => couponTypeLabels[row.type],
    },
    {
      key: 'value',
      label: 'Value',
      sortable: false,
      className: 'w-32 tabular-nums',
      render: (row) => couponValueLabel(row),
    },
    {
      key: 'scope',
      label: 'Applies to',
      sortable: false,
      className: 'w-48',
      render: (row) => row.scopeLabel,
    },
    {
      key: 'redemptions',
      label: 'Redemptions',
      sortable: false,
      className: 'w-36 tabular-nums',
      render: (row) => (
        <span>
          {numberFormatter.format(row.redemptions)} of {numberFormatter.format(row.redemptionCap)}
        </span>
      ),
    },
    {
      key: 'startsOn',
      label: 'Starts',
      sortable: false,
      className: 'w-32',
      render: (row) => row.startsOn,
    },
    {
      key: 'expiresOn',
      label: 'Expires',
      sortable: false,
      className: 'w-32',
      render: (row) => row.expiresOn,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      className: 'w-32',
      render: (row) => (
        <Badge size="sm" variant={couponStatusVariants[row.status]}>
          {couponStatusLabels[row.status]}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      className: 'w-32',
      hideInMobileDetail: true,
      render: (row) =>
        row.status === 'deactivated' ? (
          <span className="text-xs text-ink-muted">Deactivated</span>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            leadingIcon={<Ban aria-hidden="true" />}
            onClick={() => setDeactivateId(row.id)}
          >
            <span className="sr-only">Deactivate </span>
            Deactivate
            <span className="sr-only"> {row.code}</span>
          </Button>
        ),
    },
  ]

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-ink">Coupons and promotions</h2>
          <p className="mt-1 max-w-prose text-sm leading-6 text-ink-muted">
            Every code that can reduce a charge, across plans, prepaid credits, packages and the marketplace.
          </p>
        </div>
        <Button type="button" size="md" leadingIcon={<Plus aria-hidden="true" />} onClick={() => setCreateOpen(true)}>
          Create coupon
        </Button>
      </div>

      {statusMessage ? (
        <p
          role="status"
          className="flex items-start gap-2 border border-positive/30 bg-positive-surface p-3 text-sm font-semibold leading-6 text-positive"
        >
          <Check aria-hidden="true" className="mt-1 size-4 shrink-0" />
          <span>{statusMessage}</span>
        </p>
      ) : null}

      {allCoupons.length === 0 ? (
        <div className="bg-surface shadow-panel">
          <EmptyState
            icon={<TicketPercent aria-hidden="true" />}
            title="No coupons yet"
            description="Nothing can discount a charge right now. Create a code when a campaign, partnership or support case needs one."
            action={
              <Button type="button" size="lg" leadingIcon={<Plus aria-hidden="true" />} onClick={() => setCreateOpen(true)}>
                Create the first coupon
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter coupons by status">
            {couponFilters.map((filter) => {
              const count = filter === 'all' ? allCoupons.length : allCoupons.filter((coupon) => coupon.status === filter).length
              const label = filter === 'all' ? 'All' : couponStatusLabels[filter]
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  aria-pressed={filter === statusFilter}
                  className={cn(
                    'inline-flex min-h-11 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none',
                    filter === statusFilter
                      ? 'border-accent bg-accent-subtle text-accent-text'
                      : 'border-border bg-surface text-ink-muted hover:bg-surface-subtle hover:text-ink',
                  )}
                >
                  {label}
                  <span className="tabular-nums text-xs text-ink-muted">{numberFormatter.format(count)}</span>
                </button>
              )
            })}
          </div>

          <div className="bg-surface p-4 shadow-panel sm:p-5">
            <DataTable
              bare
              selectable={false}
              minTableWidthClassName="min-w-[72rem]"
              searchLabel="Search coupons by code, scope or note"
              searchPlaceholder="Search coupons"
              searchValue={search}
              onSearchChange={setSearch}
              columns={columns}
              rows={visibleCoupons}
              itemLabel={(row) => row.code}
              filterRow={(row, query) =>
                `${row.code} ${row.scopeLabel} ${row.note} ${couponTypeLabels[row.type]}`.toLowerCase().includes(query.toLowerCase())
              }
              rowActions={(row) =>
                row.status === 'deactivated' ? (
                  <span className="text-sm text-ink-muted">Already deactivated</span>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    leadingIcon={<Ban aria-hidden="true" />}
                    onClick={() => setDeactivateId(row.id)}
                  >
                    Deactivate {row.code}
                  </Button>
                )
              }
            />
          </div>
        </>
      )}

      <CreateCouponDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        scopeOptions={couponScopeOptions}
        existingCodes={existingCodes}
        today={today}
        onCreate={handleCreate}
      />

      <Dialog open={deactivateTarget !== null} onOpenChange={(open) => (open ? undefined : setDeactivateId(null))}>
        <DialogPopup aria-label="Deactivate coupon">
          <DialogClose aria-label="Close without deactivating" />
          <DialogTitle>Deactivate {deactivateTarget?.code}?</DialogTitle>
          <DialogDescription>
            The code stops working at checkout immediately. Subscriptions that already redeemed it keep their discounted price, so
            this does not claw anything back.
          </DialogDescription>
          {deactivateTarget ? (
            <dl className="mt-4 grid gap-2 rounded-soft border border-border bg-surface-subtle p-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Discount</dt>
                <dd className="font-medium text-ink">{couponValueLabel(deactivateTarget)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Applies to</dt>
                <dd className="font-medium text-ink">{deactivateTarget.scopeLabel}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Redemptions so far</dt>
                <dd className="font-medium text-ink">
                  {numberFormatter.format(deactivateTarget.redemptions)} of {numberFormatter.format(deactivateTarget.redemptionCap)}
                </dd>
              </div>
            </dl>
          ) : null}
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <Button type="button" variant="secondary" size="lg" onClick={() => setDeactivateId(null)}>
              Keep it active
            </Button>
            <Button type="button" variant="danger" size="lg" onClick={handleDeactivate}>
              Deactivate code
            </Button>
          </div>
        </DialogPopup>
      </Dialog>
    </div>
  )
}

/* ------------------------------------------------------------------ referral program section */

type ReferralForm = {
  readonly rewardCreditsPerReferral: string
  readonly maxReferralsPerAccount: string
  readonly rewardExpiryDays: string
}

function buildReferralForm(config: AdminReferralProgramConfig): ReferralForm {
  return {
    rewardCreditsPerReferral: String(config.rewardCreditsPerReferral),
    maxReferralsPerAccount: String(config.maxReferralsPerAccount),
    rewardExpiryDays: String(config.rewardExpiryDays),
  }
}

function validateReferral(form: ReferralForm): Readonly<Record<string, string>> {
  const errors: Record<string, string> = {}
  const credits = parseWhole(form.rewardCreditsPerReferral)
  if (credits === null || credits < 1 || credits > 50_000) {
    errors['referral-credits'] = 'Enter a whole number of credits between 1 and 50,000.'
  }
  const cap = parseWhole(form.maxReferralsPerAccount)
  if (cap === null || cap < 1 || cap > 1_000) {
    errors['referral-cap'] = 'Enter a whole number between 1 and 1,000 referrals.'
  }
  const expiry = parseWhole(form.rewardExpiryDays)
  if (expiry === null || expiry < 1 || expiry > 365) {
    errors['referral-expiry'] = 'Enter a whole number of days between 1 and 365.'
  }
  return errors
}

function referralChanges(baseline: ReferralForm, form: ReferralForm): readonly AdminConfigChange[] {
  const changes: AdminConfigChange[] = []
  function push(id: string, field: string, before: string, after: string) {
    if (before !== after) changes.push({ id, section: 'Referral program', field, before, after })
  }
  push(
    'referral-credits',
    'Reward per referral',
    `${countLabel(baseline.rewardCreditsPerReferral)} credits`,
    `${countLabel(form.rewardCreditsPerReferral)} credits`,
  )
  push(
    'referral-cap',
    'Max referrals per account',
    countLabel(baseline.maxReferralsPerAccount),
    countLabel(form.maxReferralsPerAccount),
  )
  push(
    'referral-expiry',
    'Reward expiry window',
    `${countLabel(baseline.rewardExpiryDays)} days`,
    `${countLabel(form.rewardExpiryDays)} days`,
  )
  return changes
}

function ReferralProgramSection({
  config,
  onSave,
}: {
  readonly config: AdminReferralProgramConfig
  readonly onSave?: (changes: readonly AdminConfigChange[]) => void
}) {
  const initial = useMemo(() => buildReferralForm(config), [config])
  const [baseline, setBaseline] = useState<ReferralForm>(initial)
  const [form, setForm] = useState<ReferralForm>(initial)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const [blocked, setBlocked] = useState(false)

  const errors = useMemo(() => validateReferral(form), [form])
  const errorCount = Object.keys(errors).length
  const changes = useMemo(() => referralChanges(baseline, form), [baseline, form])

  function updateForm(patch: Partial<ReferralForm>) {
    setSavedMessage(null)
    setForm((prev) => ({ ...prev, ...patch }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (errorCount > 0) {
      setBlocked(true)
      return
    }
    setBlocked(false)
    setReviewOpen(true)
  }

  function handleConfirm() {
    setBaseline(form)
    setReviewOpen(false)
    setSavedMessage(`${changes.length} referral ${changes.length === 1 ? 'setting is' : 'settings are'} live.`)
    onSave?.(changes)
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <SectionPanel
          id="referral-heading"
          title="Referral program"
          description="What a referrer earns when their invitee subscribes. Configuration rules only — referral performance and payout analytics live in the Analytics module."
        >
          <ConfigActionBar
            changeCount={changes.length}
            errorCount={blocked ? errorCount : 0}
            savedMessage={savedMessage}
            reviewLabel="Review changes"
            onDiscard={() => {
              setForm(baseline)
              setBlocked(false)
              setSavedMessage(null)
            }}
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <ConfigField
              id="referral-credits"
              label="Reward per referral, credits"
              inputMode="numeric"
              value={form.rewardCreditsPerReferral}
              error={errors['referral-credits']}
              hint="Credits added to the referrer's balance when their invitee subscribes."
              onChange={(value) => updateForm({ rewardCreditsPerReferral: value })}
            />
            <ConfigField
              id="referral-cap"
              label="Max referrals per account"
              inputMode="numeric"
              value={form.maxReferralsPerAccount}
              error={errors['referral-cap']}
              hint="A hard ceiling on how many referral rewards one account can earn."
              onChange={(value) => updateForm({ maxReferralsPerAccount: value })}
            />
            <ConfigField
              id="referral-expiry"
              label="Reward expiry window, days"
              inputMode="numeric"
              value={form.rewardExpiryDays}
              error={errors['referral-expiry']}
              hint="A pending referral reward expires after this many days if not claimed."
              onChange={(value) => updateForm({ rewardExpiryDays: value })}
            />
          </div>
        </SectionPanel>
      </form>

      <ChangeReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        title="Review referral program changes"
        description="Check every line before this reaches live referral behaviour."
        impact="Applying this changes what referrers earn and how many referrals they can make from now on."
        changes={changes}
        confirmLabel="Apply referral settings"
        onConfirm={handleConfirm}
      />
    </>
  )
}

/* ------------------------------------------------------------------ trials tab */

type QuestionForm = {
  readonly id: string
  readonly prompt: string
  readonly helpText: string
  readonly type: AdminSurveyQuestionType
  readonly required: boolean
  readonly options: readonly { readonly id: string; readonly label: string }[]
}

type TrialsForm = {
  readonly trialEnabled: boolean
  readonly lengthDays: string
  readonly mirrorsPlanId: AdminConfigPlanId
  readonly includedCredits: string
  readonly knowledgeBaseDocumentLimit: string
  readonly requiresPaymentMethod: boolean
  readonly features: readonly FeatureToggle[]
  readonly freeMinutes: string
  readonly resetAnchor: AdminAllowanceResetAnchor
  readonly questions: readonly QuestionForm[]
}

function buildTrialsForm(
  trial: AdminTrialConfig,
  definitions: readonly AdminConfigFeatureDefinition[],
  allowance: AdminUnsubscribedAllowanceConfig,
  survey: AdminOnboardingSurveyConfig,
): TrialsForm {
  return {
    trialEnabled: trial.enabled,
    lengthDays: String(trial.lengthDays),
    mirrorsPlanId: trial.mirrorsPlanId,
    includedCredits: String(trial.includedCredits),
    knowledgeBaseDocumentLimit: String(trial.knowledgeBaseDocumentLimit),
    requiresPaymentMethod: trial.requiresPaymentMethod,
    features: toFeatureToggles(definitions, trial.features),
    freeMinutes: String(allowance.freeMinutes),
    resetAnchor: allowance.resetAnchor,
    questions: survey.questions.map((question) => ({
      id: question.id,
      prompt: question.prompt,
      helpText: question.helpText,
      type: question.type,
      required: question.required,
      options: question.options.map((option) => ({ id: option.id, label: option.label })),
    })),
  }
}

function validateTrials(form: TrialsForm): Readonly<Record<string, string>> {
  const errors: Record<string, string> = {}

  const length = parseWhole(form.lengthDays)
  if (length === null || length < 1 || length > 90) {
    errors['trial-length'] = 'Enter a whole number of days between 1 and 90.'
  }
  const credits = parseWhole(form.includedCredits)
  if (credits === null || credits < 1 || credits > 10_000) {
    errors['trial-credits'] = 'Enter a whole number of credits between 1 and 10,000.'
  }
  const documents = parseWhole(form.knowledgeBaseDocumentLimit)
  if (documents === null || documents < 1 || documents > 100) {
    errors['trial-documents'] = 'Enter a whole number between 1 and 100 documents.'
  }
  const minutes = parseWhole(form.freeMinutes)
  if (minutes === null || minutes < 1 || minutes > 1_000) {
    errors['allowance-minutes'] = 'Enter a whole number of minutes between 1 and 1,000.'
  }

  for (const question of form.questions) {
    if (!question.prompt.trim()) {
      errors[`${question.id}-prompt`] = 'Write the question a candidate will actually read.'
    }
    if (question.type !== 'free-text') {
      const filled = question.options.filter((option) => option.label.trim().length > 0)
      if (filled.length < 2) {
        errors[`${question.id}-options`] = 'A choice question needs at least two answer options. Add another or switch it to free text.'
      }
      const seen = new Set<string>()
      for (const option of question.options) {
        const label = option.label.trim()
        if (!label) {
          errors[`${option.id}-label`] = 'Give this option a label, or remove it.'
        } else if (seen.has(label.toLowerCase())) {
          errors[`${option.id}-label`] = 'Two options say the same thing. Make this one different.'
        } else {
          seen.add(label.toLowerCase())
        }
      }
    }
  }

  return errors
}

function optionsSummary(question: QuestionForm): string {
  if (question.type === 'free-text') return 'No options'
  const labels = question.options.map((option) => option.label.trim()).filter((label) => label.length > 0)
  return labels.length > 0 ? labels.join(', ') : 'No options'
}

function trialsChanges(
  baseline: TrialsForm,
  form: TrialsForm,
  definitions: readonly AdminConfigFeatureDefinition[],
  planNames: Readonly<Record<AdminConfigPlanId, string>>,
): readonly AdminConfigChange[] {
  const changes: AdminConfigChange[] = []

  function push(id: string, section: string, field: string, before: string, after: string) {
    if (before !== after) changes.push({ id, section, field, before, after })
  }

  push('trial-enabled', 'Free trial', 'Trial offered', onOffLabel(baseline.trialEnabled), onOffLabel(form.trialEnabled))
  push('trial-length', 'Free trial', 'Trial length', `${countLabel(baseline.lengthDays)} days`, `${countLabel(form.lengthDays)} days`)
  push('trial-plan', 'Free trial', 'Mirrors plan', planNames[baseline.mirrorsPlanId], planNames[form.mirrorsPlanId])
  push(
    'trial-credits',
    'Free trial',
    'Credits included',
    `${countLabel(baseline.includedCredits)} credits`,
    `${countLabel(form.includedCredits)} credits`,
  )
  push(
    'trial-documents',
    'Free trial',
    'Knowledge Base documents',
    countLabel(baseline.knowledgeBaseDocumentLimit),
    countLabel(form.knowledgeBaseDocumentLimit),
  )
  push(
    'trial-card',
    'Free trial',
    'Card required to start',
    onOffLabel(baseline.requiresPaymentMethod),
    onOffLabel(form.requiresPaymentMethod),
  )
  for (const definition of definitions) {
    const before = baseline.features.find((item) => item.id === definition.id)?.enabled ?? false
    const after = form.features.find((item) => item.id === definition.id)?.enabled ?? false
    push(`trial-${definition.id}`, 'Free trial', definition.label, onOffLabel(before), onOffLabel(after))
  }

  push(
    'allowance-minutes',
    'Unsubscribed allowance',
    'Free minutes',
    `${countLabel(baseline.freeMinutes)} minutes`,
    `${countLabel(form.freeMinutes)} minutes`,
  )
  push(
    'allowance-anchor',
    'Unsubscribed allowance',
    'Reset anchor',
    resetAnchorLabels[baseline.resetAnchor],
    resetAnchorLabels[form.resetAnchor],
  )

  const baselineIds = new Set(baseline.questions.map((question) => question.id))
  const formIds = new Set(form.questions.map((question) => question.id))

  for (const question of baseline.questions) {
    if (!formIds.has(question.id)) {
      push(`${question.id}-removed`, 'Onboarding survey', 'Question removed', shortPrompt(question.prompt), 'Removed')
    }
  }
  for (const question of form.questions) {
    if (!baselineIds.has(question.id)) {
      push(`${question.id}-added`, 'Onboarding survey', 'Question added', 'Not present', shortPrompt(question.prompt))
      continue
    }
    const base = baseline.questions.find((item) => item.id === question.id)
    if (!base) continue
    const section = `Survey question: ${shortPrompt(base.prompt)}`
    push(`${question.id}-prompt`, section, 'Question text', base.prompt, question.prompt)
    push(`${question.id}-help`, section, 'Helper text', base.helpText || 'None', question.helpText || 'None')
    push(`${question.id}-type`, section, 'Answer type', questionTypeLabels[base.type], questionTypeLabels[question.type])
    push(`${question.id}-required`, section, 'Required', onOffLabel(base.required), onOffLabel(question.required))
    push(`${question.id}-options`, section, 'Answer options', optionsSummary(base), optionsSummary(question))
  }

  const sharedBaselineOrder = baseline.questions.filter((question) => formIds.has(question.id)).map((question) => question.id)
  const sharedFormOrder = form.questions.filter((question) => baselineIds.has(question.id)).map((question) => question.id)
  if (sharedBaselineOrder.join('|') !== sharedFormOrder.join('|')) {
    const label = (ids: readonly string[], source: readonly QuestionForm[]) =>
      ids
        .map((id, index) => `${index + 1}. ${shortPrompt(source.find((question) => question.id === id)?.prompt ?? '')}`)
        .join(' · ')
    push(
      'survey-order',
      'Onboarding survey',
      'Question order',
      label(sharedBaselineOrder, baseline.questions),
      label(sharedFormOrder, form.questions),
    )
  }

  return changes
}

function SurveyPreview({ title, introduction, questions }: {
  readonly title: string
  readonly introduction: string
  readonly questions: readonly QuestionForm[]
}) {
  return (
    <div className="rounded-soft border border-border bg-canvas p-4">
      <h4 className="font-gowun text-lg font-bold text-ink">{title}</h4>
      <p className="mt-1 text-sm leading-6 text-ink-muted">{introduction}</p>
      {questions.length === 0 ? (
        <p className="mt-4 rounded-soft border border-dashed border-input p-4 text-sm text-ink-muted">
          No questions yet, so the onboarding step is skipped and new accounts land straight on the dashboard.
        </p>
      ) : (
        <ol className="mt-4 grid gap-5">
          {questions.map((question, index) => {
            const legendId = `preview-${question.id}-legend`
            const prompt = question.prompt.trim() || 'Untitled question'
            const options = question.options.filter((option) => option.label.trim().length > 0)
            return (
              <li key={question.id}>
                {question.type === 'free-text' ? (
                  <div className="grid gap-2">
                    <label htmlFor={`preview-${question.id}-input`} className="text-sm font-semibold text-ink">
                      {index + 1}. {prompt}
                      {question.required ? (
                        <>
                          <span aria-hidden="true" className="ms-1 text-danger">
                            *
                          </span>
                          <span className="sr-only"> (required)</span>
                        </>
                      ) : null}
                    </label>
                    {question.helpText.trim() ? <p className="text-xs leading-5 text-ink-muted">{question.helpText}</p> : null}
                    <textarea
                      id={`preview-${question.id}-input`}
                      disabled
                      rows={2}
                      placeholder="Type an answer"
                      className="w-full resize-none rounded-lg border border-input bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted disabled:opacity-70"
                    />
                  </div>
                ) : (
                  <fieldset aria-describedby={question.helpText.trim() ? `preview-${question.id}-help` : undefined}>
                    <legend id={legendId} className="text-sm font-semibold text-ink">
                      {index + 1}. {prompt}
                      {question.required ? (
                        <>
                          <span aria-hidden="true" className="ms-1 text-danger">
                            *
                          </span>
                          <span className="sr-only"> (required)</span>
                        </>
                      ) : null}
                    </legend>
                    {question.helpText.trim() ? (
                      <p id={`preview-${question.id}-help`} className="mt-1 text-xs leading-5 text-ink-muted">
                        {question.helpText}
                      </p>
                    ) : null}
                    <div className="mt-2 grid gap-2">
                      {options.length === 0 ? (
                        <p className="text-sm text-ink-muted">No options yet, so nothing renders here.</p>
                      ) : (
                        options.map((option) => (
                          <label
                            key={option.id}
                            className="flex min-h-11 items-center gap-3 rounded-lg border border-input bg-surface px-3 text-sm text-ink"
                          >
                            <input
                              type={question.type === 'single-select' ? 'radio' : 'checkbox'}
                              name={`preview-${question.id}`}
                              disabled
                              className="size-4 shrink-0 border-input text-accent"
                            />
                            {option.label}
                          </label>
                        ))
                      )}
                    </div>
                  </fieldset>
                )}
              </li>
            )
          })}
        </ol>
      )}
      <p className="mt-4 text-xs text-ink-muted">Preview only. The controls above are not interactive.</p>
    </div>
  )
}

function TrialsTab({
  trial,
  featureDefinitions,
  unsubscribedAllowance,
  survey,
  plans,
  referral,
  onSaveTrials,
  onSaveReferral,
}: {
  readonly trial: AdminTrialConfig
  readonly featureDefinitions: readonly AdminConfigFeatureDefinition[]
  readonly unsubscribedAllowance: AdminUnsubscribedAllowanceConfig
  readonly survey: AdminOnboardingSurveyConfig
  readonly plans: readonly AdminPlanConfig[]
  readonly referral: AdminReferralProgramConfig
  readonly onSaveTrials?: (changes: readonly AdminConfigChange[]) => void
  readonly onSaveReferral?: (changes: readonly AdminConfigChange[]) => void
}) {
  const initial = useMemo(
    () => buildTrialsForm(trial, featureDefinitions, unsubscribedAllowance, survey),
    [trial, featureDefinitions, unsubscribedAllowance, survey],
  )
  const [baseline, setBaseline] = useState<TrialsForm>(initial)
  const [form, setForm] = useState<TrialsForm>(initial)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const [blocked, setBlocked] = useState(false)
  const [reorderMessage, setReorderMessage] = useState('')
  const [nextId, setNextId] = useState(1)

  const planNames = useMemo<Readonly<Record<AdminConfigPlanId, string>>>(() => {
    const starter = plans.find((plan) => plan.id === 'starter')?.name ?? 'Starter'
    const pro = plans.find((plan) => plan.id === 'pro')?.name ?? 'Pro'
    const premium = plans.find((plan) => plan.id === 'premium')?.name ?? 'Premium'
    return { starter, pro, premium }
  }, [plans])

  const errors = useMemo(() => validateTrials(form), [form])
  const errorCount = Object.keys(errors).length
  const changes = useMemo(
    () => trialsChanges(baseline, form, featureDefinitions, planNames),
    [baseline, form, featureDefinitions, planNames],
  )

  function updateForm(patch: Partial<TrialsForm>) {
    setSavedMessage(null)
    setForm((prev) => ({ ...prev, ...patch }))
  }

  function updateQuestion(questionId: string, patch: Partial<QuestionForm>) {
    setSavedMessage(null)
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((question) => (question.id === questionId ? { ...question, ...patch } : question)),
    }))
  }

  function moveQuestion(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= form.questions.length) return
    const reordered = [...form.questions]
    const [moved] = reordered.splice(index, 1)
    if (!moved) return
    reordered.splice(target, 0, moved)
    setSavedMessage(null)
    setForm((prev) => ({ ...prev, questions: reordered }))
    setReorderMessage(`Moved "${shortPrompt(moved.prompt)}" to position ${target + 1} of ${reordered.length}.`)
  }

  function addQuestion() {
    const id = `question-new-${nextId}`
    setNextId((prev) => prev + 1)
    setSavedMessage(null)
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id,
          prompt: '',
          helpText: '',
          type: 'single-select',
          required: false,
          options: [
            { id: `${id}-option-1`, label: '' },
            { id: `${id}-option-2`, label: '' },
          ],
        },
      ],
    }))
    setReorderMessage(`Added a new question at position ${form.questions.length + 1}.`)
  }

  function removeQuestion(questionId: string) {
    const removed = form.questions.find((question) => question.id === questionId)
    setSavedMessage(null)
    setForm((prev) => ({ ...prev, questions: prev.questions.filter((question) => question.id !== questionId) }))
    setReorderMessage(`Removed "${shortPrompt(removed?.prompt ?? '')}" from the survey.`)
  }

  function addOption(question: QuestionForm) {
    updateQuestion(question.id, {
      options: [...question.options, { id: `${question.id}-option-${question.options.length + 1}-${nextId}`, label: '' }],
    })
    setNextId((prev) => prev + 1)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (errorCount > 0) {
      setBlocked(true)
      return
    }
    setBlocked(false)
    setReviewOpen(true)
  }

  function handleConfirm() {
    setBaseline(form)
    setReviewOpen(false)
    setSavedMessage(
      `${changes.length} ${changes.length === 1 ? 'change is' : 'changes are'} live for accounts created from now on.`,
    )
    onSaveTrials?.(changes)
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="grid gap-5">
        <ConfigActionBar
          changeCount={changes.length}
          errorCount={blocked ? errorCount : 0}
          savedMessage={savedMessage}
          reviewLabel="Review changes"
          onDiscard={() => {
            setForm(baseline)
            setBlocked(false)
            setSavedMessage(null)
            setReorderMessage('Reverted every unsaved change.')
          }}
        />

        <SectionPanel
          id="trial-heading"
          title="Free trial"
          description="What a new account gets before the first charge. Turning the trial off sends new signups straight to checkout."
        >
          <div className="grid gap-4">
            <Switch
              label="Offer a free trial at signup"
              aria-label="Offer a free trial at signup"
              checked={form.trialEnabled}
              onCheckedChange={(next) => updateForm({ trialEnabled: next })}
            />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <ConfigField
                id="trial-length"
                label="Trial length, days"
                inputMode="numeric"
                value={form.lengthDays}
                error={errors['trial-length']}
                onChange={(value) => updateForm({ lengthDays: value })}
              />
              <SelectField
                id="trial-plan"
                label="Mirrors plan"
                value={form.mirrorsPlanId}
                options={plans.map((plan) => ({ value: plan.id, label: plan.name }))}
                onValueChange={(value) => {
                  const next: AdminConfigPlanId = value === 'starter' ? 'starter' : value === 'premium' ? 'premium' : 'pro'
                  updateForm({ mirrorsPlanId: next })
                }}
              />
              <ConfigField
                id="trial-credits"
                label="Credits included"
                inputMode="numeric"
                value={form.includedCredits}
                error={errors['trial-credits']}
                hint="One credit is one minute of Copilot."
                onChange={(value) => updateForm({ includedCredits: value })}
              />
              <ConfigField
                id="trial-documents"
                label="Knowledge Base documents"
                inputMode="numeric"
                value={form.knowledgeBaseDocumentLimit}
                error={errors['trial-documents']}
                onChange={(value) => updateForm({ knowledgeBaseDocumentLimit: value })}
              />
            </div>

            <Switch
              label="Require a card before the trial starts"
              aria-label="Require a card before the trial starts"
              checked={form.requiresPaymentMethod}
              onCheckedChange={(next) => updateForm({ requiresPaymentMethod: next })}
            />

            <fieldset className="border-t border-border pt-4">
              <legend className="text-xs font-semibold uppercase tracking-wide text-ink-muted">What the trial includes</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <FeatureToggleList
                  idPrefix="trial"
                  contextLabel="free trial"
                  definitions={featureDefinitions}
                  toggles={form.features}
                  onToggle={(featureId, enabled) => updateForm({ features: setFeatureToggle(form.features, featureId, enabled) })}
                />
              </div>
            </fieldset>
          </div>
        </SectionPanel>

        <SectionPanel
          id="allowance-heading"
          title="Unsubscribed allowance"
          description="The default state of an account with no subscription and no trial running. Never shown to users as a plan."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <ConfigField
              id="allowance-minutes"
              label="Free minutes per period"
              inputMode="numeric"
              value={form.freeMinutes}
              error={errors['allowance-minutes']}
              hint="Roughly one interview session, which is why it refills on use rather than on a calendar boundary."
              onChange={(value) => updateForm({ freeMinutes: value })}
            />
            <fieldset>
              <legend className="text-sm font-medium text-ink">Reset anchor</legend>
              <div className="mt-2 grid gap-2">
                {(['rolling-30-day', 'calendar-month'] as const).map((anchor) => (
                  <label
                    key={anchor}
                    className={cn(
                      'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 text-sm transition-colors duration-normal ease-default focus-within:ring-2 focus-within:ring-focus motion-reduce:transition-none',
                      form.resetAnchor === anchor ? 'border-accent bg-accent-subtle text-accent-text' : 'border-input bg-surface text-ink',
                    )}
                  >
                    <input
                      type="radio"
                      name="allowance-reset-anchor"
                      value={anchor}
                      checked={form.resetAnchor === anchor}
                      onChange={() => updateForm({ resetAnchor: anchor })}
                      className="size-4 shrink-0 border-input text-accent focus:ring-focus"
                    />
                    {resetAnchorLabels[anchor]}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </SectionPanel>

        <SectionPanel
          id="survey-heading"
          title="Onboarding survey"
          description="Asked once, immediately after signup. The answers decide which product surface an account lands on first."
          action={
            <Button type="button" variant="secondary" size="md" leadingIcon={<Plus aria-hidden="true" />} onClick={addQuestion}>
              Add question
            </Button>
          }
        >
          <p role="status" aria-live="polite" className="sr-only">
            {reorderMessage}
          </p>

          {form.questions.length === 0 ? (
            <EmptyState
              title="No questions yet"
              description="With an empty survey the onboarding step is skipped entirely and every new account lands on the same dashboard."
              action={
                <Button type="button" size="lg" leadingIcon={<Plus aria-hidden="true" />} onClick={addQuestion}>
                  Add the first question
                </Button>
              }
            />
          ) : (
            <ol className="grid gap-4">
              {form.questions.map((question, index) => (
                <li key={question.id} className="rounded-soft border border-border bg-surface-subtle p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-ink">
                      Question {index + 1} of {form.questions.length}
                    </h4>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={index === 0}
                        onClick={() => moveQuestion(index, -1)}
                        aria-label={`Move question ${index + 1}, ${shortPrompt(question.prompt)}, up`}
                        className="size-11 px-0"
                      >
                        <ArrowUp aria-hidden="true" className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={index === form.questions.length - 1}
                        onClick={() => moveQuestion(index, 1)}
                        aria-label={`Move question ${index + 1}, ${shortPrompt(question.prompt)}, down`}
                        className="size-11 px-0"
                      >
                        <ArrowDown aria-hidden="true" className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        aria-label={`Remove question ${index + 1}, ${shortPrompt(question.prompt)}`}
                        className="size-11 px-0 text-danger"
                      >
                        <Trash2 aria-hidden="true" className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4">
                    <ConfigField
                      id={`${question.id}-prompt`}
                      label="Question"
                      inputMode="text"
                      value={question.prompt}
                      error={errors[`${question.id}-prompt`]}
                      onChange={(value) => updateQuestion(question.id, { prompt: value })}
                    />
                    <ConfigField
                      id={`${question.id}-help`}
                      label="Helper text, admin facing"
                      inputMode="text"
                      value={question.helpText}
                      hint="Explains what the answer changes. Not shown to the candidate."
                      onChange={(value) => updateQuestion(question.id, { helpText: value })}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <SelectField
                        id={`${question.id}-type`}
                        label="Answer type"
                        value={question.type}
                        options={[
                          { value: 'single-select', label: questionTypeLabels['single-select'] },
                          { value: 'multi-select', label: questionTypeLabels['multi-select'] },
                          { value: 'free-text', label: questionTypeLabels['free-text'] },
                        ]}
                        onValueChange={(value) => {
                          const next: AdminSurveyQuestionType =
                            value === 'multi-select' ? 'multi-select' : value === 'free-text' ? 'free-text' : 'single-select'
                          updateQuestion(question.id, {
                            type: next,
                            options:
                              next === 'free-text'
                                ? []
                                : question.options.length > 0
                                  ? question.options
                                  : [
                                      { id: `${question.id}-option-a`, label: '' },
                                      { id: `${question.id}-option-b`, label: '' },
                                    ],
                          })
                        }}
                      />
                      <div className="flex items-end pb-3">
                        <Switch
                          label="Answer required"
                          aria-label={`Answer required for question ${index + 1}`}
                          checked={question.required}
                          onCheckedChange={(next) => updateQuestion(question.id, { required: next })}
                        />
                      </div>
                    </div>

                    {question.type === 'free-text' ? null : (
                      <fieldset className="border-t border-border pt-4">
                        <legend className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Answer options</legend>
                        {errors[`${question.id}-options`] ? (
                          <p
                            id={`${question.id}-options-error`}
                            role="alert"
                            aria-live="polite"
                            className="mt-2 text-sm text-danger"
                          >
                            {errors[`${question.id}-options`]}
                          </p>
                        ) : null}
                        <ul className="mt-3 grid gap-3">
                          {question.options.map((option, optionIndex) => (
                            <li key={option.id} className="flex items-start gap-2">
                              <div className="min-w-0 flex-1">
                                <ConfigField
                                  id={`${option.id}-label`}
                                  label={`Option ${optionIndex + 1}`}
                                  inputMode="text"
                                  value={option.label}
                                  error={errors[`${option.id}-label`]}
                                  onChange={(value) =>
                                    updateQuestion(question.id, {
                                      options: question.options.map((entry) =>
                                        entry.id === option.id ? { ...entry, label: value } : entry,
                                      ),
                                    })
                                  }
                                />
                              </div>
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="mt-7 size-11 shrink-0 px-0 text-danger"
                                aria-label={`Remove option ${optionIndex + 1} from question ${index + 1}`}
                                onClick={() =>
                                  updateQuestion(question.id, {
                                    options: question.options.filter((entry) => entry.id !== option.id),
                                  })
                                }
                              >
                                <Trash2 aria-hidden="true" className="size-4" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                        <Button
                          type="button"
                          variant="secondary"
                          size="md"
                          className="mt-3"
                          leadingIcon={<Plus aria-hidden="true" />}
                          onClick={() => addOption(question)}
                        >
                          Add option
                        </Button>
                      </fieldset>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </SectionPanel>

        <ReferralProgramSection config={referral} onSave={onSaveReferral} />
      </form>

      <SectionPanel
        id="survey-preview-heading"
        title="Live preview"
        description="The survey exactly as a new account sees it, including the changes you have not applied yet."
      >
        <SurveyPreview title={survey.title} introduction={survey.introduction} questions={form.questions} />
      </SectionPanel>

      <ChangeReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        title="Review trial and onboarding changes"
        description="Check every line before this reaches new signups."
        impact="Applying this changes what every new account is offered at signup, and what the unsubscribed base is allowed to use."
        changes={changes}
        confirmLabel="Apply to new signups"
        onConfirm={handleConfirm}
      />
    </>
  )
}

/* ------------------------------------------------------------------ view */

function ConfigurationSkeleton() {
  return (
    <div className="grid gap-6 p-4 sm:p-6">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-10 w-full max-w-md" />
      <Skeleton className="h-16" />
      <div className="grid gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-[28rem]" />
        ))}
      </div>
      <Skeleton className="h-48" />
      <Skeleton className="h-64" />
    </div>
  )
}

const tabLabels: Record<AdminConfigurationTab, string> = {
  pricing: 'Pricing',
  coupons: 'Coupons and promotions',
  trials: 'Trials and onboarding',
}

export function AdminConfigurationView({
  user,
  navItems,
  notifications,
  searchResults,
  tab,
  onTabChange,
  plans,
  featureDefinitions,
  creditEconomics,
  doneForYouPackages,
  marketplacePricing,
  unsubscribedAllowance,
  coupons,
  couponScopeOptions,
  trial,
  survey,
  referral,
  today,
  isLoading = false,
  onSavePricing,
  onSaveTrials,
  onSaveReferral,
  onCreateCoupon,
  onDeactivateCoupon,
}: AdminConfigurationViewProps) {
  function handleTabChange(value: string) {
    if (value === 'pricing' || value === 'coupons' || value === 'trials') onTabChange?.(value)
  }

  return (
    <AdminShell
      user={user}
      navItems={navItems}
      activeModule="configuration"
      notifications={notifications}
      searchResults={searchResults}
    >
      {isLoading ? (
        <ConfigurationSkeleton />
      ) : (
        <div className="grid gap-6 p-4 sm:p-6">
          <div>
            <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">Configuration</h1>
            <p className="mt-1 max-w-prose text-sm leading-6 text-ink-muted">
              What Jobwhisper charges, what discounts exist, and what a new account is given before it pays. Every change here lands
              on live customers, so nothing saves without a review step.
            </p>
          </div>

          <Tabs value={tab} onValueChange={handleTabChange}>
            <TabsList aria-label="Configuration sections">
              {(['pricing', 'coupons', 'trials'] as const).map((id) => (
                <TabsTrigger key={id} value={id} className="min-h-11">
                  {tabLabels[id]}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="pricing">
              <PricingTab
                plans={plans}
                featureDefinitions={featureDefinitions}
                creditEconomics={creditEconomics}
                doneForYouPackages={doneForYouPackages}
                marketplacePricing={marketplacePricing}
                unsubscribedAllowance={unsubscribedAllowance}
                onSavePricing={onSavePricing}
                onEditAllowance={() => onTabChange?.('trials')}
              />
            </TabsContent>

            <TabsContent value="coupons">
              <CouponsTab
                coupons={coupons}
                couponScopeOptions={couponScopeOptions}
                today={today}
                authorName={user.name}
                onCreateCoupon={onCreateCoupon}
                onDeactivateCoupon={onDeactivateCoupon}
              />
            </TabsContent>

            <TabsContent value="trials">
              <TrialsTab
                trial={trial}
                featureDefinitions={featureDefinitions}
                unsubscribedAllowance={unsubscribedAllowance}
                survey={survey}
                plans={plans}
                referral={referral}
                onSaveTrials={onSaveTrials}
                onSaveReferral={onSaveReferral}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </AdminShell>
  )
}
