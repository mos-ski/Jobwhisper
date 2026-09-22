import { Routes, Route, Navigate, useParams } from 'react-router-dom'

import { HelpCenterLayout, HelpArticlePage } from '@/features/help-center'
import { helpCollections } from '@/data/help-center'

/** Where /help lands: the index is the sidebar, so there is no separate landing page. */
const firstCollection = helpCollections[0]
const firstArticlePath = `/help/${firstCollection.slug}/${firstCollection.articles[0].slug}`

export function HelpCenterApp() {
  return (
    <HelpCenterLayout>
      <Routes>
        <Route path="/" element={<Navigate to={firstArticlePath} replace />} />
        <Route path="/:collectionSlug" element={<CollectionRedirect />} />
        <Route path="/:collectionSlug/:articleSlug" element={<ArticleRoute />} />
        <Route path="*" element={<Navigate to="/help" replace />} />
      </Routes>
    </HelpCenterLayout>
  )
}

/** A collection has no page of its own; it opens at its first article. */
function CollectionRedirect() {
  const { collectionSlug } = useParams<{ collectionSlug: string }>()
  const collection = helpCollections.find((item) => item.slug === collectionSlug)
  const target = collection?.articles[0]
  return <Navigate to={target ? `/help/${collection!.slug}/${target.slug}` : firstArticlePath} replace />
}

function ArticleRoute() {
  const { collectionSlug, articleSlug } = useParams<{ collectionSlug: string; articleSlug: string }>()
  return <HelpArticlePage collectionSlug={collectionSlug ?? ''} articleSlug={articleSlug ?? ''} />
}
