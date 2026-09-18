import { useState } from 'react'
import { AlertTriangle, ArrowLeft, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react'

import type {
  AdminContentTab,
  AdminDownloadItem,
  AdminFaqItem,
  AdminMarketplaceItem,
  AdminPopupWidget,
  AdminTutorialItem,
  PopupCategory,
} from '@/contracts/admin-content.draft'
import type { AdminMarketplacePricingConfig } from '@/contracts/admin-configuration.draft'
import type { AdminModuleId, AdminNavItem, AdminNotification, AdminSearchResult } from '@/contracts/admin.draft'
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
  SelectField,
  Skeleton,
  TextField,
  FormTextArea,
  type DataTableColumn,
  type BadgeVariant,
} from '@/ui'

import { AdminShell } from './admin-shell'
import { PopupPreview } from './popup-preview'

/* -------------------------------------------------------------------------- */
/* Tab definitions                                                             */
/* -------------------------------------------------------------------------- */

const TABS: readonly { readonly id: AdminContentTab; readonly label: string }[] = [
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'downloads', label: 'Downloads' },
  { id: 'tutorials', label: 'Tutorials' },
  { id: 'faq', label: 'FAQ' },
  { id: 'popups', label: 'Popup Widgets' },
]

const kindLabels: Record<string, string> = {
  video: 'Video',
  external: 'External link',
}

const toneOptions = [
  { value: 'accent', label: 'Accent' },
  { value: 'positive', label: 'Positive' },
  { value: 'accent-secondary', label: 'Accent secondary' },
  { value: 'danger', label: 'Danger' },
]

const platformOptions = [
  { value: 'Application', label: 'Application' },
  { value: 'Browser Extension', label: 'Browser Extension' },
  { value: 'Mobile App', label: 'Mobile App' },
]

const kindOptions = [
  { value: 'video', label: 'Video' },
  { value: 'external', label: 'External link' },
]

/* -------------------------------------------------------------------------- */
/* View props                                                                  */
/* -------------------------------------------------------------------------- */

export type AdminContentViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly tab: AdminContentTab
  readonly onTabChange: (tab: AdminContentTab) => void
  readonly marketplaceItems: readonly AdminMarketplaceItem[]
  /** The price-bound guardrail owned by Configuration → Pricing (`AdminMarketplacePricingConfig`) — read here rather than duplicated, so an admin cannot price a marketplace item outside what Configuration allows. */
  readonly marketplacePricing: AdminMarketplacePricingConfig
  readonly downloadItems: readonly AdminDownloadItem[]
  readonly tutorialItems: readonly AdminTutorialItem[]
  readonly faqItems: readonly AdminFaqItem[]
  readonly popupWidgets: readonly AdminPopupWidget[]
  readonly isLoading?: boolean
  readonly errorMessage?: string
  readonly onRetry?: () => void
}

