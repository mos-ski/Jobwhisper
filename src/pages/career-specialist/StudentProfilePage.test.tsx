import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import StudentProfilePage from './StudentProfilePage'

function renderWithRouter(id = '1') {
  return render(
    <MemoryRouter initialEntries={[`/career-specialist/students/${id}`]}>
      <Routes>
        <Route path="/career-specialist/students/:id" element={<StudentProfilePage />} />
      </Routes>
    </MemoryRouter>
  )
}

it('renders student name for known id', () => {
  renderWithRouter('1')
  expect(screen.getByText('Sarah Mitchell')).toBeInTheDocument()
})

it('Overview tab is active by default', () => {
  renderWithRouter('1')
  const overviewTab = screen.getByRole('button', { name: 'Overview' })
  expect(overviewTab.className).toMatch(/border-blue-600 text-blue-600/)
})

it('clicking Agent tab changes active tab', () => {
  renderWithRouter('1')
  const agentBtn = screen.getByRole('button', { name: 'Agent' })
  fireEvent.click(agentBtn)
  expect(agentBtn.className).toMatch(/border-blue-600 text-blue-600/)
})
