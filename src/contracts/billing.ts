export type Plan = 'starter' | 'pro' | 'premium';

export type BillableFeature =
  | 'resume'
  | 'interview-prep'
  | 'auto-apply'
  | 'copilot';

// Resume Builder and Auto Apply are excluded from every plan tier — they're sold as separate
// recurring add-ons, each with its own further nested unlock. See docs/PRICING_STRATEGY_PRD.md.
export type AddOnId = 'resume-builder' | 'resume-ai-suggestions' | 'auto-apply' | 'auto-apply-full-auto';

export type AddOnAccess = {
  readonly addOn: AddOnId
  readonly entitled: boolean
  readonly priceMonthly: number
};

export type CreditWallet = {
  readonly balance: number;
  readonly currency: 'credits';
  readonly reserved: number;
};

export type FeatureAccess = {
  readonly feature: BillableFeature;
  readonly entitled: boolean;
  readonly creditCost: number;
};

export type BillingSnapshot =
  | { readonly status: 'unavailable' }
  | { readonly status: 'loading' }
  | {
      readonly status: 'ready';
      readonly plan: Plan;
      readonly wallet: CreditWallet;
      readonly access: Readonly<Record<BillableFeature, FeatureAccess>>;
      readonly addOns: Readonly<Record<AddOnId, AddOnAccess>>;
    };
