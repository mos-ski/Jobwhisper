import { useState } from 'react'

import type { ConsentPreferences, ConsentState } from '@/contracts/consent.draft'

// A first-party cookie rather than localStorage: the choice has to reach the server-rendered
// marketing site and any tag manager, and the repo keeps localStorage for the theme alone.
const COOKIE_NAME = 'jw_cookie_consent'
const SIX_MONTHS_SECONDS = 60 * 60 * 24 * 182

export const NO_OPTIONAL_COOKIES: ConsentPreferences = { analytics: false, marketing: false }
export const ALL_OPTIONAL_COOKIES: ConsentPreferences = { analytics: true, marketing: true }

function readConsent(): ConsentState {
  const entry = document.cookie.split('; ').find((part) => part.startsWith(`${COOKIE_NAME}=`))
  if (!entry) return { status: 'undecided' }
  const values = new URLSearchParams(decodeURIComponent(entry.slice(COOKIE_NAME.length + 1)))
  return { status: 'decided', preferences: { analytics: values.get('analytics') === '1', marketing: values.get('marketing') === '1' } }
}

function writeConsent(preferences: ConsentPreferences) {
  const value = encodeURIComponent(`analytics=${preferences.analytics ? 1 : 0}&marketing=${preferences.marketing ? 1 : 0}`)
  document.cookie = `${COOKIE_NAME}=${value}; Max-Age=${SIX_MONTHS_SECONDS}; Path=/; SameSite=Lax`
}

/** The visitor's cookie choice, remembered in a first-party cookie for six months. */
export function useCookieConsent(): readonly [ConsentState, (preferences: ConsentPreferences) => void] {
  const [consent, setConsent] = useState<ConsentState>(readConsent)

  function decide(preferences: ConsentPreferences) {
    writeConsent(preferences)
    setConsent({ status: 'decided', preferences })
  }

  return [consent, decide] as const
}
