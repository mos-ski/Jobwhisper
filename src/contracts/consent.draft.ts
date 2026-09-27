/** The optional cookie categories a visitor can turn on. Essential cookies are always on and not a choice. */
export type ConsentPreferences = {
  readonly analytics: boolean
  readonly marketing: boolean
}

export type ConsentState =
  | { readonly status: 'undecided' }
  | { readonly status: 'decided'; readonly preferences: ConsentPreferences }
