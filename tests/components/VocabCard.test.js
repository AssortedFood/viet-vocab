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

  it('renders all fields and wires up play/edit/delete in view mode', () => {
    const mockStartEditing = jest.fn()
    const mockDelete = jest.fn()
    const mockPlay = jest.fn()

    render(
      <VocabCard
        vocab={vocab}
        editing={false}
        startEditing={mockStartEditing}
        handleDeleteVocab={mockDelete}
        playAudio={mockPlay}
      />
    )

    // Content
    expect(screen.getByText(/xin\s*→\s*hello/)).toBeInTheDocument()
    expect(screen.getByText(/greeting/)).toBeInTheDocument()
    expect(screen.getByText(/Category:\s*test/)).toBeInTheDocument()

    // Four icon‐buttons: [play word, play desc, edit, delete]
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)

    // 1️⃣ Play word
    fireEvent.click(buttons[0])
    expect(mockPlay).toHaveBeenCalledWith(vocab.id, 'word_audio')

    // 2️⃣ Play description
    fireEvent.click(buttons[1])
    expect(mockPlay).toHaveBeenCalledWith(vocab.id, 'description_audio')

    // 3️⃣ Edit
    fireEvent.click(buttons[2])
    expect(mockStartEditing).toHaveBeenCalledWith(vocab)

    // 4️⃣ Delete
    fireEvent.click(buttons[3])
    expect(mockDelete).toHaveBeenCalledWith(vocab.id)
  })

  it('shows input fields and wires up Save/Cancel in edit mode', () => {
    const mockSave = jest.fn()
    const mockCancel = jest.fn()
    const editingWord = { ...vocab }

    render(
      <VocabCard
        vocab={vocab}
        editing={true}
        editingWord={editingWord}
        handleEditChange={() => {}}
        handleEditSave={mockSave}
        cancelEditing={mockCancel}
      />
    )

    // Four text inputs
    expect(screen.getByLabelText(/Vietnamese/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/English Translation/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument()

    // Save & Cancel buttons
    const saveBtn = screen.getByRole('button', { name: /save/i })
    const cancelBtn = screen.getByRole('button', { name: /cancel/i })

    fireEvent.click(saveBtn)
    expect(mockSave).toHaveBeenCalledWith(vocab.id)

    fireEvent.click(cancelBtn)
    expect(mockCancel).toHaveBeenCalled()
  })
})
