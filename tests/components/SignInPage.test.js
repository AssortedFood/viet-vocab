// tests/components/SignInPage.test.js
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SignInPage from '../../app/auth/signin/page.js'
import { getProviders, signIn } from 'next-auth/react'

jest.mock('next-auth/react', () => ({
  getProviders: jest.fn(),
  signIn: jest.fn(),
}))
// mock next/image since SignInPage imports it
jest.mock('next/image', () => () => null)

describe('<SignInPage />', () => {
  beforeEach(async () => {
    getProviders.mockResolvedValue({
      google: { id: 'google', name: 'Google', callbackUrl: '/' }
    })
    render(<SignInPage />)
    // wait for useEffect to resolve
    await screen.findByRole('button', { name: /Sign in with Google/i })
  })

  it('renders only the enabled provider buttons', () => {
    expect(screen.queryByText(/Sign in with Facebook/)).toBeNull()
    expect(screen.getByRole('button', { name: /Sign in with Google/i })).toBeInTheDocument()
  })

  it('calls signIn with correct args when clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: /Sign in with Google/i }))
    expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/' })
  })
})
