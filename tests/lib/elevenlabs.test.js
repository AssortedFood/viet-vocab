// tests/lib/elevenlabs.test.js
import axios from 'axios'
import { textToSpeech } from '../../lib/elevenlabs.js'

jest.mock('axios')

describe('textToSpeech', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    process.env.ELEVENLABS_API_KEY = 'fake‑api‑key'
  })

  it('returns a Buffer when the ElevenLabs API responds successfully', async () => {
    // mock binary data
    const arrayBuffer = new ArrayBuffer(4)
    axios.request.mockResolvedValue({ data: arrayBuffer })

    const result = await textToSpeech('Xin chào')

    // ensure axios was called with the right shape
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('/v1/text-to-speech/'),
        headers: expect.objectContaining({
          accept: 'audio/mpeg',
          'xi-api-key': 'fake‑api‑key',
        }),
        data: expect.objectContaining({
          text: 'Xin chào',
          output_format: 'mp3_44100_128',
          model_id: 'eleven_flash_v2_5',
          language_code: 'vi',
        }),
        responseType: 'arraybuffer',
      })
    )

    // result must be a Buffer wrapping that ArrayBuffer
    expect(Buffer.isBuffer(result)).toBe(true)
    expect(result).toEqual(Buffer.from(arrayBuffer))
  })

  it('throws if the ElevenLabs API request fails', async () => {
    const err = new Error('Network failure')
    axios.request.mockRejectedValue(err)

    await expect(textToSpeech('fail')).rejects.toThrow('Network failure')
  })
})
