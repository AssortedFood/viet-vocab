// tests/api/speechRoute.test.js
import { POST } from '../../app/api/speech/route.js'
import { textToSpeech } from '../../lib/elevenlabs.js'

jest.mock('../../lib/elevenlabs.js', () => ({
  textToSpeech: jest.fn(),
}))

describe('POST /api/speech', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns 400 if text is missing', async () => {
    const req = { json: async () => ({}) }
    const res = await POST(req)

    expect(res.status).toBe(400)
    expect(res._body).toBe('Missing text parameter.')
  })

  it('returns 200 and audio buffer when text provided', async () => {
    const buf = Buffer.from([0xAA, 0xBB])
    textToSpeech.mockResolvedValue(buf)

    const req = { json: async () => ({ text: 'hello world' }) }
    const res = await POST(req)

    expect(textToSpeech).toHaveBeenCalledWith('hello world')
    expect(res.status).toBe(200)
    expect(res.headers['Content-Type']).toBe('audio/mpeg')
    expect(res._body).toBe(buf)
  })
})
