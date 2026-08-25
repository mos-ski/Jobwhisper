// src/pages/desktopCopilot/PricingScreen.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { PricingScreen } from './PricingScreen'

describe('PricingScreen', () => {
  it('renders Pro and Premium with their discounted annual prices and credits by default', () => {
    render(<PricingScreen onBack={() => {}} onSelect={() => {}} />)
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('$39')).toBeInTheDocument()
    expect(screen.getByText('50 Credits')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
    expect(screen.getByText('$63')).toBeInTheDocument()
    expect(screen.getByText('100 Credits')).toBeInTheDocument()
    expect(screen.getByText('Most Popular')).toBeInTheDocument()
  })

  it('switches to full monthly prices when the billing toggle is clicked', () => {
    render(<PricingScreen onBack={() => {}} onSelect={() => {}} />)
    fireEvent.click(screen.getByText('Annual'))
    expect(screen.getByText('$49')).toBeInTheDocument()
    expect(screen.getByText('$79')).toBeInTheDocument()
    expect(screen.queryByText('$39')).not.toBeInTheDocument()
  })

  it('calls onSelect with the chosen plan id', () => {
    const onSelect = vi.fn()
    render(<PricingScreen onBack={() => {}} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Upgrade to Premium'))
    expect(onSelect).toHaveBeenCalledWith('premium')
  })

  it('calls onBack when the close button is clicked', () => {
    const onBack = vi.fn()
    render(<PricingScreen onBack={onBack} onSelect={() => {}} />)
    fireEvent.click(screen.getByTitle('Back'))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
