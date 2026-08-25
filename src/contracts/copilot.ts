export type CopilotAccessBlockReason =
  | 'unauthenticated'
  | 'missing-permission'
  | 'billing-unavailable'
  | 'not-entitled'
  | 'insufficient-credits';

export type CopilotAccess =
  | { readonly allowed: true; readonly creditCost: number }
  | { readonly allowed: false; readonly reason: CopilotAccessBlockReason };
