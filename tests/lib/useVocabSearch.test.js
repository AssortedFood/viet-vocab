// tests/lib/useVocabSearch.test.js
import React, { useEffect } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { useVocabSearch } from '../../lib/useVocabSearch'

const fakeData = [
  { id: 1, word: 'Xin', word_translation: 'Hello', example: '', example_translation: '', category: '' },
  { id: 2, word: 'Tạm biệt', word_translation: 'Goodbye', example: '', example_translation: '', category: '' },
]

// A small component to “run” our hook and hand back its API via onReady
function HookRunner({ onReady }) {
  const { filtered, loading, setQuery } = useVocabSearch()

  useEffect(() => {
    if (!loading) {
      onReady({ filtered, setQuery })
    }
  }, [loading, filtered, setQuery, onReady])

  return loading
    ? <div data-testid="loading">loading…</div>
    : <div data-testid="done" />
}

describe('useVocabSearch hook', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url) =>
      Promise.resolve({
        ok: true,
        json: async () => fakeData,
      })
    )
  })

  afterEach(() => {
    delete global.fetch
  })

  it('loads data and then filters based on query', async () => {
    let hook
    render(<HookRunner onReady={h => (hook = h)} />)

    // wait for initial load to finish
    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument())

    // at this point hook.filtered === fakeData
    expect(hook.filtered).toEqual(fakeData)

    // now filter down to just 'Xin'
    act(() => {
      hook.setQuery('Xin')
    })

    // wait for the next update in filtered
    await waitFor(() => {
      expect(hook.filtered).toEqual([
        { id: 1, word: 'Xin', word_translation: 'Hello', example: '', example_translation: '', category: '' },
      ])
    })
  })
})