import { useState, useMemo, useCallback } from 'react'

export type SortDirection = 'asc' | 'desc' | null

export interface SortState {
  key: string
  direction: SortDirection
}

export interface UseSortOptions<T> {
  data: T[]
  defaultSortKey?: string
  defaultDirection?: SortDirection
  getValue?: (item: T, key: string) => string | number
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj)
}

export function useSort<T extends Record<string, any>>({
  data,
  defaultSortKey = '',
  defaultDirection = null,
  getValue,
}: UseSortOptions<T>) {
  const [sortState, setSortState] = useState<SortState>({
    key: defaultSortKey,
    direction: defaultDirection,
  })

  const toggleSort = useCallback((key: string) => {
    setSortState(prev => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' }
        if (prev.direction === 'desc') return { key: '', direction: null }
        return { key, direction: 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }, [])

  const sorted = useMemo(() => {
    if (!sortState.key || !sortState.direction) return data

    return [...data].sort((a, b) => {
      let aVal = getValue ? getValue(a, sortState.key) : getNestedValue(a, sortState.key)
      let bVal = getValue ? getValue(b, sortState.key) : getNestedValue(b, sortState.key)

      if (aVal == null) return 1
      if (bVal == null) return -1

      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()

      let result = 0
      if (aVal < bVal) result = -1
      else if (aVal > bVal) result = 1

      return sortState.direction === 'desc' ? -result : result
    })
  }, [data, sortState.key, sortState.direction, getValue])

  return {
    sortKey: sortState.key,
    sortDirection: sortState.direction,
    toggleSort,
    sorted,
  }
}
