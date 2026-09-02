import { Download, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

import type { ContextDocumentRow } from '@/contracts/documents.draft'
import { cn, DataTable, FormPanel, FormPanelFooter, FormTextArea, Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger, OptionStack, ShellBar, UpgradeDialog } from '@/ui'

export type DocumentsViewProps = {
  readonly homeHref: string
  readonly addHref: string
  readonly rows: readonly ContextDocumentRow[]
  /** Knowledge Base document cap for the current plan — Starter 3 / Pro 5 / Premium 10. See PRICING.md §1.1. */
  readonly limit: number
  readonly planName: string
}

export type DocumentsAddViewProps = {
  readonly homeHref: string
  readonly documentsHref: string
  readonly manualHref: string
}

export type DocumentsManualViewProps = {
  readonly homeHref: string
  readonly backHref: string
  readonly nextHref: string
}

function RowActionsMenu({ label }: { readonly label: string }) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={label}
        className="grid size-6 place-items-center rounded-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <img aria-hidden="true" src="/v3-assets/figma/table-more.svg" alt="" className="size-4 object-contain" />
      </MenuTrigger>
      <MenuContent>
        <MenuItem icon={<Download aria-hidden="true" />}>Download</MenuItem>
        <MenuItem icon={<Pencil aria-hidden="true" />}>Edit</MenuItem>
        <MenuSeparator />
        <MenuItem variant="danger" icon={<Trash2 aria-hidden="true" />}>Delete</MenuItem>
      </MenuContent>
    </Menu>
  )
}

export function DocumentsView({ homeHref, addHref, rows, limit, planName }: DocumentsViewProps) {
  const atLimit = rows.length >= limit
  const [limitDialogOpen, setLimitDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <ShellBar homeHref={homeHref} current="Knowledge Base" closeHref={homeHref} closeLabel="Close documents" />
      <section className="px-4 py-8 lg:px-12 xl:px-24">
        <p className="mx-auto mb-3 max-w-7xl text-end text-sm text-ink-muted">
          <span className={cn('font-semibold', atLimit ? 'text-warning' : 'text-ink')}>{rows.length}</span> of {limit} documents used &mdash; {planName} plan
        </p>
        <DataTable
          title="Knowledge Base"
          searchLabel="Search documents"
          action={atLimit ? { label: 'Add Document', onClick: () => setLimitDialogOpen(true) } : { label: 'Add Document', href: addHref }}
          rows={rows}
          itemLabel={(row) => row.name}
          className="mx-auto max-w-7xl"
          columns={[
            { key: 'name', label: 'Name', className: 'w-[18rem]', render: (row) => <span className="font-medium">{row.name}</span> },
            {
              key: 'kind',
              label: 'Type',
              className: 'w-[9rem]',
              render: (row) => <span className="rounded-pill bg-surface-subtle px-2.5 py-0.5 text-xs font-bold leading-4 text-ink">{row.kind}</span>,
            },
            { key: 'size-or-url', label: 'Size/URL', className: 'w-[14rem]', render: (row) => row.sizeOrUrl },
            { key: 'added', label: 'Added', className: 'w-[18rem]', render: (row) => row.addedAtLabel },
            {
              key: 'action',
              label: 'Action',
              className: 'w-[5rem]',
              sortable: false,
              hideInMobileDetail: true,
              render: (row) => <RowActionsMenu label={`Open actions for ${row.name}`} />,
            },
          ]}
          rowActions={() => (
            <>
              <button type="button" className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <Download aria-hidden="true" className="size-4" />
                Download
              </button>
              <button type="button" className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <Pencil aria-hidden="true" className="size-4" />
                Edit
              </button>
              <button type="button" className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-danger bg-danger-surface px-4 text-sm font-medium text-danger transition-colors hover:bg-danger/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                <Trash2 aria-hidden="true" className="size-4" />
                Delete
              </button>
            </>
          )}
        />
      </section>
      <UpgradeDialog
        open={limitDialogOpen}
        onOpenChange={setLimitDialogOpen}
        title="Knowledge Base is full"
        message={`Your ${planName} plan includes up to ${limit} Knowledge Base documents. Remove one, or upgrade for more room.`}
        ctaLabel="View plans"
        ctaHref="/v3/billing"
      />
    </div>
  )
}

export function DocumentsAddView({ homeHref, documentsHref, manualHref }: DocumentsAddViewProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <ShellBar homeHref={homeHref} current="Knowledge Base" closeHref={homeHref} closeLabel="Close documents" />
      <section className="px-4 py-9">
        <FormPanel
          title="Add Documents"
          step="1/2"
          footer={<FormPanelFooter backHref={documentsHref} nextHref={documentsHref} nextLabel="Continue" />}
        >
          <OptionStack
            options={[
              { id: 'upload', label: 'Upload Documents', href: documentsHref, iconSrc: '/v3-assets/figma/form-upload.svg', variant: 'primary' },
              { id: 'url', label: 'Scrape from URL', href: documentsHref, iconSrc: '/v3-assets/figma/form-globe.svg' },
              { id: 'manual', label: 'Input Manually', href: manualHref, iconSrc: '/v3-assets/figma/form-pencil.svg' },
            ]}
          />
          <p className="text-xs font-medium leading-5 text-ink-muted">Add a file, webpage, or custom context for Jobwhisper to use across resumes and interviews.</p>
        </FormPanel>
      </section>
    </div>
  )
}

export function DocumentsManualView({ homeHref, backHref, nextHref }: DocumentsManualViewProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <ShellBar homeHref={homeHref} current="Knowledge Base" closeHref={homeHref} closeLabel="Close documents" />
      <section className="px-4 py-9">
        <FormPanel
          title="Input Context Manually"
          step="1/2"
          footer={<FormPanelFooter backHref={backHref} nextHref={nextHref} nextLabel="Save" />}
        >
          <FormTextArea
            id="manual-context"
            label="Paste context"
            placeholder="Paste notes, role requirements, portfolio highlights, or company research here."
          />
        </FormPanel>
      </section>
    </div>
  )
}
