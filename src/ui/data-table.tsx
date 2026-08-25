import { forwardRef, useMemo, useState, type ReactNode } from 'react'
import { Search, Plus, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, FileText, ArrowUpDown, Check, Trash2, Download, Pencil } from 'lucide-react'

import { cn } from './cn'
import { Dialog, DialogClose, DialogPopup, DialogTitle } from './dialog'

export type DataTableSortDirection = 'asc' | 'desc'

export type DataTableColumn<TRow> = {
  readonly key: string
  readonly label: string
  readonly className?: string
  readonly headerClassName?: string
  readonly sortable?: boolean
  readonly sortValue?: (row: TRow) => string | number
  readonly render: (row: TRow) => ReactNode
  /** Omit this column from the mobile row-detail sheet's field list — use for a column whose `render` is a popover/menu (pair with `rowActions` on DataTable instead). */
  readonly hideInMobileDetail?: boolean
}

export type DataTableAction = {
  readonly label: string
  readonly href: string
  readonly icon?: ReactNode
}

export type DataTablePagination = {
  readonly page: number
  readonly totalPages: number
  readonly totalItems: number
  readonly pageSize: number
}

export type DataTableProps<TRow extends { readonly id: string }> = {
  readonly title?: string
  readonly searchLabel?: string
  readonly searchPlaceholder?: string
  readonly searchValue?: string
  readonly onSearchChange?: (value: string) => void
  readonly action?: DataTableAction
  readonly columns: readonly DataTableColumn<TRow>[]
  readonly rows: readonly TRow[]
  readonly itemLabel: (row: TRow) => string
  readonly filterRow?: (row: TRow, query: string) => boolean
  readonly sortColumn?: string
  readonly sortDirection?: DataTableSortDirection
  readonly onSort?: (column: string) => void
  readonly onRowClick?: (row: TRow) => void
  /** Rendered as a labeled button row in the mobile row-detail sheet — use this for row actions instead of a `render` column when they're a popover/menu, since those render behind the sheet's own overlay on mobile. */
  readonly rowActions?: (row: TRow) => ReactNode
  readonly selectedIds?: ReadonlySet<string>
  readonly onSelectionChange?: (ids: ReadonlySet<string>) => void
  readonly loading?: boolean
  readonly pagination?: DataTablePagination
  readonly onPageChange?: (page: number) => void
  readonly className?: string
  readonly minTableWidthClassName?: string
  readonly selectable?: boolean
  readonly bare?: boolean
}

function defaultFilterRow<TRow>(row: TRow, query: string): boolean {
  const lower = query.toLowerCase()
  return Object.values(row).some((val) => String(val).toLowerCase().includes(lower))
}

function SkeletonRow({ colSpan, selectable }: { readonly colSpan: number; readonly selectable: boolean }) {
  return (
    <tr className="border-b border-border">
      {selectable ? (
        <td className="px-4 py-3">
          <div className="size-7 rounded bg-surface-subtle animate-skeleton-pulse" />
        </td>
      ) : null}
      {Array.from({ length: colSpan }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 w-3/4 rounded bg-surface-subtle animate-skeleton-pulse" style={{ animationDelay: `${i * 80}ms` }} />
        </td>
      ))}
    </tr>
  )
}

