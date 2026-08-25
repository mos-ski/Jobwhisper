import { render, screen } from '@testing-library/react'
import AgentStatsSummary from './AgentStatsSummary'

const stats = { found: 34, matched: 18, tailored: 6, applied: 5 }

it('renders all four stat values', () => {
  render(<AgentStatsSummary stats={stats} />)
  expect(screen.getByText('34')).toBeInTheDocument()
  expect(screen.getByText('18')).toBeInTheDocument()
  expect(screen.getByText('6')).toBeInTheDocument()
  expect(screen.getByText('5')).toBeInTheDocument()
})

it('renders the four stat labels', () => {
  render(<AgentStatsSummary stats={stats} />)
  expect(screen.getByText('Found')).toBeInTheDocument()
  expect(screen.getByText('Matched')).toBeInTheDocument()
  expect(screen.getByText('Tailored')).toBeInTheDocument()
  expect(screen.getByText('Applied')).toBeInTheDocument()
})
