import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { EmailPreviewPage } from './email-preview-page'
import { EmailsIndexPage } from './emails-index-page'

function renderWorkspace(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/emails" element={<EmailsIndexPage />} />
        <Route path="/emails/:slug" element={<EmailPreviewPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('email review workspace', () => {
  it('redirects the catalog route into the first live preview', async () => {
    renderWorkspace('/emails')

    expect(await screen.findByTitle('Sign-in link preview')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign-in link' })).toHaveAttribute('aria-current', 'page')
  })

  it('keeps categorized template navigation beside the selected preview', async () => {
    const user = userEvent.setup()
    renderWorkspace('/emails/login-link')

    const navigation = screen.getByRole('navigation', { name: 'Email templates' })
    expect(within(navigation).getAllByRole('link')).toHaveLength(8)
    expect(screen.getByTitle('Sign-in link preview')).toBeInTheDocument()
    expect(screen.queryByLabelText('Preview times in')).not.toBeInTheDocument()

    await user.click(within(navigation).getByRole('link', { name: 'Payment receipt' }))

    expect(await screen.findByTitle('Payment receipt preview')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Payment receipt' })).toBeInTheDocument()
  })
})
