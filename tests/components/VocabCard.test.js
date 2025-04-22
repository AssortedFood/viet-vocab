// tests/components/VocabCard.test.js
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import VocabCard from '../../app/components/VocabCard'

describe('<VocabCard />', () => {
  const vocab = {
    id: 7,
    word: 'xin',
    translation: 'hello',
    description: 'greeting',
    category: 'test',
  }

  it('renders all fields and wires up play/delete in view mode', () => {
    const mockDelete = jest.fn()
    const mockPlay = jest.fn()

    render(
      <VocabCard
        vocab={vocab}
        editing={false}
        handleDeleteVocab={mockDelete}
        playAudio={mockPlay}
      />
    )

    // Content
    expect(screen.getByText(/xin\s*→\s*hello/)).toBeInTheDocument()
    expect(screen.getByText(/greeting/)).toBeInTheDocument()
    expect(screen.getByText(/Category:\s*test/)).toBeInTheDocument()

    // Three icon‐buttons: [play word, play desc, delete]
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)

    // 1️⃣ Play word
    fireEvent.click(buttons[0])
    expect(mockPlay).toHaveBeenCalledWith(vocab.id, 'word_audio')

    // 2️⃣ Play description
    fireEvent.click(buttons[1])
    expect(mockPlay).toHaveBeenCalledWith(vocab.id, 'description_audio')

    // 3️⃣ Delete
    fireEvent.click(buttons[2])
    expect(mockDelete).toHaveBeenCalledWith(vocab.id)
  })
})
