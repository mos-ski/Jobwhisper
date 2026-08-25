import { render, screen, fireEvent } from '@testing-library/react'
import AgentFeed from './AgentFeed'
import type { FeedEvent } from '@/hooks/useAgentSession'

const events: FeedEvent[] = [
  { id: '1', timestamp: new Date('2026-01-01T10:44:00'), agent: 'system', message: 'Session started' },
  { id: '2', timestamp: new Date('2026-01-01T10:45:00'), agent: 'scout',  message: 'Found 6 roles on LinkedIn' },
  { id: '3', timestamp: new Date('2026-01-01T10:46:00'), agent: 'filter', message: 'Passed 4 jobs' },
  { id: '4', timestamp: new Date('2026-01-01T10:47:00'), agent: 'scout',  message: 'Found 3 more roles on Greenhouse' },
]

it('renders all events in All tab', () => {
  render(<AgentFeed events={events} />)
  expect(screen.getByText('Session started')).toBeInTheDocument()
  expect(screen.getByText('Found 6 roles on LinkedIn')).toBeInTheDocument()
  expect(screen.getByText('Passed 4 jobs')).toBeInTheDocument()
})

it('filters to scout events when Scout tab is clicked', () => {
  render(<AgentFeed events={events} />)
  fireEvent.click(screen.getByRole('button', { name: 'Scout' }))
  expect(screen.getByText('Found 6 roles on LinkedIn')).toBeInTheDocument()
  expect(screen.getByText('Found 3 more roles on Greenhouse')).toBeInTheDocument()
  expect(screen.queryByText('Passed 4 jobs')).not.toBeInTheDocument()
  expect(screen.queryByText('Session started')).not.toBeInTheDocument()
})

it('returns to all events when All tab is clicked', () => {
  render(<AgentFeed events={events} />)
  fireEvent.click(screen.getByRole('button', { name: 'Scout' }))
  fireEvent.click(screen.getByRole('button', { name: 'All' }))
  expect(screen.getByText('Passed 4 jobs')).toBeInTheDocument()
})

it('renders Live indicator', () => {
  render(<AgentFeed events={events} />)
  expect(screen.getByText('Live')).toBeInTheDocument()
})
