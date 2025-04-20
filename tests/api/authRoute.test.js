// tests/api/authRoute.test.js
import NextAuthImport from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import { authOptions } from '../../app/api/auth/[...nextauth]/options.js'
import * as route from '../../app/api/auth/[...nextauth]/route.js'

jest.mock('next-auth/next', () => ({
  __esModule: true,
  default: jest.fn((opts) => (req, res) => res) // stub handler
}))
jest.mock('next-auth/providers/google', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({ id: 'google', name: 'Google' })
}))

describe('NextAuth authOptions & route', () => {
  it('should configure the Google provider and signIn page', () => {
    expect(authOptions.providers).toHaveLength(1)
    const p = authOptions.providers[0]
    expect(p.id).toBe('google')
    expect(authOptions.pages.signIn).toBe('/auth/signin')
  })

  it('exports GET and POST handlers from NextAuth', () => {
    expect(typeof route.GET).toBe('function')
    expect(typeof route.POST).toBe('function')
    // ensure NextAuthImport was called with our authOptions
    expect(NextAuthImport).toHaveBeenCalledWith(authOptions)
  })
})
