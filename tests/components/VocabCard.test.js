// tests/components/VocabCard.test.js
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import VocabCard from '../../app/components/VocabCard'

describe('<VocabCard />', () => {
  const vocab = {
    id: 7,
    word: 'Xin chào',
    word_translation: 'Hello',
    example: 'Xin chào mọi người',
    example_translation: 'Hello everyone',
    category: 'Greetings',
  }

  it('renders all fields and wires up play/delete in view mode', () => {
    const mockDelete = jest.fn()
    const mockPlay = jest.fn()

    render(
      <VocabCard
        vocab={vocab}
        handleDeleteVocab={mockDelete}
        playAudio={mockPlay}
      />
    )

    // Content
    expect(screen.getByText(/xin chào\s*→\s*hello/i)).toBeInTheDocument()
    expect(screen.getByText(/Category:\s*Greetings/)).toBeInTheDocument()

    // Three icon‐buttons: [play word, play desc, delete]
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)

    // 1️⃣ Play word
    fireEvent.click(buttons[0])
    expect(mockPlay).toHaveBeenCalledWith(vocab.id, 'word_audio')

    // 2️⃣ Play example audio
    fireEvent.click(buttons[1])
    expect(mockPlay).toHaveBeenCalledWith(vocab.id, 'example_audio')

    // 3️⃣ Delete
    fireEvent.click(buttons[2])
    expect(mockDelete).toHaveBeenCalledWith(vocab.id)
  })
})
