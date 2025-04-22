// tests/lib/vocab.test.js

// 1) Polyfill the Fetch API for OpenAI
import 'openai/shims/node'

// 2) Stub out OpenAI imports so lib/gpt.js doesn't error
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: { completions: { create: jest.fn() } }
  }))
}))
jest.mock('openai/helpers/zod', () => ({
  zodResponseFormat: () => jest.fn()
}))

// 3) Mock our dependencies
jest.mock('../../lib/db.js')
jest.mock('../../lib/gpt.js')
jest.mock('../../lib/elevenlabs.js')

import { getAllVocab, addVocab } from '../../lib/vocab.js'
import { getDB } from '../../lib/db.js'
import { correctVocabEntry } from '../../lib/gpt.js'
import { textToSpeech } from '../../lib/elevenlabs.js'

describe('getAllVocab()', () => {
  beforeEach(() => jest.resetAllMocks())

  it('fetches all rows when no search and default sort', async () => {
    const fakeDb = { all: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]) }
    getDB.mockResolvedValue(fakeDb)

    const rows = await getAllVocab({ sortBy: 'createdAt', search: null })
    expect(fakeDb.all).toHaveBeenCalledWith(
      'SELECT * FROM vocab ORDER BY createdAt DESC',
      []
    )
    expect(rows).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('applies a search filter and custom sort', async () => {
    const fakeDb = { all: jest.fn().mockResolvedValue([{ id: 42 }]) }
    getDB.mockResolvedValue(fakeDb)

    const rows = await getAllVocab({ sortBy: 'word', search: 'foo' })
    expect(fakeDb.all).toHaveBeenCalledWith(
      expect.stringContaining(
        'SELECT * FROM vocab WHERE word LIKE ? OR word_translation LIKE ? OR example LIKE ? OR example_translation LIKE ? OR category LIKE ? ORDER BY word DESC'
      ),
      ['%foo%', '%foo%', '%foo%', '%foo%']
    )
    expect(rows).toEqual([{ id: 42 }])
  })
})

describe('addVocab()', () => {
  beforeEach(() => jest.resetAllMocks())

  it('inserts a new vocab, runs correction, generates audio, and updates the row', async () => {
    // Stub DB.run for INSERT and UPDATE calls
    const runMock = jest.fn()
      .mockResolvedValueOnce({ lastID: 10 })   // INSERT
      .mockResolvedValueOnce({ changes: 0 })   // text-UPDATE (no changes)
      .mockResolvedValueOnce({ changes: 1 })   // audio-UPDATE
    const fakeDb = { run: runMock }
    getDB.mockResolvedValue(fakeDb)

    // Stub GPT correction and TTS
    correctVocabEntry.mockResolvedValue({
      word: 'w', word_translation: 't', example: '', example_translation: '', category: ''
    })
    textToSpeech.mockResolvedValue(Buffer.from([0x01, 0x02]))

    const result = await addVocab('w', 't', '', '')

    // Initial INSERT
    expect(runMock).toHaveBeenCalledWith(
      `INSERT INTO vocab (word, word_translation, example, example_translation, category) VALUES (?, ?, ?, ?, ?)`,
      ['w', 't', '', '', '']
    )

    // Correction step
    expect(correctVocabEntry).toHaveBeenCalledWith('w', 't', '', '', '')

    // Text-to-speech for the word
    expect(textToSpeech).toHaveBeenCalledWith('w')

    // Final audio UPDATE
    expect(runMock).toHaveBeenLastCalledWith(
      `UPDATE vocab SET word_audio = ?, example_audio = ? WHERE id = ?`,
      [Buffer.from([0x01, 0x02]), null, 10]
    )

    expect(result).toEqual({ lastID: 10, success: true })
  })

  it('throws an error when both word and translation are missing', async () => {
    await expect(addVocab('', '')).rejects.toThrow(
      'Either word or translation is required.'
    )
  })
})
