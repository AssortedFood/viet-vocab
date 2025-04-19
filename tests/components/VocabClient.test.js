// tests/components/VocabClient.test.js
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import VocabClient from '../../app/components/VocabClient'

describe('<VocabClient />', () => {
  const fakeData = [
    {
      id: 1,
      word: 'Xin chào',
      translation: 'Hello',
      description: 'Greeting',
      category: 'Greetings',
      familiarity: 2,
      createdAt: '2025-04-19T00:00:00.000Z',
    },
    {
      id: 2,
      word: 'Tạm biệt',
      translation: 'Goodbye',
      description: 'Farewell',
      category: '',
      familiarity: 1,
      createdAt: '2025-04-18T00:00:00.000Z',
    },
  ]

  beforeEach(() => {
    // Polyfill global.fetch for this test
    global.fetch = jest.fn((url) => {
      if (url.includes('/api/vocab/all')) {
        return Promise.resolve({
          ok: true,
          json: async () => fakeData,
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => [],
      })
    })
  })

  afterEach(() => {
    delete global.fetch
  })

  it('fetches and renders vocab cards, then filters them when searching', async () => {
    render(<VocabClient />)

    // Should show loading spinner initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument()

    // Wait for first card to appear
    expect(await screen.findByText('Xin chào → Hello')).toBeInTheDocument()
    expect(screen.getByText('Tạm biệt → Goodbye')).toBeInTheDocument()

    // Now type into the search bar
    const searchInput = screen.getByRole('textbox', { name: /search vocabulary/i })
    fireEvent.change(searchInput, { target: { value: 'Tạm' } })

    // Only the matching card remains
    expect(screen.getByText('Tạm biệt → Goodbye')).toBeInTheDocument()
    expect(screen.queryByText('Xin chào → Hello')).toBeNull()
  })
})