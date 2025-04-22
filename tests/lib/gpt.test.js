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
    const word_translation = 'thank you'
    const example = 'an example demonstrating usage'
    const example_translation = 'a translation of the example'
    const category = 'greetings'

    const result = await correctVocabEntry(word, word_translation, example, example_translation, category)

    expect(result).toEqual({
      word,
      word_translation,
      example,
      example_translation,
      category,
    })
  })
})