export const DataTable = forwardRef<HTMLElement, DataTableProps<{ readonly id: string }>>(
  function DataTable<TRow extends { readonly id: string }>({
    title,
    searchLabel = title ? `Search ${title}` : 'Search',
    searchPlaceholder = 'Search',
    searchValue,
    onSearchChange,
    action,
    columns,
    rows,
    itemLabel,
    filterRow,
    sortColumn,
    sortDirection,
    onSort,
    onRowClick,
    rowActions,
    selectedIds: controlledSelectedIds,
    onSelectionChange,
    loading = false,
    pagination,
    onPageChange,
    className,
    minTableWidthClassName = 'min-w-[56rem]',
    selectable = true,
    bare = false,
  }: DataTableProps<TRow>, ref) {
    const defaultPageSize = 8
    const [internalPage, setInternalPage] = useState(1)
    const [internalSearch, setInternalSearch] = useState('')
    const [internalSortColumn, setInternalSortColumn] = useState<string | null>(null)
    const [internalSortDirection, setInternalSortDirection] = useState<DataTableSortDirection>('asc')
    const [internalSelectedIds, setInternalSelectedIds] = useState<ReadonlySet<string>>(new Set())
    const [mobileDetailId, setMobileDetailId] = useState<string | null>(null)

    const selectedIds = controlledSelectedIds ?? internalSelectedIds
    const handleSelectionChange = onSelectionChange ?? setInternalSelectedIds

    function toggleRow(id: string) {
      const next = new Set(selectedIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      handleSelectionChange(next)
    }

    function toggleAll() {
      if (selectedIds.size === visibleRows.length) {
        handleSelectionChange(new Set())
      } else {
        handleSelectionChange(new Set(visibleRows.map((r) => r.id)))
      }
    }

    const effectiveSearch = searchValue ?? internalSearch
    const handleSearchChange = onSearchChange ?? setInternalSearch
    const effectiveSortColumn = sortColumn ?? internalSortColumn
    const effectiveSortDirection = sortDirection ?? internalSortDirection
    const handleSort = onSort ?? ((column: string) => {
      if (internalSortColumn === column) {
        setInternalSortDirection((prev) => prev === 'asc' ? 'desc' : 'asc')
      } else {
        setInternalSortColumn(column)
        setInternalSortDirection('asc')
      }
    })

    const filteredRows = useMemo(() => {
      if (!effectiveSearch) return rows
      return rows.filter((row) => filterRow ? filterRow(row, effectiveSearch) : defaultFilterRow(row, effectiveSearch))
    }, [rows, effectiveSearch, filterRow])

    const sortedRows = useMemo(() => {
      if (!effectiveSortColumn) return filteredRows
      const column = columns.find((c) => c.key === effectiveSortColumn)
      if (!column) return filteredRows
      return [...filteredRows].sort((a, b) => {
        const aVal = column.sortValue ? column.sortValue(a) : (a as Record<string, unknown>)[effectiveSortColumn]
        const bVal = column.sortValue ? column.sortValue(b) : (b as Record<string, unknown>)[effectiveSortColumn]
        const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
        return effectiveSortDirection === 'asc' ? cmp : -cmp
      })
    }, [filteredRows, effectiveSortColumn, effectiveSortDirection, columns])

    const isSelfPaginated = !pagination && sortedRows.length > defaultPageSize
    const effectivePagination: DataTablePagination | undefined = pagination ?? (isSelfPaginated
      ? { page: internalPage, totalPages: Math.ceil(sortedRows.length / defaultPageSize), totalItems: sortedRows.length, pageSize: defaultPageSize }
      : undefined)
    const visibleRows = isSelfPaginated ? sortedRows.slice((internalPage - 1) * defaultPageSize, internalPage * defaultPageSize) : sortedRows
    const handlePageChange = onPageChange ?? (isSelfPaginated ? setInternalPage : undefined)
    const mobileDetailRow = visibleRows.find((row) => row.id === mobileDetailId) ?? null

    const content = (
      <>
          <label className="relative block w-full max-w-[24rem]">
            <span className="sr-only">{searchLabel}</span>
            <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={effectiveSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="min-h-10 w-full rounded-md border border-input bg-surface ps-9 pe-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-focus focus:ring-2 focus:ring-focus"
              placeholder={searchPlaceholder}
            />
          </label>

          <div className="mt-4">
            <div className="divide-y divide-border rounded-lg border border-border sm:hidden">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <div className="h-4 w-1/3 rounded bg-surface-subtle animate-skeleton-pulse" />
                    <div className="ms-auto h-4 w-1/4 rounded bg-surface-subtle animate-skeleton-pulse" />
                  </div>
                ))
              ) : visibleRows.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-ink-muted">No items found.</p>
              ) : (
                visibleRows.map((row) => (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setMobileDetailId(row.id)}
                    className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm font-medium leading-5 text-ink">{columns[0]?.render(row)}</span>
                    <span className="max-w-[45%] shrink truncate text-sm leading-5 text-ink-muted">{columns[1]?.render(row)}</span>
                    <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
                  </button>
                ))
              )}
            </div>

            <div className="hidden sm:block">
            <table className={cn('w-full border-collapse text-sm', minTableWidthClassName)}>
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-ink-muted">
                  {selectable ? (
                    <th className="w-12 px-4 py-2.5 text-start font-semibold">
                      <label className="grid size-7 place-items-center rounded-soft focus-within:ring-2 focus-within:ring-focus">
                        <span className="sr-only">Select all rows</span>
                        <input
                          type="checkbox"
                          className="size-3.5 rounded border-input text-accent focus:ring-focus"
                          checked={visibleRows.length > 0 && selectedIds.size === visibleRows.length}
                          onChange={toggleAll}
                        />
                      </label>
                    </th>
                  ) : null}
                  {columns.map((column) => {
                    const isSortable = column.sortable !== false
                    const isSorted = sortColumn === column.key
                    return (
                      <th
                        key={column.key}
                        className={cn(
                          'px-4 py-2.5 text-start font-semibold',
                          isSortable && 'cursor-pointer select-none hover:bg-surface-subtle',
                          column.headerClassName,
                          column.className,
                        )}
                        onClick={isSortable ? () => onSort?.(column.key) : undefined}
                      >
                        <span className="inline-flex items-center gap-1">
                          {column.label}
                          {isSortable ? (
                            isSorted ? (
                              sortDirection === 'asc' ? (
                                <ChevronUp aria-hidden="true" className="size-3 text-accent-text" />
                              ) : (
                                <ChevronDown aria-hidden="true" className="size-3 text-accent-text" />
                              )
                            ) : (
                              <ArrowUpDown aria-hidden="true" className="size-3 text-ink-muted" />
                            )
                          ) : null}
                        </span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="text-ink">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} colSpan={columns.length} selectable={selectable} />)
                ) : visibleRows.length === 0 ? (
                  <tr>
                    <td colSpan={selectable ? columns.length + 1 : columns.length} className="px-3 py-12 text-center text-ink-muted">
                      No items found.
                    </td>
                  </tr>
                ) : (
                  visibleRows.map((row, index) => {
                    const isSelected = selectedIds.has(row.id)
                    return (
                      <tr
                        key={row.id}
                        className={cn(
                          'group/row border-b border-border animate-ease-in-bottom transition-colors',
                          isSelected ? 'bg-accent/10' : 'hover:bg-surface-subtle',
                          onRowClick && 'cursor-pointer',
                        )}
                        style={{ animationDelay: `${index * 40}ms` }}
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                      >
                        {selectable ? (
                          <td className="px-4 py-2.5">
                            <label className="grid size-7 place-items-center rounded-soft focus-within:ring-2 focus-within:ring-focus">
                              <span className="sr-only">{`Select ${itemLabel(row)}`}</span>
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={isSelected}
                                onChange={() => toggleRow(row.id)}
                              />
                              {isSelected ? (
                                <Check aria-hidden="true" className="size-3.5 text-accent" />
                              ) : (
                                <>
                                  <FileText aria-hidden="true" className="size-3.5 text-ink-muted group-hover/row:hidden" />
                                  <span aria-hidden="true" className="hidden size-3.5 rounded border border-ink-muted group-hover/row:block" />
                                </>
                              )}
                            </label>
                          </td>
                        ) : null}
                      {columns.map((column) => (
                        <td key={column.key} className={cn('max-w-0 truncate whitespace-nowrap px-4 py-2.5 leading-5', column.className)} title={String(itemLabel(row))}>
                          {column.render(row)}
                        </td>
                      ))}
                    </tr>
                  )
                  })
                )}
              </tbody>
            </table>
            </div>
          </div>

          {effectivePagination ? (
            <footer className="mt-3 flex flex-wrap items-center gap-10 px-6 py-2.5 text-sm font-medium leading-5 text-ink">
              <p>
                Showing items{' '}
                {Math.min((effectivePagination.page - 1) * effectivePagination.pageSize + 1, effectivePagination.totalItems)} -{' '}
                {Math.min(effectivePagination.page * effectivePagination.pageSize, effectivePagination.totalItems)} of {effectivePagination.totalItems}
              </p>
              <div className="inline-flex items-center gap-4">
                <button
                  type="button"
                  disabled={effectivePagination.page <= 1}
                  onClick={() => handlePageChange?.(effectivePagination.page - 1)}
                  className="grid size-4 place-items-center text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft aria-hidden="true" className="size-4" />
                </button>
                <span>{effectivePagination.page}</span>
                <button
                  type="button"
                  disabled={effectivePagination.page >= effectivePagination.totalPages}
                  onClick={() => handlePageChange?.(effectivePagination.page + 1)}
                  className="grid size-4 place-items-center text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight aria-hidden="true" className="size-4" />
                </button>
              </div>
            </footer>
          ) : null}

          {selectable && selectedIds.size > 0 ? (
            <div className="flex items-center justify-between border-t border-border bg-accent/10 px-6 py-3">
              <span className="text-sm font-semibold text-ink">{selectedIds.size} item{selectedIds.size > 1 ? 's' : ''} selected</span>
              <div className="flex items-center gap-3">
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
              </div>
            </div>
          ) : null}

          <Dialog open={mobileDetailRow !== null} onOpenChange={(open) => { if (!open) setMobileDetailId(null) }}>
            <DialogPopup aria-label={mobileDetailRow ? itemLabel(mobileDetailRow) : 'Row details'}>
              <DialogClose />
              {mobileDetailRow ? (
                <>
                  <DialogTitle>{itemLabel(mobileDetailRow)}</DialogTitle>
                  <dl className="mt-4 grid gap-3">
                    {columns.filter((column) => !column.hideInMobileDetail).map((column) => (
                      <div key={column.key} className="flex items-start justify-between gap-4 border-b border-border pb-3 text-sm">
                        <dt className="shrink-0 text-ink-muted">{column.label}</dt>
                        <dd className="min-w-0 text-end font-medium text-ink">{column.render(mobileDetailRow)}</dd>
                      </div>
                    ))}
                  </dl>
                  {rowActions ? (
                    <div className="mt-4 flex flex-wrap items-center gap-2">{rowActions(mobileDetailRow)}</div>
                  ) : null}
                  {onRowClick ? (
                    <button
                      type="button"
                      onClick={() => {
                        onRowClick(mobileDetailRow)
                        setMobileDetailId(null)
                      }}
                      className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    >
                      View details
                    </button>
                  ) : null}
                </>
              ) : null}
            </DialogPopup>
          </Dialog>
      </>
    )

    if (bare) {
      return (
        <div ref={ref as unknown as React.Ref<HTMLDivElement>} data-slot="data-table" className={className}>
          {content}
        </div>
      )
    }

    return (
      <article ref={ref} data-slot="data-table" className={cn('min-w-0 bg-surface shadow-panel', className)}>
        {title || action ? (
          <header className="flex min-h-[5rem] items-center justify-between gap-4 border-b border-border px-8">
            {title ? <h1 className="text-xl font-medium leading-5 text-ink">{title}</h1> : <span />}
            {action ? (
              <a
                href={action.href}
                className="inline-flex min-h-10 items-center justify-center gap-3 rounded-lg bg-accent px-4 py-2 text-base font-semibold leading-6 text-on-accent shadow-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <span className="shrink-0 [&>svg]:size-5">{action.icon ?? <Plus aria-hidden="true" />}</span>
                {action.label}
              </a>
            ) : null}
          </header>
        ) : null}

        <div className="p-8">{content}</div>
      </article>
    )
  },
) as <TRow extends { readonly id: string }>(props: DataTableProps<TRow> & { ref?: React.Ref<HTMLElement> }) => React.JSX.Element
