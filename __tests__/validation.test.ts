import { describe, it, expect } from 'vitest'
import { getPasswordStrengthError } from '../lib/validation'

describe('getPasswordStrengthError', () => {
  it('accepts a password meeting all requirements', () => {
    expect(getPasswordStrengthError('Secret123!')).toBeNull()
  })

  it('rejects passwords shorter than 8 characters', () => {
    expect(getPasswordStrengthError('Sh0rt!')).toMatch(/at least 8 characters/)
  })

  it('rejects passwords missing an uppercase letter', () => {
    expect(getPasswordStrengthError('secret123!')).toMatch(/uppercase/)
  })

  it('rejects passwords missing a lowercase letter', () => {
    expect(getPasswordStrengthError('SECRET123!')).toMatch(/lowercase/)
  })

  it('rejects passwords missing a digit', () => {
    expect(getPasswordStrengthError('SecretPass!')).toMatch(/digit/)
  })

  it('rejects passwords missing a special character', () => {
    expect(getPasswordStrengthError('Secret1234')).toMatch(/special character/)
  })
})
