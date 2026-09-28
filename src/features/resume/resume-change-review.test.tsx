import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { resumeDocument } from '@/mocks/resume'
import { ClassicResume, type ResumeChangeDecisions } from './resume-templates'

function Review() {
  const [decisions, setDecisions] = useState<ResumeChangeDecisions>({})
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
  it('accepts or rejects each changed line on its own, across every role', async () => {
    const user = userEvent.setup()
    render(<Review />)
    // Summary, skills, and the 19 bullets the rewrite touches.
    expect(screen.getAllByRole('button', { name: /^Accept the change to/ })).toHaveLength(21)

    await user.click(screen.getByRole('button', { name: 'Reject the change to bullet 1 at Jobwhisper' }))
    expect(screen.getByText(resumeDocument.roles[0]!.bullets[0]!)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Accept the change to bullet 1 at Nazza' }))
    expect(screen.getByText(resumeDocument.improvedBullets![2]![0]!)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Accept the change to/ })).toHaveLength(19)
  })
})
