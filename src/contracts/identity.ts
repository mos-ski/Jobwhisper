export type Role = 'candidate' | 'support' | 'admin';

export type Permission =
  | 'app:view'
  | 'resume:read'
  | 'resume:write'
  | 'interview:use'
  | 'auto-apply:use'
  | 'copilot:use'
  | 'billing:view'
  | 'admin:view'
  | 'admin:users:manage'
  | 'admin:credits:manage'
  | 'admin:services:manage';

export interface UserIdentity {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: Role;
  readonly permissions: readonly Permission[];
}

export type Session =
  | { readonly status: 'checking' }
  | { readonly status: 'anonymous' }
  | { readonly status: 'authenticated'; readonly user: UserIdentity };
