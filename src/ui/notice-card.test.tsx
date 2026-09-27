import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { NoticeCard } from './notice-card'

describe('NoticeCard', () => {
  it('gives the action a full-width button rather than a link in a sentence', () => {
    render(
      <NoticeCard
        title="Approaching your limit"
        description="16 min left in this stretch."
        action={{ label: 'Keep going now' }}
      />,
    )

    // This is the phone shape: the thing to tap is a target, not a few underlined words.
    const button = screen.getByRole('button', { name: 'Keep going now' })
    expect(button).toHaveClass('w-full', 'min-h-11')
    expect(screen.getByRole('status')).toHaveTextContent('Approaching your limit')
  })

  it('runs its action without letting the tap reach the surface underneath', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onSurfaceClick = vi.fn()

    render(
      // The live session advances on a tap anywhere, so a card over it must not double as one.
      <div onClick={onSurfaceClick}>
        <NoticeCard title="Session paused" action={{ label: 'Add funds', onClick }} />
      </div>,
    )

    await user.click(screen.getByRole('button', { name: 'Add funds' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onSurfaceClick).not.toHaveBeenCalled()
  })

  it('names its icon-only dismiss and keeps a 44px target', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()

    render(<NoticeCard title="Approaching your limit" onDismiss={onDismiss} dismissLabel="Dismiss the limit notice" />)

    const dismiss = screen.getByRole('button', { name: 'Dismiss the limit notice' })
    expect(dismiss).toHaveClass('size-11')
    await user.click(dismiss)
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('renders a navigating action as a link', () => {
    render(<NoticeCard title="Credits used up" action={{ label: 'Upgrade', href: '/v3/billing' }} />)

    expect(screen.getByRole('link', { name: 'Upgrade' })).toHaveAttribute('href', '/v3/billing')
  })
})
