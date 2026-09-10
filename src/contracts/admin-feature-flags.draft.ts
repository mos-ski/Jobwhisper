export type AdminFeatureFlagCategory = 'products' | 'app' | 'support'

export type AdminFeatureFlag = {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly category: AdminFeatureFlagCategory
  /** Null for parent flags that don't have their own toggle (children are toggled individually). */
  readonly enabled: boolean | null
  /** Parent id for nested flags — turning a parent off takes its children with it. */
  readonly parentId?: string
}
