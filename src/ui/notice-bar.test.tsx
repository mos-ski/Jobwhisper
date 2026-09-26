import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { NoticeBar } from './notice-bar'

describe('NoticeBar', () => {
  it('hugs its content instead of spanning its container', () => {
    render(<NoticeBar tone="warning">Running low on balance</NoticeBar>)

    // The whole point of the rewrite: a stripe across a session puts the message and its
    // action a screen apart. w-fit is what keeps them together.
    expect(screen.getByRole('status')).toHaveClass('w-fit')
  })

  it('runs its action without letting the click reach the surface underneath', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onSurfaceClick = vi.fn()

    render(
      // The live session advances on a tap anywhere, so a notice over it must not double as one.
      <div onClick={onSurfaceClick}>
        <NoticeBar action={{ label: 'Add funds', onClick }}>Running low on balance</NoticeBar>
      </div>,
    )

    await user.click(screen.getByRole('button', { name: 'Add funds' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onSurfaceClick).not.toHaveBeenCalled()
  })

  it('gives the icon-only dismiss a name and keeps a 44px target', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()

    render(
      <NoticeBar onDismiss={onDismiss} dismissLabel="Dismiss the low balance notice">
        Running low on balance
      </NoticeBar>,
    )

    const dismiss = screen.getByRole('button', { name: 'Dismiss the low balance notice' })
    expect(dismiss).toHaveClass('size-11')
    await user.click(dismiss)
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('renders a navigating action as a link, not a button', () => {
    render(<NoticeBar action={{ label: 'View plans', href: '/v3/billing/plans' }}>No plan</NoticeBar>)

    expect(screen.getByRole('link', { name: 'View plans' })).toHaveAttribute('href', '/v3/billing/plans')
  })
})
