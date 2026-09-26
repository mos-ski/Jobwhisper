import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { NoticeBar } from './notice-bar'

describe('NoticeBar', () => {
  it('is a flat status line, not a card', () => {
    render(<NoticeBar tone="warning">Running low on balance</NoticeBar>)

    // It docks to the surface it belongs to. A border, a shadow or a radius turns it into
    // something dropped on top of the work, which is what made it shout.
    const notice = screen.getByRole('status')
    expect(notice).toHaveClass('w-full')
    expect(notice.className).not.toMatch(/\bshadow-|\brounded-|\bborder\b/)
  })

  it('stays quiet by default rather than reaching for a colour', () => {
    render(<NoticeBar>You have hit your monthly limit</NoticeBar>)

    expect(screen.getByRole('status')).toHaveAttribute('data-tone', 'neutral')
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
