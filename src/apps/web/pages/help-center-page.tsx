import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import {
  HelpCenterLayout,
  HelpCenterHome,
  HelpCollectionPage,
  HelpArticlePage,
} from '@/features/help-center'

export function HelpCenterApp() {
  return (
    <HelpCenterLayout>
      <Routes>
        <Route path="/" element={<HelpCenterHome />} />
        <Route path="/:collectionSlug" element={<CollectionRoute />} />
        <Route path="/:collectionSlug/:articleSlug" element={<ArticleRoute />} />
        <Route path="*" element={<Navigate to="/help" replace />} />
      </Routes>
    </HelpCenterLayout>
  )
}

function CollectionRoute() {
  const { collectionSlug } = useParams<{ collectionSlug: string }>()
  return <HelpCollectionPage collectionSlug={collectionSlug ?? ''} />
}

function ArticleRoute() {
  const { collectionSlug, articleSlug } = useParams<{ collectionSlug: string; articleSlug: string }>()
  return <HelpArticlePage collectionSlug={collectionSlug ?? ''} articleSlug={articleSlug ?? ''} />
}
