// tests/components/SearchBar.test.js
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '../../app/components/SearchBar'

describe('<SearchBar />', () => {
  it('renders an input and calls setQuery on change', () => {
    const mockSetQuery = jest.fn()
    render(<SearchBar query="foo" setQuery={mockSetQuery} />)

    const input = screen.getByRole('textbox', { name: /search vocabulary/i })
    // initial value
    expect(input.value).toBe('foo')

    // simulate typing
    fireEvent.change(input, { target: { value: 'bar' } })
    expect(mockSetQuery).toHaveBeenCalledWith('bar')
  })
})
