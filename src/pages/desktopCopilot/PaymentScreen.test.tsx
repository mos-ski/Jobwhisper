// src/pages/desktopCopilot/PaymentScreen.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { PaymentScreen } from './PaymentScreen'

describe('PaymentScreen', () => {
  it('shows the correct purchase summary for the given plan', () => {
    render(<PaymentScreen planId="pro" onPaid={() => {}} onBack={() => {}} />)
    expect(screen.getByText('$49/mo — Pro Plan')).toBeInTheDocument()
  })

  it('disables Pay until all card fields are filled, then calls onPaid', () => {
    const onPaid = vi.fn()
    render(<PaymentScreen planId="premium" onPaid={onPaid} onBack={() => {}} />)
    const payButton = screen.getByText('Pay $79/mo')
    fireEvent.click(payButton)
    expect(onPaid).not.toHaveBeenCalled()

    fireEvent.change(screen.getByPlaceholderText('1234 1234 1234 1234'), { target: { value: '4242424242424242' } })
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/30' } })
    fireEvent.change(screen.getByPlaceholderText('123'), { target: { value: '123' } })
    fireEvent.click(payButton)
    expect(onPaid).toHaveBeenCalledTimes(1)
  })

  it('calls onBack when Back is clicked', () => {
    const onBack = vi.fn()
    render(<PaymentScreen planId="premium" onPaid={() => {}} onBack={onBack} />)
    fireEvent.click(screen.getByText('← Back'))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
