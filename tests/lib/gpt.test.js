// tests/lib/gpt.test.js
import { correctVocabEntry } from '../../lib/gpt.js'

describe('correctVocabEntry fallback when no API key', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...ORIGINAL_ENV }
    delete process.env.OPENAI_API_KEY
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns original values if OPENAI_API_KEY is unset', async () => {
    const word = 'cam on'
    const translation = 'thank you'
    const description = 'a phrase demonstrating usage'
    const category = 'greetings'

    const result = await correctVocabEntry(word, translation, description, category)

    expect(result).toEqual({
      word,
      translation,
      description,
      category,
    })
  })
})
