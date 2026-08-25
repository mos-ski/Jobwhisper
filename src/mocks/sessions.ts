import type { Session } from '@/contracts/identity'

export const anonymousSession: Session = { status: 'anonymous' }

export const candidateSession: Session = {
  status: 'authenticated',
  user: {
    id: 'user_darnell_smith',
    email: 'darnell.smith@example.com',
    name: 'Darnell Smith',
    role: 'candidate',
    permissions: ['app:view', 'resume:read', 'resume:write', 'interview:use', 'auto-apply:use', 'copilot:use', 'billing:view'],
  },
}
