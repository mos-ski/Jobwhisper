export type Plan = 'starter' | 'pro' | 'premium';

export type BillableFeature =
  | 'resume'
  | 'interview-prep'
  | 'auto-apply'
  | 'copilot';

// Resume Builder and Auto Apply are excluded from every plan tier — they're sold standalone,
// pay-as-you-go, no subscription required. Each has its own prepaid credit balance, not modeled
// here yet (not tied to a Plan subscription the way the Copilot wallet below is). See PRICING.md §2.
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
    };
