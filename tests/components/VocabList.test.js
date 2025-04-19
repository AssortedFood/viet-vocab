// tests/components/VocabList.test.js
import React from 'react'
import { render, screen } from '@testing-library/react'
import VocabList from '../../app/components/VocabList'

describe('<VocabList />', () => {
  it('renders a list of VocabCard components', () => {
    const vocabList = [
      { id: 1, word: 'A', translation: '1', description: '', category: '', },
      { id: 2, word: 'B', translation: '2', description: '', category: '', },
    ]

    render(
      <VocabList
        vocabList={vocabList}
        editingWordId={null}
        editingWord={null}
        startEditing={() => {}}
        handleEditChange={() => {}}
        handleEditSave={() => {}}
        cancelEditing={() => {}}
        handleDeleteVocab={() => {}}
        playAudio={() => {}}
      />
    )

    // Should find both cards by their “word → translation” text
    expect(screen.getByText(/A\s*→\s*1/)).toBeInTheDocument()
    expect(screen.getByText(/B\s*→\s*2/)).toBeInTheDocument()
  })
})
