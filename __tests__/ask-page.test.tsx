import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const searchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useSearchParams: () => searchParams,
}))

import Ask from '../app/ask/page'

describe('Ask AI page', () => {
  beforeEach(() => {
    searchParams.forEach((_v, k) => searchParams.delete(k))
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renders the empty state with suggestions', () => {
    render(<Ask />)

    expect(screen.getByText('Ask me anything about your health')).toBeInTheDocument()
    expect(screen.getByText('What is puberty?')).toBeInTheDocument()
  })

  it('sends the typed question and renders the bot answer', async () => {
    const user = userEvent.setup()
    ;(fetch as any).mockResolvedValue({
      json: async () => ({ answer: 'Puberty is a normal stage of growth.' }),
    })

    render(<Ask />)

    const input = screen.getByPlaceholderText(/Type a question/i)
    await user.type(input, 'What is puberty?')
    await user.click(screen.getByRole('button', { name: '' }))

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/model/ask'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ question: 'What is puberty?', language: 'auto' }),
      })
    )

    expect(await screen.findByText('What is puberty?')).toBeInTheDocument()
    expect(await screen.findByText('Puberty is a normal stage of growth.')).toBeInTheDocument()
  })

  it('clicking a suggestion asks that question directly', async () => {
    const user = userEvent.setup()
    ;(fetch as any).mockResolvedValue({
      json: async () => ({ answer: 'Some answer' }),
    })

    render(<Ask />)

    await user.click(screen.getByText('How can I prevent STIs?'))

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    expect(await screen.findByText('Some answer')).toBeInTheDocument()
  })

  it('shows a fallback message when the request fails', async () => {
    const user = userEvent.setup()
    ;(fetch as any).mockRejectedValue(new Error('network down'))

    render(<Ask />)

    const input = screen.getByPlaceholderText(/Type a question/i)
    await user.type(input, 'Hello')
    await user.click(screen.getByRole('button', { name: '' }))

    expect(await screen.findByText('Sorry, something went wrong. Please try again.')).toBeInTheDocument()
  })

  it('does not submit an empty or whitespace-only question', async () => {
    render(<Ask />)

    const submitButton = screen.getByRole('button', { name: '' })
    expect(submitButton).toBeDisabled()
    expect(fetch).not.toHaveBeenCalled()
  })
})
