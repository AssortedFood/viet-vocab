// tests/api/vocabAll.test.js
import { GET } from '../../app/api/vocab/all/route.js'
import { getDB } from '../../lib/db.js'

jest.mock('../../lib/db.js')

describe('GET /api/vocab/all', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns minimal fields when includeAudio=false', async () => {
    const fullRow = {
      id: 1,
      word: 'Xin chào',
      translation: 'Hello',
      description: 'Greeting',
      category: 'Greetings',
      familiarity: 2,
      createdAt: '2025-04-19T00:00:00.000Z',
      word_audio: Buffer.from('…'),
      description_audio: Buffer.from('…'),
    }
    const minimalRow = (({ word_audio, description_audio, ...r }) => r)(fullRow)
    const fakeDb = { all: jest.fn().mockResolvedValue([ minimalRow ]) }
    getDB.mockResolvedValue(fakeDb)

    const req = { url: 'http://localhost/api/vocab/all?includeAudio=false' }
    const res = await GET(req)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toEqual([ minimalRow ])

    // Only one arg is passed to db.all(), so assert on that
    expect(fakeDb.all).toHaveBeenCalledWith(
      expect.stringContaining('SELECT')
    )
  })

  it('includes audio fields when includeAudio=true', async () => {
    const fullRow = {
      id: 2,
      word: 'Tạm biệt',
      translation: 'Goodbye',
      description: 'Farewell',
      category: 'Greetings',
      familiarity: 1,
      createdAt: '2025-04-19T00:00:00.000Z',
      word_audio: Buffer.from('AUDIO1'),
      description_audio: Buffer.from('AUDIO2'),
    }
    const fakeDb = { all: jest.fn().mockResolvedValue([ fullRow ]) }
    getDB.mockResolvedValue(fakeDb)

    const req = { url: 'http://localhost/api/vocab/all?includeAudio=true' }
    const res = await GET(req)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toEqual([ fullRow ])

    expect(fakeDb.all).toHaveBeenCalledWith(
      'SELECT * FROM vocab ORDER BY createdAt DESC'
    )
  })
})
