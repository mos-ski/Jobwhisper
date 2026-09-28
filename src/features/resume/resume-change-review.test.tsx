import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { resumeDocument } from '@/mocks/resume'
import { ClassicResume, type ResumeChangeDecision, type ResumeChangeKey } from './resume-templates'

function Review() {
  const [decisions, setDecisions] = useState<Partial<Record<ResumeChangeKey, ResumeChangeDecision>>>({})
  return (
    <ClassicResume
      document={resumeDocument}
      showImproved
      highlightChanges
      decisions={decisions}
      onDecide={(key, decision) => setDecisions((current) => ({ ...current, [key]: decision }))}
    />
  )
}

describe('Reviewing a Chat rewrite on the page', () => {
  it('accepts or rejects each changed line on its own', async () => {
    const user = userEvent.setup()
    render(<Review />)
    expect(screen.getAllByRole('button', { name: /^Accept the change to/ })).toHaveLength(4)

    await user.click(screen.getByRole('button', { name: 'Reject the change to the first bullet' }))
    expect(screen.getByText(resumeDocument.roles[0]!.bullets[0]!)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Accept the change to the first bullet' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Accept the change to the second bullet' }))
    expect(screen.getByText(resumeDocument.improvedFirstRoleBullets[1]!)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Accept the change to/ })).toHaveLength(2)
  })
})
