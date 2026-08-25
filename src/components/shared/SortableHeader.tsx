import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import type { SortDirection } from '@/hooks/useSort'

interface SortableHeaderProps {
  label: string
  sortKey: string
  activeSortKey: string
  sortDirection: SortDirection
  onToggleSort: (key: string) => void
  className?: string
}

export function SortableHeader({
  label,
  sortKey,
  activeSortKey,
  sortDirection,
  onToggleSort,
  className = '',
}: SortableHeaderProps) {
  const isActive = activeSortKey === sortKey

  return (
    <th
      className={`lf-table-th cursor-pointer select-none hover:text-foreground transition-colors group ${className}`}
      onClick={() => onToggleSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1.5">
        {label}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          {!isActive ? (
            <ChevronsUpDown className="h-3 w-3" />
          ) : sortDirection === 'asc' ? (
            <ChevronUp className="h-3 w-3 text-foreground" />
          ) : (
            <ChevronDown className="h-3 w-3 text-foreground" />
          )}
        </span>
        {isActive && (
          <span className="text-foreground">
            {sortDirection === 'asc' ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </span>
        )}
      </span>
    </th>
  )
}
