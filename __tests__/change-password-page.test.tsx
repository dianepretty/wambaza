import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))

import ChangePassword from '../app/change-password/page'

describe('Change password page', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('rejects a weak password without calling the API', async () => {
    const user = userEvent.setup()
    render(<ChangePassword />)

    await user.type(screen.getByPlaceholderText('Enter a new password'), 'weak')
    await user.type(screen.getByPlaceholderText('Re-enter your new password'), 'weak')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(await screen.findByText('Password must be at least 8 characters long.')).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects mismatched passwords without calling the API', async () => {
    const user = userEvent.setup()
    render(<ChangePassword />)

    await user.type(screen.getByPlaceholderText('Enter a new password'), 'Secret123!')
    await user.type(screen.getByPlaceholderText('Re-enter your new password'), 'Different123!')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(await screen.findByText('Passwords do not match.')).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('submits when the password is strong and confirmed', async () => {
    const user = userEvent.setup()
    ;(fetch as any).mockResolvedValue({ ok: true, json: async () => ({}) })
    render(<ChangePassword />)

    await user.type(screen.getByPlaceholderText('Enter a new password'), 'Secret123!')
    await user.type(screen.getByPlaceholderText('Re-enter your new password'), 'Secret123!')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/change-password'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ new_password: 'Secret123!' }),
      })
    )
  })
})
