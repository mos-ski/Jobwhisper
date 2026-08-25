// src/hooks/useAuth.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './useAuth'

function TestConsumer() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div>Loading...</div>
  return <div>{user ? `Hello ${user.name}` : 'No user'}</div>
}

function Wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('useAuth', () => {
  beforeEach(() => localStorage.clear())

  it('auto-injects the demo user immediately, with no loading state (dev bypass)', () => {
    render(<TestConsumer />, { wrapper: Wrapper })
    expect(screen.getByText('Hello Darnell Smith')).toBeInTheDocument()
  })

  it('still shows the demo user when a token is already in localStorage', () => {
    localStorage.setItem('lf_token', 'valid-token')
    render(<TestConsumer />, { wrapper: Wrapper })
    expect(screen.getByText('Hello Darnell Smith')).toBeInTheDocument()
  })
})
