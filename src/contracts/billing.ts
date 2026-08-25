export type Plan = 'free' | 'pro' | 'business';

export type BillableFeature =
  | 'resume'
  | 'interview-prep'
  | 'auto-apply'
  | 'copilot';

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
