// tests/api/audioRoute.test.js
import { GET } from '../../app/api/audio/route.js'
import { getDB } from '../../lib/db.js'

jest.mock('../../lib/db.js')

describe('GET /api/audio', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns 400 if id or type missing', async () => {
    const req = { url: 'http://localhost/api/audio' }
    const res = await GET(req)

    expect(res.status).toBe(400)
    expect(res._body).toBe('Missing id or type parameter.')
  })

  it('returns 404 if no audio found', async () => {
    const fakeDb = { get: jest.fn().mockResolvedValue({}) }
    getDB.mockResolvedValue(fakeDb)

    const req = { url: 'http://localhost/api/audio?id=1&type=word_audio' }
    const res = await GET(req)

    expect(fakeDb.get).toHaveBeenCalledWith(
      'SELECT word_audio FROM vocab WHERE id = ?',
      ['1']
    )
    expect(res.status).toBe(404)
    expect(res._body).toBe('Audio not found.')
  })

  it('returns 200 and the audio buffer when present', async () => {
    const buffer = Buffer.from([0x01, 0x02, 0x03])
    const fakeDb = { get: jest.fn().mockResolvedValue({ word_audio: buffer }) }
    getDB.mockResolvedValue(fakeDb)

    const req = { url: 'http://localhost/api/audio?id=42&type=word_audio' }
    const res = await GET(req)

    expect(fakeDb.get).toHaveBeenCalledWith(
      'SELECT word_audio FROM vocab WHERE id = ?',
      ['42']
    )
    expect(res.status).toBe(200)
    expect(res.headers['Content-Type']).toBe('audio/mpeg')
    expect(res._body).toBe(buffer)
  })
})