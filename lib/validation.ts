// Mirrors the password policy enforced by the backend (validate_password_strength in
// wambaza_backend/app/schemas.py) so users see the same feedback before submitting.
export function getPasswordStrengthError(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters long.'
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.'
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.'
  if (!/\d/.test(password)) return 'Password must contain at least one digit.'
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character.'
  return null
}