export function AdminContentView({
  user,
  navItems,
  notifications,
  searchResults,
  tab,
  onTabChange,
  marketplaceItems: initialMarketplace,
  marketplacePricing,
  downloadItems: initialDownloads,
  tutorialItems: initialTutorials,
  faqItems: initialFaq,
  popupWidgets: initialPopups,
  isLoading = false,
  errorMessage,
  onRetry,
}: AdminContentViewProps) {
  const [marketplaceItems, setMarketplaceItems] = useState<readonly AdminMarketplaceItem[]>(initialMarketplace)
  const [downloadItems, setDownloadItems] = useState<readonly AdminDownloadItem[]>(initialDownloads)
  const [tutorialItems, setTutorialItems] = useState<readonly AdminTutorialItem[]>(initialTutorials)
  const [faqItems, setFaqItems] = useState<readonly AdminFaqItem[]>(initialFaq)
  const [popupWidgets, setPopupWidgets] = useState<readonly AdminPopupWidget[]>(initialPopups)

  /* ---------- shared dialog state ---------- */
  const [deleteTarget, setDeleteTarget] = useState<{ readonly kind: string; readonly id: string; readonly label: string } | null>(null)

  /* ---------- marketplace state ---------- */
  const [mpDialogOpen, setMpDialogOpen] = useState(false)
  const [mpEditing, setMpEditing] = useState<AdminMarketplaceItem | null>(null)
  const [mpForm, setMpForm] = useState({ name: '', priceDollars: '', description: '', assetFileName: '' })
  const [mpTouched, setMpTouched] = useState(false)

  /* ---------- downloads state ---------- */
  const [dlDialogOpen, setDlDialogOpen] = useState(false)
  const [dlEditing, setDlEditing] = useState<AdminDownloadItem | null>(null)
  const [dlForm, setDlForm] = useState({ title: '', platform: 'Application', extension: '', support: '', href: '' })
  const [dlTouched, setDlTouched] = useState(false)

  /* ---------- tutorials state ---------- */
  const [tuDialogOpen, setTuDialogOpen] = useState(false)
  const [tuEditing, setTuEditing] = useState<AdminTutorialItem | null>(null)
  const [tuForm, setTuForm] = useState({ title: '', href: '', kind: 'video' as 'video' | 'external', tone: 'accent' as AdminTutorialItem['tone'], category: '' })
  const [tuTouched, setTuTouched] = useState(false)

  /* ---------- FAQ state ---------- */
  const [faqDialogOpen, setFaqDialogOpen] = useState(false)
  const [faqEditing, setFaqEditing] = useState<AdminFaqItem | null>(null)
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' })
  const [faqTouched, setFaqTouched] = useState(false)

  /* ---------- Popup widgets state ---------- */
  const [popupDialogOpen, setPopupDialogOpen] = useState(false)
  const [popupEditing, setPopupEditing] = useState<AdminPopupWidget | null>(null)
  const [popupForm, setPopupForm] = useState({
    name: '',
    displayType: 'modal' as AdminPopupWidget['displayType'],
    active: true,
    headline: '',
    subHeadline: '',
    title: '',
    body: '',
    ctaLabel: '',
    ctaUrl: '',
    price: 0,
    discount: 0,
    offerList: [''] as string[],
    timerEnabled: false,
    timerExpiry: '',
    mediaUrl: '',
    mediaType: 'image' as 'image' | 'video',
    tag: '',
  })
  const [popupTouched, setPopupTouched] = useState(false)

  /* ======================================================================== */
  /* Marketplace tab                                                           */
  /* ======================================================================== */

  function openMpAdd() {
    setMpEditing(null)
    setMpForm({ name: '', priceDollars: '', description: '', assetFileName: '' })
    setMpTouched(false)
    setMpDialogOpen(true)
  }

  function openMpEdit(item: AdminMarketplaceItem) {
    setMpEditing(item)
    setMpForm({ name: item.name, priceDollars: String(item.priceDollars), description: item.description, assetFileName: item.assetFileName })
    setMpTouched(false)
    setMpDialogOpen(true)
  }

  // The price guardrail is owned by Configuration → Pricing (AdminMarketplacePricingConfig), not
  // redefined here — every add/edit is validated against whatever min/max it currently holds.
  const mpMinDollars = marketplacePricing.minPriceCents / 100
  const mpMaxDollars = marketplacePricing.maxPriceCents / 100

  const mpNameError = mpTouched && !mpForm.name.trim() ? 'Name is required.' : undefined
  const mpPriceValue = Number(mpForm.priceDollars)
  const mpPriceError =
    mpTouched && (!mpForm.priceDollars || Number.isNaN(mpPriceValue) || mpPriceValue < mpMinDollars || mpPriceValue > mpMaxDollars)
      ? `Enter a price between $${mpMinDollars} and $${mpMaxDollars} — the bound set in Configuration → Pricing.`
      : undefined
  const mpAssetError = mpTouched && !mpForm.assetFileName.trim().toLowerCase().endsWith('.pdf') ? 'Enter a PDF filename, e.g. swipe-file.pdf.' : undefined

  function saveMarketplace() {
    setMpTouched(true)
    if (!mpForm.name.trim() || !mpForm.priceDollars || Number.isNaN(mpPriceValue) || mpPriceValue < mpMinDollars || mpPriceValue > mpMaxDollars) return
    if (!mpForm.assetFileName.trim().toLowerCase().endsWith('.pdf')) return
    const price = mpPriceValue
    if (mpEditing) {
      setMarketplaceItems((prev) => prev.map((item) => item.id === mpEditing.id ? { ...item, name: mpForm.name.trim(), priceDollars: price, description: mpForm.description.trim(), assetFileName: mpForm.assetFileName.trim() } : item))
    } else {
      const id = `mp-${Date.now()}`
      setMarketplaceItems((prev) => [...prev, { id, name: mpForm.name.trim(), priceDollars: price, description: mpForm.description.trim(), assetFileName: mpForm.assetFileName.trim() }])
    }
    setMpDialogOpen(false)
  }

  function confirmDeleteMarketplace(id: string, name: string) {
    setDeleteTarget({ kind: 'marketplace', id, label: name })
  }

  function executeDelete() {
    if (!deleteTarget) return
    if (deleteTarget.kind === 'marketplace') setMarketplaceItems((prev) => prev.filter((item) => item.id !== deleteTarget.id))
    else if (deleteTarget.kind === 'download') setDownloadItems((prev) => prev.filter((item) => item.id !== deleteTarget.id))
    else if (deleteTarget.kind === 'tutorial') setTutorialItems((prev) => prev.filter((item) => item.id !== deleteTarget.id))
    else if (deleteTarget.kind === 'faq') setFaqItems((prev) => prev.filter((item) => item.id !== deleteTarget.id))
    else if (deleteTarget.kind === 'popup') setPopupWidgets((prev) => prev.filter((item) => item.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const mpColumns: readonly DataTableColumn<AdminMarketplaceItem>[] = [
    { key: 'name', label: 'Item', sortable: true, sortValue: (r) => r.name, render: (r) => <span className="font-medium text-ink">{r.name}</span> },
    { key: 'price', label: 'Price', sortable: true, sortValue: (r) => r.priceDollars, render: (r) => <span className="tabular-nums text-ink">${r.priceDollars}</span> },
    { key: 'description', label: 'Description', render: (r) => <span className="line-clamp-2 text-sm text-ink-muted">{r.description}</span> },
    { key: 'asset', label: 'PDF asset', render: (r) => <span className="text-sm text-ink-muted">{r.assetFileName}</span> },
    { key: 'actions', label: 'Actions', hideInMobileDetail: true, render: (r) => (
      <span className="flex gap-1">
        <button type="button" onClick={() => openMpEdit(r)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><Pencil aria-hidden="true" className="size-3.5" />Edit</button>
        <button type="button" onClick={() => confirmDeleteMarketplace(r.id, r.name)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-danger hover:bg-danger-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><Trash2 aria-hidden="true" className="size-3.5" />Delete</button>
      </span>
    ) },
  ]

  /* ======================================================================== */
  /* Downloads tab                                                             */
  /* ======================================================================== */

  function openDlAdd() {
    setDlEditing(null)
    setDlForm({ title: '', platform: 'Application', extension: '', support: '', href: '' })
    setDlTouched(false)
    setDlDialogOpen(true)
  }

  function openDlEdit(item: AdminDownloadItem) {
    setDlEditing(item)
    setDlForm({ title: item.title, platform: item.platform, extension: item.extension, support: item.support, href: item.href })
    setDlTouched(false)
    setDlDialogOpen(true)
  }

  const dlTitleError = dlTouched && !dlForm.title.trim() ? 'Title is required.' : undefined

  function saveDownload() {
    setDlTouched(true)
    if (!dlForm.title.trim()) return
    if (dlEditing) {
      setDownloadItems((prev) => prev.map((item) => item.id === dlEditing.id ? { ...item, title: dlForm.title.trim(), platform: dlForm.platform, extension: dlForm.extension.trim(), support: dlForm.support.trim(), href: dlForm.href.trim() } : item))
    } else {
      const id = `dl-${Date.now()}`
      setDownloadItems((prev) => [...prev, { id, title: dlForm.title.trim(), platform: dlForm.platform, extension: dlForm.extension.trim(), cta: 'Download', support: dlForm.support.trim(), imageSrc: '/v3-assets/figma/download-icon-apple.png', href: dlForm.href.trim() }])
    }
    setDlDialogOpen(false)
  }

  function confirmDeleteDownload(id: string, title: string) {
    setDeleteTarget({ kind: 'download', id, label: title })
  }

  const dlColumns: readonly DataTableColumn<AdminDownloadItem>[] = [
    { key: 'title', label: 'Title', sortable: true, sortValue: (r) => r.title, render: (r) => <span className="font-medium text-ink">{r.title}</span> },
    { key: 'platform', label: 'Platform', sortable: true, sortValue: (r) => r.platform, render: (r) => <Badge variant="neutral" size="sm">{r.platform}</Badge> },
    { key: 'extension', label: 'Format', render: (r) => <span className="text-sm text-ink-muted">{r.extension}</span> },
    { key: 'support', label: 'Support text', render: (r) => <span className="line-clamp-2 text-sm text-ink-muted">{r.support}</span> },
    { key: 'actions', label: 'Actions', hideInMobileDetail: true, render: (r) => (
      <span className="flex gap-1">
        <button type="button" onClick={() => openDlEdit(r)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><Pencil aria-hidden="true" className="size-3.5" />Edit</button>
        <button type="button" onClick={() => confirmDeleteDownload(r.id, r.title)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-danger hover:bg-danger-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><Trash2 aria-hidden="true" className="size-3.5" />Delete</button>
      </span>
    ) },
  ]

  /* ======================================================================== */
  /* Tutorials tab                                                             */
  /* ======================================================================== */

  function openTuAdd() {
    setTuEditing(null)
    setTuForm({ title: '', href: '', kind: 'video', tone: 'accent', category: '' })
    setTuTouched(false)
    setTuDialogOpen(true)
  }

  function openTuEdit(item: AdminTutorialItem) {
    setTuEditing(item)
    setTuForm({ title: item.title, href: item.href, kind: item.kind, tone: item.tone, category: item.category ?? '' })
    setTuTouched(false)
    setTuDialogOpen(true)
  }

  const tuTitleError = tuTouched && !tuForm.title.trim() ? 'Title is required.' : undefined

  function saveTutorial() {
    setTuTouched(true)
    if (!tuForm.title.trim()) return
    if (tuEditing) {
      setTutorialItems((prev) => prev.map((item) => item.id === tuEditing.id ? { ...item, title: tuForm.title.trim(), href: tuForm.href.trim(), kind: tuForm.kind, tone: tuForm.tone, category: tuForm.category.trim() || undefined } : item))
    } else {
      const id = `tu-${Date.now()}`
      setTutorialItems((prev) => [...prev, { id, title: tuForm.title.trim(), href: tuForm.href.trim(), kind: tuForm.kind, tone: tuForm.tone, category: tuForm.category.trim() || undefined }])
    }
    setTuDialogOpen(false)
  }

  function confirmDeleteTutorial(id: string, title: string) {
    setDeleteTarget({ kind: 'tutorial', id, label: title })
  }

  const tuColumns: readonly DataTableColumn<AdminTutorialItem>[] = [
    { key: 'title', label: 'Title', sortable: true, sortValue: (r) => r.title, render: (r) => <span className="font-medium text-ink">{r.title}</span> },
    { key: 'kind', label: 'Type', sortable: true, sortValue: (r) => r.kind, render: (r) => <Badge variant={r.kind === 'video' ? 'accent' : 'neutral'} size="sm">{kindLabels[r.kind] ?? r.kind}</Badge> },
    { key: 'tone', label: 'Tone', render: (r) => <Badge variant={r.tone as BadgeVariant} size="sm">{r.tone}</Badge> },
    { key: 'category', label: 'Category', render: (r) => r.category ? <Badge variant="neutral" size="sm">{r.category}</Badge> : <span className="text-ink-muted">—</span> },
    { key: 'actions', label: 'Actions', hideInMobileDetail: true, render: (r) => (
      <span className="flex gap-1">
        <button type="button" onClick={() => openTuEdit(r)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><Pencil aria-hidden="true" className="size-3.5" />Edit</button>
        <button type="button" onClick={() => confirmDeleteTutorial(r.id, r.title)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-danger hover:bg-danger-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><Trash2 aria-hidden="true" className="size-3.5" />Delete</button>
      </span>
    ) },
  ]

  /* ======================================================================== */
  /* FAQ tab                                                                   */
  /* ======================================================================== */

  function openFaqAdd() {
    setFaqEditing(null)
    setFaqForm({ question: '', answer: '' })
    setFaqTouched(false)
    setFaqDialogOpen(true)
  }

  function openFaqEdit(item: AdminFaqItem) {
    setFaqEditing(item)
    setFaqForm({ question: item.question, answer: item.answer })
    setFaqTouched(false)
    setFaqDialogOpen(true)
  }

  const faqQuestionError = faqTouched && !faqForm.question.trim() ? 'Question is required.' : undefined
  const faqAnswerError = faqTouched && !faqForm.answer.trim() ? 'Answer is required.' : undefined

  function saveFaq() {
    setFaqTouched(true)
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return
    if (faqEditing) {
      setFaqItems((prev) => prev.map((item) => item.id === faqEditing.id ? { ...item, question: faqForm.question.trim(), answer: faqForm.answer.trim() } : item))
    } else {
      const id = `faq-${Date.now()}`
      setFaqItems((prev) => [...prev, { id, question: faqForm.question.trim(), answer: faqForm.answer.trim() }])
    }
    setFaqDialogOpen(false)
  }

  function confirmDeleteFaq(id: string, question: string) {
    setDeleteTarget({ kind: 'faq', id, label: question })
  }

  const faqColumns: readonly DataTableColumn<AdminFaqItem>[] = [
    { key: 'question', label: 'Question', sortable: true, sortValue: (r) => r.question, render: (r) => <span className="font-medium text-ink">{r.question}</span> },
    { key: 'answer', label: 'Answer', render: (r) => <span className="line-clamp-2 text-sm text-ink-muted">{r.answer}</span> },
    { key: 'actions', label: 'Actions', hideInMobileDetail: true, render: (r) => (
      <span className="flex gap-1">
        <button type="button" onClick={() => openFaqEdit(r)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><Pencil aria-hidden="true" className="size-3.5" />Edit</button>
        <button type="button" onClick={() => confirmDeleteFaq(r.id, r.question)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-danger hover:bg-danger-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><Trash2 aria-hidden="true" className="size-3.5" />Delete</button>
      </span>
    ) },
  ]

  /* ======================================================================== */
  /* Popup widgets tab — stepper flow                                          */
  /* ======================================================================== */

  const displayTypeOptions = [
    { value: 'modal', label: 'Modal' },
    { value: 'toast', label: 'Toast' },
    { value: 'banner', label: 'Banner' },
  ]

  const categoryOptions: readonly { readonly id: PopupCategory; readonly label: string; readonly description: string }[] = [
    { id: 'popup', label: 'Pop-up', description: 'General promotional popup with headline, body, and CTA.' },
    { id: 'offer', label: 'Offer', description: 'Pricing offer with discount, list items, and optional countdown timer.' },
    { id: 'feature-release', label: 'Feature Release', description: 'Product update with media upload and categorization tag.' },
  ]

  const [popupStep, setPopupStep] = useState<1 | 2 | 3>(1)
  const [popupSelectedCategory, setPopupSelectedCategory] = useState<PopupCategory>('popup')

  function openPopupAdd() {
    setPopupEditing(null)
    setPopupStep(1)
    setPopupSelectedCategory('popup')
    setPopupForm({
      name: '', displayType: 'modal', active: true,
      headline: '', subHeadline: '', title: '', body: '', ctaLabel: '', ctaUrl: '',
      price: 0, discount: 0, offerList: [''], timerEnabled: false, timerExpiry: '',
      mediaUrl: '', mediaType: 'image', tag: '',
    })
    setPopupTouched(false)
    setPopupDialogOpen(true)
  }

  function openPopupEdit(item: AdminPopupWidget) {
    setPopupEditing(item)
    setPopupSelectedCategory(item.category)
    setPopupStep(3)
    if (item.category === 'popup') {
      setPopupForm({
        name: item.name, displayType: item.displayType, active: item.active,
        headline: item.headline, subHeadline: item.subHeadline, title: item.title, body: item.body,
        ctaLabel: item.ctaLabel, ctaUrl: item.ctaUrl,
        price: 0, discount: 0, offerList: [''], timerEnabled: false, timerExpiry: '',
        mediaUrl: '', mediaType: 'image', tag: '',
      })
    } else if (item.category === 'offer') {
      setPopupForm({
        name: item.name, displayType: item.displayType, active: item.active,
        headline: item.headline, subHeadline: item.subHeadline, title: '', body: '',
        ctaLabel: item.ctaLabel, ctaUrl: item.ctaUrl,
        price: item.price, discount: item.discount, offerList: item.offerList.length > 0 ? [...item.offerList] : [''],
        timerEnabled: item.timerEnabled, timerExpiry: item.timerExpiry ?? '',
        mediaUrl: '', mediaType: 'image', tag: '',
      })
    } else {
      setPopupForm({
        name: item.name, displayType: item.displayType, active: item.active,
        headline: '', subHeadline: '', title: item.title, body: item.body,
        ctaLabel: '', ctaUrl: '',
        price: 0, discount: 0, offerList: [''], timerEnabled: false, timerExpiry: '',
        mediaUrl: item.mediaUrl ?? '', mediaType: item.mediaType ?? 'image', tag: item.tag,
      })
    }
    setPopupTouched(false)
    setPopupDialogOpen(true)
  }

  const popupNameError = popupTouched && !popupForm.name.trim() ? 'Name is required.' : undefined
  const popupHeadlineError = popupTouched && popupSelectedCategory !== 'feature-release' && !popupForm.headline.trim() ? 'Headline is required.' : undefined
  const popupTitleError = popupTouched && popupSelectedCategory === 'feature-release' && !popupForm.title.trim() ? 'Title is required.' : undefined
  const popupCtaError = popupTouched && (popupSelectedCategory === 'popup' || popupSelectedCategory === 'offer') && !popupForm.ctaLabel.trim() ? 'CTA label is required.' : undefined

  function savePopup() {
    setPopupTouched(true)
    const base = { name: popupForm.name.trim(), displayType: popupForm.displayType, active: popupForm.active }
    if (!base.name) return

    if (popupSelectedCategory === 'popup') {
      if (!popupForm.headline.trim() || !popupForm.ctaLabel.trim()) return
      const widget: AdminPopupWidget = {
        ...base, id: popupEditing?.id ?? `popup-${Date.now()}`, category: 'popup',
        headline: popupForm.headline.trim(), subHeadline: popupForm.subHeadline.trim(),
        title: popupForm.title.trim(), body: popupForm.body.trim(),
        ctaLabel: popupForm.ctaLabel.trim(), ctaUrl: popupForm.ctaUrl.trim(),
      }
      popupEditing ? setPopupWidgets((prev) => prev.map((w) => w.id === popupEditing.id ? widget : w)) : setPopupWidgets((prev) => [...prev, widget])
    } else if (popupSelectedCategory === 'offer') {
      if (!popupForm.headline.trim() || !popupForm.ctaLabel.trim()) return
      const offerList = popupForm.offerList.map((f) => f.trim()).filter(Boolean)
      const widget: AdminPopupWidget = {
        ...base, id: popupEditing?.id ?? `popup-${Date.now()}`, category: 'offer',
        headline: popupForm.headline.trim(), subHeadline: popupForm.subHeadline.trim(),
        price: popupForm.price, discount: popupForm.discount, offerList,
        ctaLabel: popupForm.ctaLabel.trim(), ctaUrl: popupForm.ctaUrl.trim(),
        timerEnabled: popupForm.timerEnabled,
        timerExpiry: popupForm.timerEnabled && popupForm.timerExpiry ? popupForm.timerExpiry : undefined,
      }
      popupEditing ? setPopupWidgets((prev) => prev.map((w) => w.id === popupEditing.id ? widget : w)) : setPopupWidgets((prev) => [...prev, widget])
    } else {
      if (!popupForm.title.trim()) return
      const widget: AdminPopupWidget = {
        ...base, id: popupEditing?.id ?? `popup-${Date.now()}`, category: 'feature-release',
        title: popupForm.title.trim(), body: popupForm.body.trim(),
        mediaUrl: popupForm.mediaUrl.trim() || undefined,
        mediaType: popupForm.mediaUrl.trim() ? popupForm.mediaType : undefined,
        tag: popupForm.tag.trim(),
      }
      popupEditing ? setPopupWidgets((prev) => prev.map((w) => w.id === popupEditing.id ? widget : w)) : setPopupWidgets((prev) => [...prev, widget])
    }
    setPopupDialogOpen(false)
  }

  function confirmDeletePopup(id: string, name: string) {
    setDeleteTarget({ kind: 'popup', id, label: name })
  }

  const popupCategoryLabel: Record<PopupCategory, string> = {
    'popup': 'Pop-up',
    'offer': 'Offer',
    'feature-release': 'Feature Release',
  }

  const previewWidget: AdminPopupWidget = popupSelectedCategory === 'popup'
    ? {
        id: 'preview', name: popupForm.name || 'Preview', category: 'popup',
        displayType: popupForm.displayType, active: popupForm.active,
        headline: popupForm.headline || 'Headline', subHeadline: popupForm.subHeadline,
        title: popupForm.title, body: popupForm.body,
        ctaLabel: popupForm.ctaLabel || 'CTA', ctaUrl: popupForm.ctaUrl,
      }
    : popupSelectedCategory === 'offer'
    ? {
        id: 'preview', name: popupForm.name || 'Preview', category: 'offer',
        displayType: popupForm.displayType, active: popupForm.active,
        headline: popupForm.headline || 'Headline', subHeadline: popupForm.subHeadline,
        price: popupForm.price, discount: popupForm.discount,
        offerList: popupForm.offerList.map((f) => f.trim()).filter(Boolean),
        ctaLabel: popupForm.ctaLabel || 'CTA', ctaUrl: popupForm.ctaUrl,
        timerEnabled: popupForm.timerEnabled, timerExpiry: popupForm.timerExpiry || undefined,
      }
    : {
        id: 'preview', name: popupForm.name || 'Preview', category: 'feature-release',
        displayType: popupForm.displayType, active: popupForm.active,
        title: popupForm.title || 'Title', body: popupForm.body,
        mediaUrl: popupForm.mediaUrl || undefined, mediaType: popupForm.mediaUrl ? popupForm.mediaType : undefined,
        tag: popupForm.tag,
      }

  const popupColumns: readonly DataTableColumn<AdminPopupWidget>[] = [
    { key: 'name', label: 'Name', sortable: true, sortValue: (r) => r.name, render: (r) => <span className="font-medium text-ink">{r.name}</span> },
    { key: 'category', label: 'Type', sortable: true, sortValue: (r) => r.category, render: (r) => <Badge variant={r.category === 'popup' ? 'accent' : r.category === 'offer' ? 'positive' : 'neutral'} size="sm">{popupCategoryLabel[r.category]}</Badge> },
    { key: 'display', label: 'Display', sortable: true, sortValue: (r) => r.displayType, render: (r) => <span className="text-sm text-ink-muted capitalize">{r.displayType}</span> },
    { key: 'active', label: 'Status', sortable: true, sortValue: (r) => r.active ? '1' : '0', render: (r) => <Badge variant={r.active ? 'positive' : 'neutral'} size="sm">{r.active ? 'Active' : 'Inactive'}</Badge> },
    { key: 'actions', label: 'Actions', hideInMobileDetail: true, render: (r) => (
      <span className="flex gap-1">
        <button type="button" onClick={() => openPopupEdit(r)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><Pencil aria-hidden="true" className="size-3.5" />Edit</button>
        <button type="button" onClick={() => confirmDeletePopup(r.id, r.name)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-danger hover:bg-danger-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><Trash2 aria-hidden="true" className="size-3.5" />Delete</button>
      </span>
    ) },
  ]

  /* ======================================================================== */
  /* Tab renderers                                                             */
  /* ======================================================================== */

  function renderMarketplace() {
    return (
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">{marketplaceItems.length} items in the marketplace catalog.</p>
          <Button onClick={openMpAdd} leadingIcon={<Plus aria-hidden="true" />}>Add item</Button>
        </div>
        <DataTable
          rows={marketplaceItems}
          columns={mpColumns}
          itemLabel={(r) => r.name}
          minTableWidthClassName="min-w-[48rem]"
        />
      </div>
    )
  }

  function renderDownloads() {
    return (
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">{downloadItems.length} download entries.</p>
          <Button onClick={openDlAdd} leadingIcon={<Plus aria-hidden="true" />}>Add download</Button>
        </div>
        <DataTable
          rows={downloadItems}
          columns={dlColumns}
          itemLabel={(r) => r.title}
          minTableWidthClassName="min-w-[56rem]"
        />
      </div>
    )
  }

  function renderTutorials() {
    return (
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">{tutorialItems.length} tutorials.</p>
          <Button onClick={openTuAdd} leadingIcon={<Plus aria-hidden="true" />}>Add tutorial</Button>
        </div>
        <DataTable
          rows={tutorialItems}
          columns={tuColumns}
          itemLabel={(r) => r.title}
          minTableWidthClassName="min-w-[48rem]"
        />
      </div>
    )
  }

  function renderFaq() {
    return (
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">{faqItems.length} FAQ entries.</p>
          <Button onClick={openFaqAdd} leadingIcon={<Plus aria-hidden="true" />}>Add FAQ</Button>
        </div>
        <DataTable
          rows={faqItems}
          columns={faqColumns}
          itemLabel={(r) => r.question}
          minTableWidthClassName="min-w-[48rem]"
        />
      </div>
    )
  }

  function renderPopups() {
    return (
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">{popupWidgets.length} popup widgets configured.</p>
          <Button onClick={openPopupAdd} leadingIcon={<Plus aria-hidden="true" />}>Add widget</Button>
        </div>
        <DataTable
          rows={popupWidgets}
          columns={popupColumns}
          itemLabel={(r) => r.name}
          minTableWidthClassName="min-w-[56rem]"
        />
      </div>
    )
  }

  /* ======================================================================== */
  /* Render                                                                    */
  /* ======================================================================== */

  return (
    <AdminShell user={user} navItems={navItems} activeModule={'content' as unknown as AdminModuleId} notifications={notifications} searchResults={searchResults}>
      <div className="grid gap-6 p-4 sm:p-6">
        <div>
          <h1 className="font-gowun text-3xl font-bold leading-tight text-ink">Content</h1>
          <p className="mt-1 text-sm text-ink-muted">Manage the catalogs shown to candidates: marketplace items, downloads, tutorials, FAQ, and popup widgets.</p>
        </div>

        <div className="border-b border-border">
          <div role="tablist" aria-label="Content sections" className="flex flex-wrap gap-1">
            {TABS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                role="tab"
                aria-selected={entry.id === tab}
                onClick={() => onTabChange(entry.id)}
                className={cn(
                  'inline-flex min-h-11 items-center gap-2 border-b-2 px-3 text-sm font-semibold transition-colors duration-normal ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                  entry.id === tab ? 'border-accent text-accent-text' : 'border-transparent text-ink-muted hover:text-ink',
                )}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <>
            <Skeleton className="h-12" />
            <Skeleton className="h-96" />
          </>
        ) : errorMessage ? (
          <div role="alert" className="bg-danger-surface p-6 text-center shadow-panel">
            <AlertTriangle aria-hidden="true" className="mx-auto size-6 text-danger" />
            <p className="mt-3 text-sm font-semibold text-ink">Could not load content data</p>
            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-ink-muted">{errorMessage}</p>
            {onRetry ? <Button variant="secondary" leadingIcon={<RefreshCw aria-hidden="true" />} onClick={onRetry} className="mt-4">Try again</Button> : null}
          </div>
        ) : tab === 'marketplace' ? renderMarketplace() : tab === 'downloads' ? renderDownloads() : tab === 'tutorials' ? renderTutorials() : tab === 'popups' ? renderPopups() : renderFaq()}
      </div>

      {/* ---- Marketplace add/edit dialog ---- */}
      <Dialog open={mpDialogOpen} onOpenChange={setMpDialogOpen}>
        <DialogPopup aria-label={mpEditing ? 'Edit marketplace item' : 'Add marketplace item'}>
          <DialogTitle>{mpEditing ? 'Edit marketplace item' : 'Add marketplace item'}</DialogTitle>
          <DialogDescription>Items appear in the candidate-side Marketplace tab.</DialogDescription>
          <div className="mt-4 grid gap-4">
            <TextField id="mp-name" label="Name" value={mpForm.name} onChange={(e) => setMpForm((prev) => ({ ...prev, name: e.target.value }))} error={mpNameError} placeholder="e.g. Interview Answer Swipe File" />
            <TextField
              id="mp-price"
              label={`Price (USD, $${mpMinDollars}–$${mpMaxDollars})`}
              type="number"
              min={mpMinDollars}
              max={mpMaxDollars}
              value={mpForm.priceDollars}
              onChange={(e) => setMpForm((prev) => ({ ...prev, priceDollars: e.target.value }))}
              error={mpPriceError}
              placeholder={String(mpMinDollars)}
            />
            <FormTextArea id="mp-desc" label="Description" value={mpForm.description} onChange={(e) => setMpForm((prev) => ({ ...prev, description: e.target.value }))} rows={3} placeholder="Short description shown to candidates" />
            <TextField id="mp-asset" label="PDF asset filename" value={mpForm.assetFileName} onChange={(e) => setMpForm((prev) => ({ ...prev, assetFileName: e.target.value }))} error={mpAssetError} placeholder="e.g. swipe-file.pdf" />
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <DialogClose className="static inline-flex min-h-9 items-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Cancel</DialogClose>
            <Button onClick={saveMarketplace}>{mpEditing ? 'Save changes' : 'Add item'}</Button>
          </div>
        </DialogPopup>
      </Dialog>

      {/* ---- Downloads add/edit dialog ---- */}
      <Dialog open={dlDialogOpen} onOpenChange={setDlDialogOpen}>
        <DialogPopup aria-label={dlEditing ? 'Edit download entry' : 'Add download entry'}>
          <DialogTitle>{dlEditing ? 'Edit download entry' : 'Add download entry'}</DialogTitle>
          <DialogDescription>Downloads appear in the candidate-side Download Apps section.</DialogDescription>
          <div className="mt-4 grid gap-4">
            <TextField id="dl-title" label="Title" value={dlForm.title} onChange={(e) => setDlForm((prev) => ({ ...prev, title: e.target.value }))} error={dlTitleError} placeholder="e.g. Jobwhisper Copilot 1.0.2" />
            <SelectField id="dl-platform" label="Platform" value={dlForm.platform} onValueChange={(v) => setDlForm((prev) => ({ ...prev, platform: v }))} options={platformOptions} />
            <TextField id="dl-ext" label="Format / extension" value={dlForm.extension} onChange={(e) => setDlForm((prev) => ({ ...prev, extension: e.target.value }))} placeholder="e.g. dmg, exe, AppImage" />
            <TextField id="dl-support" label="Support text" value={dlForm.support} onChange={(e) => setDlForm((prev) => ({ ...prev, support: e.target.value }))} placeholder="e.g. Apple Silicon (M-series) • v1.0.2" />
            <TextField id="dl-url" label="Download URL" value={dlForm.href} onChange={(e) => setDlForm((prev) => ({ ...prev, href: e.target.value }))} placeholder="https://..." />
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <DialogClose className="static inline-flex min-h-9 items-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Cancel</DialogClose>
            <Button onClick={saveDownload}>{dlEditing ? 'Save changes' : 'Add download'}</Button>
          </div>
        </DialogPopup>
      </Dialog>

      {/* ---- Tutorials add/edit dialog ---- */}
      <Dialog open={tuDialogOpen} onOpenChange={setTuDialogOpen}>
        <DialogPopup aria-label={tuEditing ? 'Edit tutorial' : 'Add tutorial'}>
          <DialogTitle>{tuEditing ? 'Edit tutorial' : 'Add tutorial'}</DialogTitle>
          <DialogDescription>Tutorials appear in the candidate-side Tutorials section.</DialogDescription>
          <div className="mt-4 grid gap-4">
            <TextField id="tu-title" label="Title" value={tuForm.title} onChange={(e) => setTuForm((prev) => ({ ...prev, title: e.target.value }))} error={tuTitleError} placeholder="e.g. Getting Started with Auto Apply" />
            <TextField id="tu-href" label="Link URL" value={tuForm.href} onChange={(e) => setTuForm((prev) => ({ ...prev, href: e.target.value }))} placeholder="https://..." />
            <SelectField id="tu-kind" label="Type" value={tuForm.kind} onValueChange={(v) => setTuForm((prev) => ({ ...prev, kind: v as 'video' | 'external' }))} options={kindOptions} />
            <SelectField id="tu-tone" label="Tone" value={tuForm.tone} onValueChange={(v) => setTuForm((prev) => ({ ...prev, tone: v as AdminTutorialItem['tone'] }))} options={toneOptions} />
            <TextField id="tu-category" label="Category (optional)" value={tuForm.category} onChange={(e) => setTuForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="e.g. Onboarding, Product" />
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <DialogClose className="static inline-flex min-h-9 items-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Cancel</DialogClose>
            <Button onClick={saveTutorial}>{tuEditing ? 'Save changes' : 'Add tutorial'}</Button>
          </div>
        </DialogPopup>
      </Dialog>

      {/* ---- FAQ add/edit dialog ---- */}
      <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
        <DialogPopup aria-label={faqEditing ? 'Edit FAQ entry' : 'Add FAQ entry'}>
          <DialogTitle>{faqEditing ? 'Edit FAQ entry' : 'Add FAQ entry'}</DialogTitle>
          <DialogDescription>FAQ entries appear in the candidate-side Billing section.</DialogDescription>
          <div className="mt-4 grid gap-4">
            <TextField id="faq-question" label="Question" value={faqForm.question} onChange={(e) => setFaqForm((prev) => ({ ...prev, question: e.target.value }))} error={faqQuestionError} placeholder="e.g. How do I cancel my subscription?" />
            <FormTextArea id="faq-answer" label="Answer" value={faqForm.answer} onChange={(e) => setFaqForm((prev) => ({ ...prev, answer: e.target.value }))} rows={4} error={faqAnswerError} placeholder="Full answer shown to the candidate" />
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <DialogClose className="static inline-flex min-h-9 items-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Cancel</DialogClose>
            <Button onClick={saveFaq}>{faqEditing ? 'Save changes' : 'Add FAQ'}</Button>
          </div>
        </DialogPopup>
      </Dialog>

      {/* ---- Popup widgets add/edit dialog (stepper + live preview) ---- */}
      <Dialog open={popupDialogOpen} onOpenChange={setPopupDialogOpen}>
        <DialogPopup aria-label={popupEditing ? 'Edit popup widget' : 'Add popup widget'} className="sm:max-w-4xl">
          {popupStep === 1 && !popupEditing ? (
            <>
              <DialogTitle>Create popup widget</DialogTitle>
              <DialogDescription>Choose the type of widget you want to create.</DialogDescription>
              <div className="mt-5 grid gap-3">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => { setPopupSelectedCategory(cat.id); setPopupStep(2) }}
                    className={`flex flex-col items-start gap-1 rounded-lg border-2 p-4 text-left transition-colors ${popupSelectedCategory === cat.id ? 'border-accent bg-accent-subtle' : 'border-border hover:border-accent/40 hover:bg-surface-subtle'}`}
                  >
                    <span className="text-sm font-semibold text-ink">{cat.label}</span>
                    <span className="text-xs text-ink-muted">{cat.description}</span>
                  </button>
                ))}
              </div>
            </>
          ) : popupStep === 2 && !popupEditing ? (
            <>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setPopupStep(1)} className="inline-flex size-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <ArrowLeft aria-hidden="true" className="size-4" />
                </button>
              </div>
              <DialogTitle>Promo name</DialogTitle>
              <DialogDescription>Give your widget an internal name and choose how it displays.</DialogDescription>
              <div className="mt-4 grid gap-3">
                <TextField id="popup-name" label="Promo Name" value={popupForm.name} onChange={(e) => setPopupForm((prev) => ({ ...prev, name: e.target.value }))} error={popupNameError} placeholder="e.g. Summer Sale" />
                <SelectField id="popup-display" label="Display type" value={popupForm.displayType} onValueChange={(v) => setPopupForm((prev) => ({ ...prev, displayType: v as AdminPopupWidget['displayType'] }))} options={displayTypeOptions} />
              </div>
              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <DialogClose className="static inline-flex min-h-9 items-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Cancel</DialogClose>
                <Button onClick={() => { setPopupTouched(true); if (popupForm.name.trim()) setPopupStep(3) }}>Next</Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* ---- Left: form ---- */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {!popupEditing ? (
                    <button type="button" onClick={() => setPopupStep(2)} className="inline-flex size-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                      <ArrowLeft aria-hidden="true" className="size-4" />
                    </button>
                  ) : null}
                </div>
                <DialogTitle>{popupEditing ? 'Edit widget' : categoryOptions.find((c) => c.id === popupSelectedCategory)?.label}</DialogTitle>
                <DialogDescription>
                  {popupSelectedCategory === 'popup' && 'General promotional popup with headline, title, body, and CTA.'}
                  {popupSelectedCategory === 'offer' && 'Pricing offer with discount, list items, and optional countdown timer.'}
                  {popupSelectedCategory === 'feature-release' && 'Product update announcement with media and categorization tag.'}
                </DialogDescription>
                <div className="mt-4 grid gap-3">
                  {/* ---- Pop-up fields ---- */}
                  {popupSelectedCategory === 'popup' && (
                    <>
                      <TextField id="popup-headline" label="Headline" value={popupForm.headline} onChange={(e) => setPopupForm((prev) => ({ ...prev, headline: e.target.value }))} error={popupHeadlineError} placeholder="e.g. Welcome to Jobwhisper" />
                      <TextField id="popup-subheadline" label="Sub-Headline" value={popupForm.subHeadline} onChange={(e) => setPopupForm((prev) => ({ ...prev, subHeadline: e.target.value }))} placeholder="e.g. Your AI interview copilot" />
                      <TextField id="popup-title" label="Title" value={popupForm.title} onChange={(e) => setPopupForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="e.g. Ace every interview" />
                      <FormTextArea id="popup-body" label="Body" value={popupForm.body} onChange={(e) => setPopupForm((prev) => ({ ...prev, body: e.target.value }))} rows={3} placeholder="Main content of the popup" />
                      <div className="grid grid-cols-2 gap-3">
                        <TextField id="popup-cta-label" label="CTA Label" value={popupForm.ctaLabel} onChange={(e) => setPopupForm((prev) => ({ ...prev, ctaLabel: e.target.value }))} error={popupCtaError} placeholder="e.g. Get Started" />
                        <TextField id="popup-cta-url" label="CTA URL" value={popupForm.ctaUrl} onChange={(e) => setPopupForm((prev) => ({ ...prev, ctaUrl: e.target.value }))} placeholder="/v3/auth/create-account" />
                      </div>
                    </>
                  )}

                  {/* ---- Offer fields ---- */}
                  {popupSelectedCategory === 'offer' && (
                    <>
                      <TextField id="popup-headline" label="Headline" value={popupForm.headline} onChange={(e) => setPopupForm((prev) => ({ ...prev, headline: e.target.value }))} error={popupHeadlineError} placeholder="e.g. Job Twin Offer!" />
                      <TextField id="popup-subheadline" label="Sub-Headline" value={popupForm.subHeadline} onChange={(e) => setPopupForm((prev) => ({ ...prev, subHeadline: e.target.value }))} placeholder="e.g. Get 50% off Today" />
                      <div className="grid grid-cols-2 gap-3">
                        <TextField id="popup-price" label="Price ($)" type="number" min={0} value={popupForm.price} onChange={(e) => setPopupForm((prev) => ({ ...prev, price: Number(e.target.value) }))} placeholder="47" />
                        <TextField id="popup-discount" label="Discount (%)" type="number" min={0} max={100} value={popupForm.discount} onChange={(e) => setPopupForm((prev) => ({ ...prev, discount: Number(e.target.value) }))} placeholder="50" />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-ink">Offer List</label>
                        {popupForm.offerList.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <TextField
                              id={`popup-offer-${index}`}
                              value={item}
                              onChange={(e) => {
                                const next = [...popupForm.offerList]
                                next[index] = e.target.value
                                setPopupForm((prev) => ({ ...prev, offerList: next }))
                              }}
                              placeholder={`Item ${index + 1}`}
                              className="flex-1"
                            />
                            {popupForm.offerList.length > 1 && (
                              <button type="button" onClick={() => setPopupForm((prev) => ({ ...prev, offerList: prev.offerList.filter((_, i) => i !== index) }))} className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-danger hover:bg-danger-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                                <Trash2 aria-hidden="true" className="size-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button type="button" onClick={() => setPopupForm((prev) => ({ ...prev, offerList: [...prev.offerList, ''] }))} className="inline-flex items-center gap-1.5 self-start rounded-lg px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                          <Plus aria-hidden="true" className="size-3" /> Add item
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <TextField id="popup-cta-label" label="CTA Label" value={popupForm.ctaLabel} onChange={(e) => setPopupForm((prev) => ({ ...prev, ctaLabel: e.target.value }))} error={popupCtaError} placeholder="e.g. Take offer now!" />
                        <TextField id="popup-cta-url" label="CTA URL" value={popupForm.ctaUrl} onChange={(e) => setPopupForm((prev) => ({ ...prev, ctaUrl: e.target.value }))} placeholder="/v3/billing/plans" />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-ink">
                          <input type="checkbox" checked={popupForm.timerEnabled} onChange={(e) => setPopupForm((prev) => ({ ...prev, timerEnabled: e.target.checked }))} className="size-4 rounded border-input accent-accent" />
                          Enable countdown timer
                        </label>
                        {popupForm.timerEnabled && (
                          <input type="datetime-local" value={popupForm.timerExpiry} onChange={(e) => setPopupForm((prev) => ({ ...prev, timerExpiry: e.target.value }))} className="h-9 rounded-lg border border-input bg-surface px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus" />
                        )}
                      </div>
                    </>
                  )}

                  {/* ---- Feature Release fields ---- */}
                  {popupSelectedCategory === 'feature-release' && (
                    <>
                      <TextField id="popup-title" label="Title" value={popupForm.title} onChange={(e) => setPopupForm((prev) => ({ ...prev, title: e.target.value }))} error={popupTitleError} placeholder="e.g. Interview Copilot is here" />
                      <FormTextArea id="popup-body" label="Body" value={popupForm.body} onChange={(e) => setPopupForm((prev) => ({ ...prev, body: e.target.value }))} rows={3} placeholder="What's new and why it matters" />
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-ink">Upload Media</label>
                        <div className="flex items-center gap-3">
                          <label className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-input px-4 text-sm font-medium text-ink-muted hover:border-accent hover:text-accent transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            Choose file
                            <input type="file" accept="image/*,video/*" className="sr-only" onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const url = URL.createObjectURL(file)
                                const mediaType = file.type.startsWith('video/') ? 'video' : 'image'
                                setPopupForm((prev) => ({ ...prev, mediaUrl: url, mediaType }))
                              }
                            }} />
                          </label>
                          {popupForm.mediaUrl && (
                            <button type="button" onClick={() => setPopupForm((prev) => ({ ...prev, mediaUrl: '', mediaType: 'image' }))} className="text-xs font-medium text-danger hover:text-danger-hover">Remove</button>
                          )}
                        </div>
                        {popupForm.mediaUrl && (
                          <p className="text-xs text-ink-muted">File selected — {popupForm.mediaType === 'video' ? 'Video' : 'Image'} preview shown on the right.</p>
                        )}
                      </div>
                      <TextField id="popup-tag" label="Tag" value={popupForm.tag} onChange={(e) => setPopupForm((prev) => ({ ...prev, tag: e.target.value }))} placeholder="e.g. Product, Update, Beta" />
                    </>
                  )}
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-ink">
                    <input type="checkbox" checked={popupForm.active} onChange={(e) => setPopupForm((prev) => ({ ...prev, active: e.target.checked }))} className="size-4 rounded border-input accent-accent" />
                    Active
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <DialogClose className="static inline-flex min-h-9 items-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Cancel</DialogClose>
                    <Button onClick={savePopup}>{popupEditing ? 'Save changes' : 'Create widget'}</Button>
                  </div>
                </div>
              </div>

              {/* ---- Right: live preview ---- */}
              <div className="flex flex-col items-center gap-3 lg:w-[26rem] lg:shrink-0 lg:border-l lg:border-border lg:ps-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Preview</p>
                <div className="flex min-h-[20rem] items-center justify-center">
                  <PopupPreview widget={previewWidget} />
                </div>
              </div>
            </div>
          )}
        </DialogPopup>
      </Dialog>

      {/* ---- Delete confirmation dialog ---- */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <DialogPopup aria-label="Confirm deletion">
          <DialogTitle>Delete this item?</DialogTitle>
          <DialogDescription>
            {deleteTarget ? <>This will permanently remove <strong>{deleteTarget.label}</strong> from the catalog. Candidates will no longer see it.</> : null}
          </DialogDescription>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <DialogClose className="static inline-flex min-h-9 items-center rounded-lg border border-input px-4 text-sm font-semibold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Cancel</DialogClose>
            <Button variant="danger" onClick={executeDelete}>Delete</Button>
          </div>
        </DialogPopup>
      </Dialog>
    </AdminShell>
  )
}
