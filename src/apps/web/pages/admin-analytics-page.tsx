import { useSearchParams } from 'react-router-dom'

import { AdminAnalyticsView } from '@/features/admin/admin-analytics-view'
import {
  adminAnalyticsDemographics,
  adminAnalyticsFunnels,
  adminAnalyticsReferrals,
  adminAnalyticsScores,
  adminAnalyticsSurveyDistributions,
} from '@/mocks/admin-analytics'
import { adminDateRanges, adminNavItems, adminNotifications, adminSearchResults, adminSession } from '@/mocks/admin'

export function AdminAnalyticsPage() {
  const [params] = useSearchParams()
  const user = adminSession.status === 'authenticated' ? adminSession.user : null
  if (!user) return null

  return (
    <AdminAnalyticsView
      user={user}
      navItems={adminNavItems}
      notifications={adminNotifications}
      searchResults={adminSearchResults}
      dateRanges={adminDateRanges}
      surveyDistributions={adminAnalyticsSurveyDistributions}
      demographics={adminAnalyticsDemographics}
      scores={adminAnalyticsScores}
      funnels={adminAnalyticsFunnels}
      referrals={adminAnalyticsReferrals}
      isLoading={params.get('state') === 'loading'}
    />
  )
}
