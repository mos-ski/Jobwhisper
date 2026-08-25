import { Component, type ErrorInfo, type ReactNode, useState } from 'react'
import {
  Download,
  FileText,
  Sparkles,
  Upload,
  ChevronRight,
  Menu,
  Settings,
  Home,
  BarChart3,
  Check,
  X,
  Bot,
  User,
  AlertTriangle,
  Bell,
  CreditCard,
  Star,
  Zap,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Chip,
  Collapsible,
  CollapsibleTrigger,
  CollapsiblePanel,
  DataTable,
  Divider,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogPopup,
  EmptyState,
  Menu as DropdownMenu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  Navigator,
  NavigatorGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  ProgressBar,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  SearchInput,
  SelectField,
  Separator,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetClose,
  Skeleton,
  Slider,
  Spinner,
  StatCard,
  StepIndicator,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TextField,
  ThemeSwitch,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  toast,
  Toaster,
  LightforthAiIcon,
} from '@/ui'
import type {
  DataTableColumn,
  NavigatorItem,
  StepItem,
} from '@/ui'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-canvas p-10 text-danger">
          <h1 className="text-2xl font-bold">Runtime Error</h1>
          <pre className="mt-4 whitespace-pre-wrap text-sm">{this.state.error.message}</pre>
          <pre className="mt-2 text-xs text-ink-muted">{this.state.error.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

function Section({ id, title, children }: { readonly id?: string; readonly title: string; readonly children: React.ReactNode }) {
  const sectionId = id ?? title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return (
    <section id={sectionId} className="grid min-w-0 gap-4 scroll-mt-20">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <div className="min-w-0 rounded-panel border border-border bg-surface p-6 shadow-panel">{children}</div>
    </section>
  )
}

function Row({ children, label }: { readonly children: React.ReactNode; readonly label?: string }) {
  return (
    <div className="grid gap-2">
      {label ? <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</span> : null}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

const selectOptions = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
  { label: 'Premium', value: 'premium' },
]

type DemoRow = { readonly id: string; readonly name: string; readonly role: string; readonly status: string }
const demoRows: readonly DemoRow[] = [
  { id: '1', name: 'Sarah Chen', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Marcus Johnson', role: 'Editor', status: 'Active' },
  { id: '3', name: 'Priya Patel', role: 'Viewer', status: 'Inactive' },
]

const demoColumns: readonly DataTableColumn<DemoRow>[] = [
  { key: 'name', label: 'Name', render: (r) => r.name },
  { key: 'role', label: 'Role', render: (r) => r.role },
  { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'Active' ? 'positive' : 'neutral'} size="sm">{r.status}</Badge> },
]

const stepItems: readonly StepItem[] = [
  { id: '1', label: 'Upload', status: 'complete' },
  { id: '2', label: 'Configure', status: 'active' },
  { id: '3', label: 'Review', status: 'pending' },
]

const sections = [
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'button', label: 'Button' },
  { id: 'badge', label: 'Badge' },
  { id: 'avatar', label: 'Avatar' },
  { id: 'chip', label: 'Chip' },
  { id: 'divider', label: 'Divider' },
  { id: 'card', label: 'Card' },
  { id: 'statcard', label: 'StatCard' },
  { id: 'progressbar', label: 'ProgressBar' },
  { id: 'skeleton', label: 'Skeleton' },
  { id: 'spinner', label: 'Spinner' },
  { id: 'stepindicator', label: 'StepIndicator' },
  { id: 'breadcrumbs', label: 'Breadcrumbs' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'form-controls', label: 'Form Controls' },
  { id: 'tooltip', label: 'Tooltip' },
  { id: 'dialog', label: 'Dialog' },
  { id: 'toast', label: 'Toast' },
  { id: 'datatable', label: 'DataTable' },
  { id: 'emptystate', label: 'EmptyState' },
  { id: 'themeswitch', label: 'ThemeSwitch' },
  { id: 'separator', label: 'Separator' },
  { id: 'slider', label: 'Slider' },
  { id: 'accordion', label: 'Accordion' },
  { id: 'collapsible', label: 'Collapsible' },
  { id: 'popover', label: 'Popover' },
  { id: 'menu-dropdown', label: 'Menu' },
  { id: 'scrollarea', label: 'ScrollArea' },
  { id: 'sheet-drawer', label: 'Sheet' },
  { id: 'navigator', label: 'Navigator' },
  { id: 'chat-bubbles', label: 'Chat Bubbles' },
  { id: 'typing-indicator', label: 'Typing Indicator' },
  { id: 'walkthrough', label: 'Walkthrough' },
  { id: 'hover-card', label: 'Hover Cards' },
  { id: 'prompt-chips', label: 'Prompt Chips' },
  { id: 'ai-suggestion', label: 'AI Suggestion' },
  { id: 'accept-reject', label: 'Accept / Reject' },
  { id: 'credit-card', label: 'Credit Card' },
  { id: 'upload-zone', label: 'Upload Zone' },
  { id: 'avatar-group', label: 'Avatar Group' },
  { id: 'banner', label: 'Banner' },
  { id: 'pricing-card', label: 'Pricing Card' },
  { id: 'status-badges', label: 'Status Badges' },
  { id: 'composite-skeleton', label: 'Skeleton Patterns' },
  { id: 'typewriter', label: 'Typewriter' },
] as const

export function LibraryPage() {
  return (
    <ErrorBoundary>
      <LibraryPageInner />
    </ErrorBoundary>
  )
}

function LibraryPageInner() {
  const [switchOn, setSwitchOn] = useState(false)
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [radioValue, setRadioValue] = useState('pro')
  const [searchValue, setSearchValue] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sliderValue, setSliderValue] = useState([40])
  const [popoverOpen, setPopoverOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 overflow-y-auto border-e border-border bg-surface px-4 py-6 lg:block">
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-muted">Library</p>
        <nav className="mt-3 grid gap-0.5">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-lg px-3 py-1.5 text-sm text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="min-h-screen flex-1 px-6 py-10">
        <Toaster />
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">Design System</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-normal">Lightforth Component Library</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-ink-muted">
                Every UI primitive, its variants, and all states. Use this as the reference for building screens.
              </p>
            </div>
            <ThemeSwitch className="mt-2" />
          </div>

        <div className="grid gap-8">
          {/* Colors */}
          <Section title="Colors">
            <div className="grid gap-4">
              <Row label="Surface">
                <div className="size-12 rounded-lg bg-canvas border border-border" title="canvas" />
                <div className="size-12 rounded-lg bg-surface border border-border" title="surface" />
                <div className="size-12 rounded-lg bg-surface-raised border border-border" title="surface-raised" />
                <div className="size-12 rounded-lg bg-surface-subtle border border-border" title="surface-subtle" />
              </Row>
              <Row label="Accent">
                <div className="size-12 rounded-lg bg-accent" title="accent" />
                <div className="size-12 rounded-lg bg-accent-hover" title="accent-hover" />
                <div className="size-12 rounded-lg bg-accent-subtle border border-border" title="accent-subtle" />
              </Row>
              <Row label="Status">
                <div className="size-12 rounded-lg bg-positive" title="positive" />
                <div className="size-12 rounded-lg bg-positive-surface border border-border" />
                <div className="size-12 rounded-lg bg-warning" title="warning" />
                <div className="size-12 rounded-lg bg-warning-surface border border-border" />
                <div className="size-12 rounded-lg bg-danger" title="danger" />
                <div className="size-12 rounded-lg bg-danger-surface border border-border" />
              </Row>
            </div>
          </Section>

          {/* Typography */}
          <Section title="Typography">
            <div className="grid gap-3">
              <p className="text-4xl font-bold">text-4xl — Display</p>
              <p className="text-3xl font-bold">text-3xl — Page title</p>
              <p className="text-2xl font-bold">text-2xl — Section title</p>
              <p className="text-xl font-semibold">text-xl — Card title</p>
              <p className="text-lg font-semibold">text-lg — Subsection</p>
              <p className="text-base">text-base — Body</p>
              <p className="text-sm">text-sm — Small body</p>
              <p className="text-xs">text-xs — Caption</p>
            </div>
          </Section>

          {/* Button */}
          <Section title="Button">
            <div className="grid gap-4">
              <Row label="Variants">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </Row>
              <Row label="Sizes">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </Row>
              <Row label="With icon">
                <Button leadingIcon={<Download />}>Download</Button>
                <Button variant="secondary" leadingIcon={<Upload />}>Upload</Button>
              </Row>
              <Row label="States">
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
              </Row>
            </div>
          </Section>

          {/* Badge */}
          <Section title="Badge">
            <div className="grid gap-4">
              <Row label="Variants">
                <Badge variant="neutral">Neutral</Badge>
                <Badge variant="accent">Accent</Badge>
                <Badge variant="positive">Positive</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
              </Row>
              <Row label="Sizes">
                <Badge variant="accent" size="sm">Small</Badge>
                <Badge variant="accent" size="md">Medium</Badge>
              </Row>
            </div>
          </Section>

          {/* Avatar */}
          <Section title="Avatar">
            <Row label="Sizes">
              <Avatar name="SC" size="xs" />
              <Avatar name="SC" size="sm" />
              <Avatar name="SC" size="md" />
              <Avatar name="SC" size="lg" />
              <Avatar name="SC" size="xl" />
            </Row>
          </Section>

          {/* Chip */}
          <Section title="Chip">
            <Row>
              <Chip variant="default">Default</Chip>
              <Chip variant="accent">Accent</Chip>
              <Chip variant="positive">Positive</Chip>
              <Chip variant="warning">Warning</Chip>
              <Chip variant="danger">Danger</Chip>
            </Row>
          </Section>

          {/* Divider */}
          <Section title="Divider">
            <Divider />
          </Section>

          {/* Card */}
          <Section title="Card">
            <Card className="p-4">
              <p className="text-sm font-semibold text-ink">Card title</p>
              <p className="mt-1 text-sm text-ink-muted">Card content goes here.</p>
            </Card>
          </Section>

          {/* StatCard */}
          <Section title="StatCard">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Credits" value="247" icon={<Sparkles />} />
              <StatCard label="Resumes" value="12" delta={{ value: 8, direction: 'up' }} />
              <StatCard label="Interviews" value="5" delta={{ value: 3, direction: 'down' }} />
            </div>
          </Section>

          {/* ProgressBar */}
          <Section title="ProgressBar">
            <div className="grid gap-4">
              <ProgressBar value={72} label="Credits used" showValue color="accent" />
              <ProgressBar value={90} label="Almost full" showValue color="warning" />
              <ProgressBar value={100} label="Complete" showValue color="positive" />
            </div>
          </Section>

          {/* Skeleton */}
          <Section title="Skeleton">
            <div className="grid gap-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Section>

          {/* Spinner */}
          <Section title="Spinner">
            <Row>
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </Row>
          </Section>

          {/* StepIndicator */}
          <Section title="StepIndicator">
            <StepIndicator steps={stepItems} />
          </Section>

          {/* Breadcrumbs */}
          <Section title="Breadcrumbs">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/v3' },
                { label: 'Documents', href: '/v3/documents' },
                { label: 'Add', current: true },
              ]}
            />
          </Section>

          {/* Tabs */}
          <Section title="Tabs">
            <Tabs defaultValue="chat">
              <TabsList>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="create">Create</TabsTrigger>
                <TabsTrigger value="template">Template</TabsTrigger>
              </TabsList>
              <TabsContent value="chat">
                <p className="p-4 text-sm text-ink-muted">Chat panel content.</p>
              </TabsContent>
              <TabsContent value="create">
                <p className="p-4 text-sm text-ink-muted">Create panel content.</p>
              </TabsContent>
              <TabsContent value="template">
                <p className="p-4 text-sm text-ink-muted">Template gallery content.</p>
              </TabsContent>
            </Tabs>
          </Section>

          {/* Form Controls */}
          <Section title="Form Controls">
            <div className="grid gap-4">
              <Row label="Text field">
                <div className="w-72">
                  <TextField id="demo-name" label="Full name" placeholder="Enter your name" />
                </div>
              </Row>
              <Row label="Text field with error">
                <div className="w-72">
                  <TextField id="demo-email" label="Email" error="Please enter a valid email address" />
                </div>
              </Row>
              <Row label="Select field">
                <div className="w-72">
                  <SelectField id="demo-plan" label="Plan" options={selectOptions} />
                </div>
              </Row>
              <Row label="Search input">
                <div className="w-72">
                  <SearchInput value={searchValue} onClear={() => setSearchValue('')} onChange={(e) => setSearchValue(e.target.value)} placeholder="Search components..." />
                </div>
              </Row>
              <Row label="Switch">
                <Switch checked={switchOn} onCheckedChange={setSwitchOn} label="Enable notifications" />
              </Row>
              <Row label="Checkbox">
                <Checkbox checked={checkboxChecked} onCheckedChange={(v) => setCheckboxChecked(v === true)} label="I agree to the terms" />
              </Row>
              <Row label="Radio group">
                <RadioGroup value={radioValue} onValueChange={setRadioValue} label="Select plan">
                  <RadioGroupItem value="starter" itemLabel="Starter" />
                  <RadioGroupItem value="pro" itemLabel="Pro" />
                  <RadioGroupItem value="premium" itemLabel="Premium" />
                </RadioGroup>
              </Row>
            </div>
          </Section>

          {/* Tooltip */}
          <Section title="Tooltip">
            <Tooltip>
              <TooltipTrigger render={<Button variant="secondary">Hover me</Button>} />
              <TooltipContent>This is a tooltip</TooltipContent>
            </Tooltip>
          </Section>

          {/* Dialog */}
          <Section title="Dialog">
            <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogPopup>
                <DialogTitle>Confirm action</DialogTitle>
                <DialogDescription>
                  Are you sure you want to proceed?
                </DialogDescription>
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => { setDialogOpen(false); toast.success('Confirmed!') }}>Confirm</Button>
                </div>
                <DialogClose />
              </DialogPopup>
            </Dialog>
          </Section>

          {/* Toast */}
          <Section title="Toast">
            <Row>
              <Button variant="secondary" onClick={() => toast.success('Success!')}>Success</Button>
              <Button variant="secondary" onClick={() => toast.error('Error occurred')}>Error</Button>
              <Button variant="secondary" onClick={() => toast.info('Info')}>Info</Button>
              <Button variant="secondary" onClick={() => toast.warning('Warning!')}>Warning</Button>
            </Row>
          </Section>

          {/* DataTable */}
          <Section title="DataTable">
            <DataTable
              title="Users"
              columns={demoColumns}
              rows={demoRows}
              itemLabel={(r) => r.name}
              pagination={{ page: 1, totalPages: 3, totalItems: 25, pageSize: 10 }}
              onPageChange={() => {}}
            />
          </Section>

          {/* EmptyState */}
          <Section title="EmptyState">
            <EmptyState
              icon={<FileText />}
              title="No documents yet"
              description="Add context documents to help AI understand your background."
              action={<Button>Add Document</Button>}
            />
          </Section>

          {/* ThemeSwitch */}
          <Section title="ThemeSwitch">
            <Row label="Toggle theme">
              <ThemeSwitch />
              <ThemeSwitch size="sm" />
            </Row>
          </Section>

          {/* Separator */}
          <Section title="Separator">
            <div className="grid gap-4">
              <p className="text-sm text-ink-muted">Content above</p>
              <Separator />
              <p className="text-sm text-ink-muted">Content below</p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-ink-muted">Left</span>
                <Separator orientation="vertical" className="h-6" />
                <span className="text-sm text-ink-muted">Right</span>
              </div>
            </div>
          </Section>

          {/* Slider */}
          <Section title="Slider">
            <div className="grid gap-6">
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                min={0}
                max={100}
                label="Volume"
                showValue
              />
              <Slider
                defaultValue={[50]}
                min={0}
                max={100}
                label="Price range"
                minLabel="$0"
                maxLabel="$100"
              />
            </div>
          </Section>

          {/* Accordion */}
          <Section title="Accordion">
            <Accordion defaultValue={['item-1']}>
              <AccordionItem value="item-1">
                <AccordionHeader>
                  <AccordionTrigger>What is Lightforth?</AccordionTrigger>
                </AccordionHeader>
                <AccordionPanel>
                  Lightforth is an AI-powered career platform that helps you build resumes, prepare for interviews, and auto-apply to jobs.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionHeader>
                  <AccordionTrigger>How does the copilot work?</AccordionTrigger>
                </AccordionHeader>
                <AccordionPanel>
                  The copilot guides you through interview prep, live coding exercises, and meeting preparation with real-time AI assistance.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionHeader>
                  <AccordionTrigger>What plans are available?</AccordionTrigger>
                </AccordionHeader>
                <AccordionPanel>
                  We offer Free, Pro, and Business plans with different credit allocations and feature access levels.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Section>

          {/* Collapsible */}
          <Section title="Collapsible">
            <Collapsible>
              <CollapsibleTrigger render={<button className="flex items-center gap-2 text-sm font-medium text-ink hover:text-accent" />}>
                <ChevronRight className="size-4 transition-transform [[data-open]&]:rotate-90" />
                Show details
              </CollapsibleTrigger>
              <CollapsiblePanel>
                <div className="mt-2 rounded-lg bg-surface-subtle p-4 text-sm text-ink-muted">
                  This is the collapsible content. It can contain anything — text, forms, other components.
                </div>
              </CollapsiblePanel>
            </Collapsible>
          </Section>

          {/* Popover */}
          <Section title="Popover">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger render={<Button variant="secondary">Open Popover</Button>} />
              <PopoverContent side="bottom">
                <div className="grid gap-2">
                  <p className="text-sm font-medium text-ink">Quick actions</p>
                  <p className="text-sm text-ink-muted">This is a popover with some content and actions.</p>
                  <Button size="sm" onClick={() => setPopoverOpen(false)}>Got it</Button>
                </div>
              </PopoverContent>
            </Popover>
          </Section>

          {/* Menu (Dropdown) */}
          <Section title="Menu (Dropdown)">
            <DropdownMenu>
              <MenuTrigger render={<Button variant="secondary">Open Menu</Button>} />
              <MenuContent align="start">
                <MenuItem icon={<Home />}>Dashboard</MenuItem>
                <MenuItem icon={<BarChart3 />}>Analytics</MenuItem>
                <MenuItem icon={<Settings />}>Settings</MenuItem>
                <MenuSeparator />
                <MenuItem variant="danger">Sign out</MenuItem>
              </MenuContent>
            </DropdownMenu>
          </Section>

          {/* ScrollArea */}
          <Section title="ScrollArea">
            <ScrollArea className="h-40 w-full rounded-lg border border-border">
              <div className="grid gap-3 p-4">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg bg-surface-subtle p-3">
                    <Avatar name={`U${i + 1}`} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-ink">User {i + 1}</p>
                      <p className="text-xs text-ink-muted">user{i + 1}@example.com</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Section>

          {/* Sheet (Drawer) */}
          <Section title="Sheet (Drawer)">
            <Button onClick={() => setSheetOpen(true)}>Open Sheet</Button>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetContent side="right">
                <SheetTitle>Settings</SheetTitle>
                <div className="mt-4 grid gap-4">
                  <TextField id="sheet-name" label="Name" placeholder="Enter your name" />
                  <TextField id="sheet-email" label="Email" placeholder="Enter your email" />
                  <div className="flex justify-end gap-3 pt-4">
                    <SheetClose render={<Button variant="secondary" />}>Cancel</SheetClose>
                    <Button onClick={() => { setSheetOpen(false); toast.success('Saved!') }}>Save</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </Section>

          {/* Navigator */}
          <Section title="Navigator">
            <div className="overflow-hidden rounded-lg border border-border">
              <Navigator
                logo={<span className="text-lg font-bold text-ink">LF</span>}
                items={[
                  { id: 'home', label: 'Home', icon: <Home />, href: '#', active: true },
                  { id: 'analytics', label: 'Analytics', icon: <BarChart3 />, href: '#' },
                  { id: 'settings', label: 'Settings', icon: <Settings />, href: '#' },
                ]}
                footer={<p className="text-xs text-muted">v1.0.0</p>}
              />
            </div>
          </Section>

          {/* === COMPOSITE PATTERNS === */}

          {/* Chat Bubbles */}
          <Section title="Chat Bubbles">
            <div className="grid gap-3">
              <div className="flex justify-end">
                <div className="max-w-xs rounded-2xl rounded-ee-sm bg-accent px-4 py-2.5 text-sm text-on-accent">
                  Can you tailor my resume for a senior PM role at Google?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-sm rounded-2xl rounded-ss-sm bg-surface-subtle px-4 py-2.5 text-sm text-ink">
                  I've tailored your resume to match the job description — review the highlighted changes below and accept or reject them.
                </div>
              </div>
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-sm rounded-2xl rounded-ss-sm bg-surface-subtle px-4 py-2.5 text-sm text-ink">
                  <LightforthAiIcon className="mt-0.5 size-4 shrink-0" />
                  <span>The AI assistant icon appears on assistant messages for brand recognition.</span>
                </div>
              </div>
            </div>
          </Section>

          {/* Typing Indicator */}
          <Section title="Typing Indicator">
            <div className="grid gap-3">
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-ss-sm bg-surface-subtle px-4 py-3">
                  <span className="text-xs text-ink-muted">Thinking</span>
                  <span className="flex gap-1">
                    <span className="inline-block size-1.5 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="inline-block size-1.5 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="inline-block size-1.5 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-ss-sm bg-accent/40 px-4 py-3">
                  <span className="text-xs text-ink">Recording answer</span>
                  <span className="flex gap-1">
                    <span className="inline-block size-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="inline-block size-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="inline-block size-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            </div>
          </Section>

          {/* Walkthrough / Coach Mark */}
          <Section title="Walkthrough">
            <p className="mb-3 text-sm text-ink-muted">Positioned tooltip that targets a specific element by ID. Dark background, arrow, title, body, action button, dismiss.</p>
            <div className="relative inline-block">
              <Button id="walkthrough-demo-target">Target Element</Button>
              <div className="absolute start-full top-0 z-20 ms-4 w-64 rounded-xl bg-live-header p-4 text-brand-bar-text shadow-panel">
                <span className="absolute -start-1.5 top-6 size-3 rotate-45 bg-live-header" />
                <button type="button" className="absolute end-2 top-2 rounded p-1 text-brand-bar-text/60 hover:text-brand-bar-text">
                  <X className="size-3" />
                </button>
                <p className="text-sm font-bold">Keep refining</p>
                <p className="mt-1 text-xs leading-relaxed text-brand-bar-text/80">Ask for more rewrites, accept the changes, or keep editing.</p>
                <button type="button" className="mt-3 inline-flex min-h-7 items-center rounded-lg bg-white px-3 text-xs font-semibold text-live-header">Got it</button>
              </div>
            </div>
          </Section>

          {/* Hover Cards */}
          <Section title="Hover Cards">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="group rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent-subtle hover:shadow-panel cursor-pointer">
                <div className="size-10 rounded-lg bg-accent-subtle text-accent flex items-center justify-center transition-transform group-hover:scale-110"><Sparkles className="size-5" /></div>
                <p className="mt-3 text-sm font-semibold text-ink">Resume Builder</p>
                <p className="mt-1 text-xs text-ink-muted">Build and tailor your resume for any job.</p>
              </div>
              <div className="group rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent-subtle hover:shadow-panel cursor-pointer">
                <div className="size-10 rounded-lg bg-accent-subtle text-accent flex items-center justify-center transition-transform group-hover:scale-110"><Bot className="size-5" /></div>
                <p className="mt-3 text-sm font-semibold text-ink">Interview Copilot</p>
                <p className="mt-1 text-xs text-ink-muted">Real-time AI assistance during interviews.</p>
              </div>
              <div className="group rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent-subtle hover:shadow-panel cursor-pointer">
                <div className="size-10 rounded-lg bg-accent-subtle text-accent flex items-center justify-center transition-transform group-hover:scale-110"><Zap className="size-5" /></div>
                <p className="mt-3 text-sm font-semibold text-ink">Auto Apply</p>
                <p className="mt-1 text-xs text-ink-muted">Automatically apply to matching jobs.</p>
              </div>
            </div>
          </Section>

          {/* Prompt Chips */}
          <Section title="Prompt Chips">
            <p className="mb-3 text-sm text-ink-muted">Scrollable horizontal chips with overflow fade. Used in chat empty states.</p>
            <div className="relative">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {['Add metrics to highlights', 'Expand skills with keywords', 'Tailor for product manager', 'Add quantified results'].map((prompt) => (
                  <button key={prompt} className="shrink-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink transition-colors hover:bg-surface-subtle hover:text-accent">{prompt}</button>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 end-0 w-12 bg-gradient-to-l from-surface to-transparent" />
            </div>
          </Section>

          {/* AI Suggestion */}
          <Section title="AI Suggestion">
            <p className="mb-3 text-sm text-ink-muted">Gradient text button with AI icon, and accept/reject pill buttons for pending changes.</p>
            <div className="grid gap-4">
              <Row label="AI suggestion trigger">
                <button className="inline-flex items-center gap-1.5 bg-gradient-to-r from-accent to-[#7c3aed] bg-clip-text text-sm font-bold text-transparent transition-opacity hover:opacity-80">
                  <LightforthAiIcon className="size-4" />
                  AI Suggest
                </button>
              </Row>
              <Row label="Accept / Reject pills">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
                  <button className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-3 py-1 text-xs font-semibold text-ink transition-colors hover:bg-positive-surface hover:text-positive">
                    <Check className="size-3" /> Accept All
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-3 py-1 text-xs font-semibold text-ink transition-colors hover:bg-danger-surface hover:text-danger">
                    <X className="size-3" /> Reject All
                  </button>
                </div>
              </Row>
              <Row label="Change count badge">
                <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent-subtle px-2 py-0.5 text-[10px] font-bold text-accent-text">
                  <LightforthAiIcon className="size-3" /> 3 changes
                </span>
              </Row>
            </div>
          </Section>

          {/* Accept / Reject Controls */}
          <Section title="Accept / Reject">
            <p className="mb-3 text-sm text-ink-muted">Floating inline controls for accepting or rejecting AI-suggested resume changes.</p>
            <div className="relative rounded-xl border border-border bg-surface p-6">
              <p className="text-sm text-ink">Professional Summary — original text appears here with changes highlighted.</p>
              <div className="absolute end-3 top-3 flex gap-2">
                <button className="grid size-8 place-items-center rounded-full bg-positive text-white shadow-lg transition-colors hover:bg-positive/90"><Check className="size-4" /></button>
                <button className="grid size-8 place-items-center rounded-full border border-border bg-surface text-ink shadow-lg transition-colors hover:bg-danger-surface hover:text-danger"><X className="size-4" /></button>
              </div>
            </div>
          </Section>

          {/* Credit Card */}
          <Section title="Credit Card">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface p-5 shadow-panel">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Credits remaining</p>
                <p className="mt-2 text-3xl font-bold text-ink">247<span className="text-lg text-ink-muted"> / 300</span></p>
                <div className="mt-3 h-2 overflow-hidden rounded-pill bg-surface-subtle">
                  <div className="h-full rounded-pill bg-accent transition-[width]" style={{ width: '82%' }} />
                </div>
                <p className="mt-2 text-xs text-ink-muted">Resets Dec 1, 2026</p>
                <button className="mt-3 text-xs font-semibold text-accent hover:text-accent-hover">View usage details</button>
              </div>
              <div className="rounded-xl border border-danger/30 bg-danger-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-danger">Low credits</p>
                <p className="mt-2 text-3xl font-bold text-danger">3<span className="text-lg text-danger/70"> / 300</span></p>
                <div className="mt-3 h-2 overflow-hidden rounded-pill bg-danger/20">
                  <div className="h-full rounded-pill bg-danger transition-[width]" style={{ width: '1%' }} />
                </div>
                <button className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-danger hover:text-danger/80">
                  Upgrade to Pro <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          </Section>

          {/* Upload Zone */}
          <Section title="Upload Zone">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-surface-subtle/50 p-8 text-center transition-colors hover:border-accent/50 hover:bg-accent-subtle/30">
                <div className="size-12 rounded-full bg-accent-subtle text-accent flex items-center justify-center"><Upload className="size-5" /></div>
                <div>
                  <p className="text-sm font-semibold text-ink">Drop your resume here</p>
                  <p className="mt-1 text-xs text-ink-muted">PDF, DOCX up to 10MB</p>
                </div>
                <button className="text-xs font-semibold text-accent hover:text-accent-hover">Browse file</button>
              </div>
              <div className="rounded-xl border border-border bg-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Uploaded file</p>
                <div className="mt-2 flex items-center gap-3 rounded-lg bg-surface-subtle p-3">
                  <FileText className="size-5 text-danger" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-ink">resume_damola_adewale.pdf</p>
                    <p className="text-xs text-ink-muted">2.4 MB</p>
                  </div>
                  <CheckCircle2 className="size-4 text-positive" />
                </div>
              </div>
            </div>
          </Section>

          {/* Avatar Group */}
          <Section title="Avatar Group">
            <div className="grid gap-4">
              <Row label="Stacked avatars">
                <div className="flex -space-x-2">
                  <Avatar name="Sarah Chen" size="sm" className="ring-2 ring-surface" />
                  <Avatar name="Marcus J" size="sm" className="ring-2 ring-surface" />
                  <Avatar name="Priya P" size="sm" className="ring-2 ring-surface" />
                  <Avatar name="Alex W" size="sm" className="ring-2 ring-surface" />
                  <div className="flex size-8 items-center justify-center rounded-full bg-surface-subtle text-xs font-semibold text-ink-muted ring-2 ring-surface">+5</div>
                </div>
              </Row>
              <Row label="With status badge">
                <div className="relative">
                  <Avatar name="Sarah Chen" size="md" />
                  <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-surface bg-positive" />
                </div>
                <div className="relative">
                  <Avatar name="Marcus J" size="md" />
                  <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-surface bg-warning" />
                </div>
              </Row>
            </div>
          </Section>

          {/* Banner */}
          <Section title="Banner">
            <div className="grid gap-3">
              <div role="status" className="flex min-h-9 items-center gap-1 rounded-b-xl bg-accent-subtle ps-6 pe-3 text-sm font-semibold text-accent shadow-control">
                <p className="min-w-0 flex-1 truncate leading-6">5 More credits left!</p>
                <a href="#billing" className="shrink-0 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Upgrade</a>
                <button type="button" aria-label="Dismiss" className="grid size-6 shrink-0 place-items-center rounded-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><X className="size-4" /></button>
              </div>
              <div role="status" className="flex min-h-9 items-center gap-1 rounded-b-xl bg-danger ps-6 pe-3 text-sm font-semibold text-on-danger shadow-control">
                <p className="min-w-0 flex-1 truncate leading-6">0 credits remaining today</p>
                <a href="#billing" className="shrink-0 underline underline-offset-2 text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Upgrade</a>
                <button type="button" aria-label="Dismiss" className="grid size-6 shrink-0 place-items-center rounded-soft text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"><X className="size-4" /></button>
              </div>
            </div>
          </Section>

          {/* Pricing Card */}
          <Section title="Pricing Card">
            <div className="rounded-panel bg-surface p-4 shadow-panel">
              <div className="grid gap-4 md:grid-cols-3">
                <article className="flex flex-col rounded-panel border border-border bg-surface p-6">
                  <div className="flex min-h-8 items-center gap-2 border-b border-border pb-4">
                    <h3 className="text-lg font-semibold text-ink">Starter</h3>
                  </div>
                  <div className="flex flex-1 flex-col pt-5">
                    <div className="flex flex-wrap items-end gap-1">
                      <span className="text-4xl font-semibold leading-tight text-ink">$27</span>
                      <span className="pb-2 text-sm font-medium text-ink">per month</span>
                    </div>
                    <p className="mt-5 text-sm font-semibold text-ink">15 Credits</p>
                    <p className="mt-3 text-sm leading-5 text-ink-muted">You can do up to 15 total actions per month, in any combination.</p>
                    <div className="mt-6">
                      <Button variant="secondary" className="w-full">Subscribe</Button>
                    </div>
                    <ul className="mt-6 grid gap-2 text-sm leading-5 text-ink-muted">
                      <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> Resume builder</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> Resume downloads</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> AI suggestions</li>
                    </ul>
                    <p className="mt-3 text-sm italic leading-5 text-ink-muted">Ideal for light or occasional job applications</p>
                  </div>
                </article>
                <article className="flex flex-col rounded-panel border border-border bg-accent-subtle p-6">
                  <div className="flex min-h-8 items-center gap-2 border-b border-border pb-4">
                    <h3 className="text-lg font-semibold text-ink">Pro</h3>
                    <Badge>Popular</Badge>
                  </div>
                  <div className="flex flex-1 flex-col pt-5">
                    <div className="flex flex-wrap items-end gap-1">
                      <span className="text-4xl font-semibold leading-tight text-ink">$49</span>
                      <span className="pb-2 text-sm font-medium text-ink">per month</span>
                    </div>
                    <p className="mt-5 text-sm font-semibold text-ink">50 Credits</p>
                    <p className="mt-3 text-sm leading-5 text-ink-muted">More credits, more freedom. Every feature still costs 1 credit per use.</p>
                    <div className="mt-6">
                      <Button className="w-full">Subscribe</Button>
                    </div>
                    <ul className="mt-6 grid gap-2 text-sm leading-5 text-ink-muted">
                      <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> Everything in Starter</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> Auto-Apply agents</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> AI interview prep</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> Interview & Coding Copilot</li>
                    </ul>
                    <p className="mt-3 text-sm italic leading-5 text-ink-muted">Best for users who want AI and autopilot help consistently</p>
                  </div>
                </article>
                <article className="flex flex-col rounded-panel border border-border bg-surface p-6">
                  <div className="flex min-h-8 items-center gap-2 border-b border-border pb-4">
                    <h3 className="text-lg font-semibold text-ink">Premium</h3>
                  </div>
                  <div className="flex flex-1 flex-col pt-5">
                    <div className="flex flex-wrap items-end gap-1">
                      <span className="text-4xl font-semibold leading-tight text-ink">$79</span>
                      <span className="pb-2 text-sm font-medium text-ink">per month</span>
                    </div>
                    <p className="mt-5 text-sm font-semibold text-ink">100 Credits</p>
                    <p className="mt-3 text-sm leading-5 text-ink-muted">Built for power users who apply daily or want maximum automation.</p>
                    <div className="mt-6">
                      <Button variant="secondary" className="w-full">Subscribe</Button>
                    </div>
                    <ul className="mt-6 grid gap-2 text-sm leading-5 text-ink-muted">
                      <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> Everything in Pro</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> Meeting Copilot</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> Automate job applications</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> Priority support</li>
                    </ul>
                    <p className="mt-3 text-sm italic leading-5 text-ink-muted">Best value for serious job hunters</p>
                  </div>
                </article>
              </div>
              <p className="mt-4 rounded-b-panel border border-warning bg-warning-surface px-4 py-3 text-sm text-warning">
                Every feature uses 1 credit. Use your credits however you like.
              </p>
            </div>
          </Section>

          {/* Status Badges */}
          <Section title="Status Badges">
            <div className="grid gap-4">
              <Row label="With icons">
                <span className="inline-flex items-center gap-1 rounded-full bg-positive-surface px-2.5 py-1 text-[11px] font-semibold text-positive"><CheckCircle2 className="size-3" /> Active</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-warning-surface px-2.5 py-1 text-[11px] font-semibold text-warning"><AlertTriangle className="size-3" /> Pending</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-danger-surface px-2.5 py-1 text-[11px] font-semibold text-danger"><XCircle className="size-3" /> Rejected</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-2.5 py-1 text-[11px] font-semibold text-ink-muted"><FileText className="size-3" /> Draft</span>
              </Row>
              <Row label="Notification dot">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-subtle px-3 py-1 text-xs font-semibold text-accent-text">
                  <span className="size-1.5 rounded-full bg-accent" /> New feature
                </span>
              </Row>
              <Row label="Step completion">
                <div className="flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-full bg-positive-surface text-xs font-bold text-positive"><Check className="size-3.5" /></span>
                  <span className="text-sm text-ink">Step completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-full bg-accent text-xs font-bold text-on-accent">2</span>
                  <span className="text-sm text-ink">Current step</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-full bg-surface-subtle text-xs font-bold text-ink-muted">3</span>
                  <span className="text-sm text-ink-muted">Upcoming</span>
                </div>
              </Row>
            </div>
          </Section>

          {/* Skeleton Patterns */}
          <Section title="Skeleton Patterns">
            <div className="grid gap-6">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Card skeleton</p>
                <div className="rounded-xl border border-border bg-surface p-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="mt-3 h-3 w-full" />
                  <Skeleton className="mt-1.5 h-3 w-3/4" />
                  <div className="mt-4 flex gap-2">
                    <Skeleton className="h-8 w-20 rounded-lg" />
                    <Skeleton className="h-8 w-20 rounded-lg" />
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Table rows</p>
                <div className="rounded-xl border border-border bg-surface overflow-hidden">
                  <div className="flex gap-4 border-b border-border px-4 py-3">
                    <Skeleton className="h-3 w-24" /><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-12" />
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 border-b border-border px-4 py-3 last:border-0">
                      <Skeleton className="h-3 w-28" style={{ animationDelay: `${i * 100}ms` }} /><Skeleton className="h-3 w-16" style={{ animationDelay: `${i * 100 + 50}ms` }} /><Skeleton className="h-3 w-12" style={{ animationDelay: `${i * 100 + 100}ms` }} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Chat skeleton</p>
                <div className="grid gap-3">
                  <div className="flex justify-end"><Skeleton className="h-10 w-48 rounded-2xl rounded-ee-sm" /></div>
                  <div className="flex justify-start"><Skeleton className="h-16 w-64 rounded-2xl rounded-ss-sm" /></div>
                  <div className="flex justify-end"><Skeleton className="h-12 w-40 rounded-2xl rounded-ee-sm" /></div>
                </div>
              </div>
            </div>
          </Section>

          {/* Typewriter */}
          <Section title="Typewriter">
            <p className="mb-3 text-sm text-ink-muted">Text that types character by character. Respects prefers-reduced-motion.</p>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-sm text-ink">We are looking for a motivated and detail-oriented professional to join our growing team. In this role, you will collaborate with cross-functional teams to drive projects from conception to delivery.<span className="inline-block h-3.5 w-px animate-pulse bg-accent-text align-middle" /></p>
            </div>
            <p className="mt-2 text-xs text-ink-muted">{'Use the useTypewriter hook: const { type, isTyping } = useTypewriter()'}</p>
          </Section>
        </div>
      </div>
    </main>
    </div>
  )
}
