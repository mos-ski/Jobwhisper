import { useState } from 'react'
import { Edit3, Eye, EyeOff, FileText, Plus, Search, Trash2 } from 'lucide-react'

import type { KBArticle, KBCategory } from '@/contracts/support-chat'
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
  EmptyState,
  SelectField,
  StatCard,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type DataTableColumn,
  type BadgeVariant,
} from '@/ui'

import { AdminShell } from './admin-shell'

export type AdminKBViewProps = {
  readonly user: UserIdentity
  readonly navItems: readonly AdminNavItem[]
  readonly notifications: readonly AdminNotification[]
  readonly searchResults: readonly AdminSearchResult[]
  readonly articles: readonly KBArticle[]
  readonly categories: readonly KBCategory[]
  readonly isLoading?: boolean
  readonly errorMessage?: string
  readonly onRetry?: () => void
}

export function AdminKBView({
  user,
  navItems,
  notifications,
  searchResults,
  articles,
  categories,
  isLoading = false,
  errorMessage,
  onRetry,
}: AdminKBViewProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [editArticle, setEditArticle] = useState<KBArticle | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [deleteArticle, setDeleteArticle] = useState<KBArticle | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const filtered = articles.filter((a) => {
    const matchesSearch = a.question.toLowerCase().includes(search.toLowerCase()) || a.answer.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const publishedCount = articles.filter((a) => a.isPublished).length
  const draftCount = articles.filter((a) => !a.isPublished).length

  const columns: readonly DataTableColumn<KBArticle>[] = [
    {
      key: 'question',
      header: 'Question',
      render: (article) => (
        <span className="font-medium text-ink">{article.question}</span>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (article) => {
        const cat = categories.find((c) => c.id === article.category)
        return (
          <Badge variant="neutral">{cat?.label ?? article.category}</Badge>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (article) => (
        <Badge variant={article.isPublished ? 'positive' : 'neutral'}>
          {article.isPublished ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      render: (article) => (
        <span className="text-sm text-ink-muted">{article.updatedAtLabel}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (article) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => { setEditArticle(article); setIsEditOpen(true) }}
            aria-label={`Edit ${article.question}`}
            className="grid size-8 place-items-center rounded-soft text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <Edit3 aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => { setDeleteArticle(article); setIsDeleteOpen(true) }}
            aria-label={`Delete ${article.question}`}
            className="grid size-8 place-items-center rounded-soft text-danger transition-colors hover:bg-danger-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <Trash2 aria-hidden="true" className="size-4" />
          </button>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <AdminShell
        user={user}
        navItems={navItems}
        notifications={notifications}
        searchResults={searchResults}
        activeModule={'support' as AdminModuleId}
      >
        <div className="px-4 py-10 sm:px-6 sm:py-12 lg:px-16 lg:py-20">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="h-8 w-48 animate-pulse rounded bg-surface-subtle" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-panel bg-surface-subtle" />
              ))}
            </div>
            <div className="h-96 animate-pulse rounded-panel bg-surface-subtle" />
          </div>
        </div>
      </AdminShell>
    )
  }

  if (errorMessage) {
    return (
      <AdminShell
        user={user}
        navItems={navItems}
        notifications={notifications}
        searchResults={searchResults}
        activeModule={'support' as AdminModuleId}
      >
        <div className="px-4 py-10 sm:px-6 sm:py-12 lg:px-16 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <EmptyState
              title="Something went wrong"
              description={errorMessage}
              action={onRetry ? <Button onClick={onRetry}>Try again</Button> : undefined}
            />
          </div>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell
      user={user}
      navItems={navItems}
      notifications={notifications}
      searchResults={searchResults}
      activeModule={'support' as AdminModuleId}
    >
      <div className="px-4 py-10 sm:px-6 sm:py-12 lg:px-16 lg:py-20">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-gowun text-xl font-semibold text-ink sm:text-2xl">Knowledge Base</h1>
              <p className="mt-1 text-sm text-ink-muted">Manage help articles for the support bot and help center.</p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus aria-hidden="true" className="size-4" />
              New article
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Total articles"
              value={articles.length}
              description="Across all categories"
            />
            <StatCard
              label="Published"
              value={publishedCount}
              description="Visible to users"
            />
            <StatCard
              label="Drafts"
              value={draftCount}
              description="Not yet published"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                aria-label="Search articles"
                className="w-full rounded-lg border border-border bg-surface py-2 pe-3 ps-9 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <SelectField
              id="kb-category-filter"
              label="Category"
              value={categoryFilter}
              onValueChange={setCategoryFilter}
              options={[
                { value: 'all', label: 'All categories' },
                ...categories.map((c) => ({ value: c.id, label: `${c.label} (${c.count})` })),
              ]}
              className="w-48"
            />
            <p className="ms-auto text-sm text-ink-muted">{filtered.length} of {articles.length} shown</p>
          </div>

          {/* Table */}
          <DataTable
            rows={filtered}
            columns={columns}
            emptyTitle="No articles yet"
            emptyDescription="Create your first knowledge base article to help the support bot answer questions."
          />
        </div>
      </div>

      {/* ── Edit Dialog ── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogPopup className="sm:max-w-2xl">
          <DialogTitle>Edit article</DialogTitle>
          <DialogDescription>Update the question, answer, or category for this knowledge base entry.</DialogDescription>
          {editArticle && (
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="edit-question" className="mb-1 block text-xs font-medium text-ink-muted">Question</label>
                <input
                  id="edit-question"
                  type="text"
                  defaultValue={editArticle.question}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="edit-answer" className="mb-1 block text-xs font-medium text-ink-muted">Answer</label>
                <textarea
                  id="edit-answer"
                  defaultValue={editArticle.answer}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="edit-category" className="mb-1 block text-xs font-medium text-ink-muted">Category</label>
                <select
                  id="edit-category"
                  defaultValue={editArticle.category}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="edit-published"
                  type="checkbox"
                  defaultChecked={editArticle.isPublished}
                  className="size-4 rounded border-border text-accent focus:ring-accent"
                />
                <label htmlFor="edit-published" className="text-sm text-ink">Published</label>
              </div>
            </div>
          )}
          <div className="mt-6 flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Save changes</Button>
            </DialogClose>
          </div>
        </DialogPopup>
      </Dialog>

      {/* ── Create Dialog ── */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogPopup className="sm:max-w-2xl">
          <DialogTitle>New article</DialogTitle>
          <DialogDescription>Add a new knowledge base entry for the support bot.</DialogDescription>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="create-question" className="mb-1 block text-xs font-medium text-ink-muted">Question</label>
              <input
                id="create-question"
                type="text"
                placeholder="e.g. How do I reset my password?"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label htmlFor="create-answer" className="mb-1 block text-xs font-medium text-ink-muted">Answer</label>
              <textarea
                id="create-answer"
                placeholder="Write a clear, helpful answer..."
                rows={4}
                className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label htmlFor="create-category" className="mb-1 block text-xs font-medium text-ink-muted">Category</label>
              <select
                id="create-category"
                defaultValue="getting-started"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Create article</Button>
            </DialogClose>
          </div>
        </DialogPopup>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogPopup className="sm:max-w-lg">
          <DialogTitle>Delete article</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{deleteArticle?.question}"? This action cannot be undone.
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="danger">Delete</Button>
            </DialogClose>
          </div>
        </DialogPopup>
      </Dialog>
    </AdminShell>
  )
}
