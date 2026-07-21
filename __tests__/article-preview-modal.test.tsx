import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ArticlePreviewModal from '../components/ArticlePreviewModal'

const baseArticle = {
  title_en: 'Puberty basics',
  content_en: 'English content',
  title_kin: 'Ubukure',
  content_kin: 'Kinyarwanda content',
  status: 'published',
}

describe('ArticlePreviewModal', () => {
  it('shows the English title and content by default', () => {
    render(<ArticlePreviewModal article={baseArticle} onClose={() => {}} />)

    expect(screen.getByText('Puberty basics')).toBeInTheDocument()
    expect(screen.getByText('English content')).toBeInTheDocument()
  })

  it('switches to another available language on tab click', async () => {
    const user = userEvent.setup()
    render(<ArticlePreviewModal article={baseArticle} onClose={() => {}} />)

    await user.click(screen.getByText('Kinyarwanda'))

    expect(screen.getByText('Ubukure')).toBeInTheDocument()
    expect(screen.getByText('Kinyarwanda content')).toBeInTheDocument()
  })

  it('disables and shows a fallback for a language with no translation', async () => {
    const user = userEvent.setup()
    render(<ArticlePreviewModal article={baseArticle} onClose={() => {}} />)

    const lugandaTab = screen.getByText('Luganda')
    expect(lugandaTab).toBeDisabled()

    await user.click(lugandaTab)

    // Disabled tab click is a no-op — still showing English content.
    expect(screen.getByText('Puberty basics')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ArticlePreviewModal article={baseArticle} onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: '' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders a placeholder when there is no cover image', () => {
    render(<ArticlePreviewModal article={baseArticle} onClose={() => {}} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders the cover image when provided', () => {
    render(
      <ArticlePreviewModal
        article={{ ...baseArticle, cover_image_url: 'https://example.com/cover.jpg' }}
        onClose={() => {}}
      />
    )
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/cover.jpg')
  })
})
