import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import NavBar from '../components/NavBar'

describe('NavBar', () => {
  it('links to home, ask, and signin', () => {
    render(<NavBar />)

    expect(screen.getByRole('link', { name: 'Wambaza' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Ask a Question' })).toHaveAttribute('href', '/ask')
    expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute('href', '/signin')
  })
})
