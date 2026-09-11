import { useState, useMemo, useCallback } from 'react'
import { SearchInput } from '@/ui'
import { helpCollections } from '@/data/help-center'
import type { HelpArticle, HelpCollection } from '@/data/help-center'

export type SearchMatch = {
  readonly article: HelpArticle
  readonly collection: HelpCollection
}

export function useHelpSearch() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (query.trim().length < 2) return []
    const lower = query.toLowerCase()
    const matches: SearchMatch[] = []
    for (const collection of helpCollections) {
      for (const article of collection.articles) {
        const inTitle = article.title.toLowerCase().includes(lower)
        const inDesc = article.description.toLowerCase().includes(lower)
        const inContent = article.content.some(
          (block) => block.type === 'paragraph' && block.text.toLowerCase().includes(lower),
        )
        if (inTitle || inDesc || inContent) {
          matches.push({ article, collection })
        }
      }
    }
    return matches
  }, [query])

  const clear = useCallback(() => setQuery(''), [])

  return { query, setQuery, results, clear }
}
