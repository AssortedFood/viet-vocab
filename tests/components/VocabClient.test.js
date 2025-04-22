// tests/components/VocabClient.test.js
import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import VocabClient from '../../app/components/VocabClient'

describe('<VocabClient />', () => {
  const fakeData = [
    {
      id: 1,
      word: 'Xin chào',
      word_translation: 'Hello',
      example: 'Xin chào mọi người',
      example_translation: 'Hello everyone',
      category: 'Greetings',
      familiarity: 2,
      createdAt: '2025-04-19T00:00:00.000Z',
    },
    {
      id: 2,
      word: 'Tạm biệt',
      word_translation: 'Goodbye',
      example: 'Tạm biệt bạn',
      example_translation: 'Goodbye friend',
      category: 'Greetings',
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

  it('toggles the Add‑Vocab form when clicking the button', () => {
    render(<VocabClient />)

    const toggleBtn = screen.getByRole('button', { name: /add new vocab/i })

    // form not visible initially
    expect(screen.queryByLabelText(/Vietnamese/i)).toBeNull()
    expect(toggleBtn).toHaveTextContent(/^Add New Vocab$/i)

    // open form
    fireEvent.click(toggleBtn)
    expect(screen.getByLabelText(/Vietnamese/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/English Translation/i)).toBeInTheDocument()
    expect(toggleBtn).toHaveTextContent(/^Close$/i)

    // close form
    fireEvent.click(toggleBtn)
    expect(screen.queryByLabelText(/Vietnamese/i)).toBeNull()
    expect(toggleBtn).toHaveTextContent(/^Add New Vocab$/i)
  })

  it('filters diacritics‑insensitively (typing "tam" still matches "Tạm biệt")', async () => {
    await act(async () => {
      render(<VocabClient />)
    })

    // wait for the cards to load
    expect(await screen.findByText(/Xin chào\s*→\s*Hello/)).toBeInTheDocument()
    expect(screen.getByText(/Tạm biệt\s*→\s*Goodbye/)).toBeInTheDocument()

    // type without diacritics
    const searchInput = screen.getByRole('textbox', { name: /search vocabulary/i })
    fireEvent.change(searchInput, { target: { value: 'tam' } })

    // still matches "Tạm biệt"
    expect(screen.getByText(/Tạm biệt\s*→\s*Goodbye/)).toBeInTheDocument()
    // the other card should be gone
    expect(screen.queryByText(/Xin chào\s*→\s*Hello/)).toBeNull()
  })

  it('toggles the Add‑Vocab form when clicking the button', () => {
    render(<VocabClient />)

    const toggleBtn = screen.getByRole('button', { name: /add new vocab/i })

    // form not visible initially
    expect(screen.queryByLabelText(/Vietnamese/i)).toBeNull()
    expect(toggleBtn).toHaveTextContent(/^Add New Vocab$/i)

    // open form
    fireEvent.click(toggleBtn)
    expect(screen.getByLabelText(/Vietnamese/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/English Translation/i)).toBeInTheDocument()
    expect(toggleBtn).toHaveTextContent(/^Close$/i)

    // close form
    fireEvent.click(toggleBtn)
    expect(screen.queryByLabelText(/Vietnamese/i)).toBeNull()
    expect(toggleBtn).toHaveTextContent(/^Add New Vocab$/i)
  })

  it('fetches and renders vocab cards, then filters them when searching', async () => {
    // Render component
    render(<VocabClient />)

    // Wait for both vocab cards to appear
    await screen.findByText(/Xin chào\s*→\s*Hello/)
    await screen.findByText(/Tạm biệt\s*→\s*Goodbye/)

    // Perform a search
    fireEvent.change(
      screen.getByRole('textbox', { name: /search vocabulary/i }),
      { target: { value: 'Tạm' } }
    )

    // Assert that only the matching card remains
    await waitFor(() => {
      expect(screen.getByText(/Tạm biệt\s*→\s*Goodbye/)).toBeInTheDocument()
      expect(screen.queryByText(/Xin chào\s*→\s*Hello/)).toBeNull()
    })
  })
})
