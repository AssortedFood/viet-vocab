// tests/components/VocabList.test.js
import React from 'react'
import { render, screen } from '@testing-library/react'
import VocabList from '../../app/components/VocabList'

describe('<VocabList />', () => {
  it('renders a list of VocabCard components', () => {
    const vocabList = [
      { id: 1, word: 'A', word_translation: '1', example: '', example_translation: '', category: '', },
      { id: 2, word: 'B', word_translation: '2', example: '', example_translation: '', category: '', },
    ]

    render(
      <VocabList
        vocabList={vocabList}
        handleDeleteVocab={() => {}}
        playAudio={() => {}}
      />
    )

    // Should find both cards by their “word → translation” text
    expect(screen.getByText(/A\s*→\s*1/)).toBeInTheDocument()
    expect(screen.getByText(/B\s*→\s*2/)).toBeInTheDocument()
  })
})
