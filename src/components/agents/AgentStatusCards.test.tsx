// src/components/agents/AgentStatusCards.test.tsx
import { render, screen } from '@testing-library/react'
import AgentStatusCards from './AgentStatusCards'
import type { AgentStatus } from '@/hooks/useAgentSession'

const agents: AgentStatus[] = [
  { name: 'scout',  label: 'Scout',  status: 'running', currentTask: 'Scanning LinkedIn' },
  { name: 'filter', label: 'Filter', status: 'running', currentTask: 'Scoring jobs' },
  { name: 'tailor', label: 'Tailor', status: 'working', currentTask: 'Building resume' },
  { name: 'driver', label: 'Driver', status: 'idle',    currentTask: 'Waiting' },
]

it('renders all four agent labels', () => {
  render(<AgentStatusCards agents={agents} />)
  expect(screen.getByText('Scout')).toBeInTheDocument()
  expect(screen.getByText('Filter')).toBeInTheDocument()
  expect(screen.getByText('Tailor')).toBeInTheDocument()
  expect(screen.getByText('Driver')).toBeInTheDocument()
})

it('renders status badges', () => {
  render(<AgentStatusCards agents={agents} />)
  expect(screen.getAllByText('running')).toHaveLength(2)
  expect(screen.getByText('working')).toBeInTheDocument()
  expect(screen.getByText('idle')).toBeInTheDocument()
})

it('renders current task text', () => {
  render(<AgentStatusCards agents={agents} />)
  expect(screen.getByText('Scanning LinkedIn')).toBeInTheDocument()
  expect(screen.getByText('Waiting')).toBeInTheDocument()
})
