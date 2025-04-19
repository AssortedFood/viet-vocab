// tests/components/AddVocabForm.test.js
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AddVocabForm from '../../app/components/AddVocabForm'

describe('AddVocabForm', () => {
  it('shows a validation error and does NOT call handleAddVocab when both inputs are empty', () => {
    const mockHandleAdd = jest.fn()
    const mockSetNewWord = jest.fn()

    render(
      React.createElement(AddVocabForm, {
        newWord: { word: '', translation: '' },
        setNewWord: mockSetNewWord,
        handleAddVocab: mockHandleAdd,
      })
    )

    const addButton = screen.getByRole('button', { name: /add vocab/i })
    fireEvent.click(addButton)

    // Expect error message to appear
    expect(
      screen.getByText(
        /please enter either a vietnamese word or an english translation/i
      )
    ).toBeInTheDocument()

    // handleAddVocab should NOT have been called
    expect(mockHandleAdd).not.toHaveBeenCalled()
  })
})

it('calls handleAddVocab once when at least one field is non‑empty', async () => {
  const mockHandleAdd = jest.fn().mockResolvedValue()
  const mockSetNewWord = jest.fn()
  // Start with a non‑empty word
  const newWord = { word: 'xin', translation: '' }

  render(
    React.createElement(AddVocabForm, {
      newWord,
      setNewWord: mockSetNewWord,
      handleAddVocab: mockHandleAdd,
    })
  )

  const addButton = screen.getByRole('button', { name: /add vocab/i })
  fireEvent.click(addButton)

  // handleAddVocab should be called exactly once
  expect(mockHandleAdd).toHaveBeenCalledTimes(1)
})
