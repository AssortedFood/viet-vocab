// tests/api/vocabRoute.test.js

// 1) Polyfill fetch for OpenAI
import 'openai/shims/node'

// 2) Stub out the OpenAI and Zod helpers so imports in lib/gpt.js don't break
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: { completions: { create: jest.fn() } }
  }))
}))
jest.mock('openai/helpers/zod', () => ({
  zodResponseFormat: () => jest.fn()
}))

// Now import your route handlers
import {
  GET as getHandler,
  POST as postHandler,
  DELETE as deleteHandler,
  PUT as putHandler,
  PATCH as patchHandler,
} from '../../app/api/vocab/route.js'
import * as vocabLib from '../../lib/vocab.js'

jest.mock('../../lib/vocab.js')

describe('app/api/vocab/route.js handlers', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('GET handler', () => {
    it('calls getAllVocab with default params and returns 200', async () => {
      const fakeData = [
        {
          id: 1,
          word: 'test',
          translation: 'test',
          description: '',
          category: '',
          familiarity: 1,
          createdAt: '2025-04-19',
        },
      ]
      vocabLib.getAllVocab.mockResolvedValue(fakeData)

      const req = { url: 'http://localhost/api/vocab' }
      const res = await getHandler(req)

      expect(vocabLib.getAllVocab).toHaveBeenCalledWith({ sortBy: 'createdAt', search: null })
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual(fakeData)
    })

    it('passes sortBy and search from query params', async () => {
      vocabLib.getAllVocab.mockResolvedValue([])

      const req = { url: 'http://localhost/api/vocab?sortBy=word&search=foo' }
      const res = await getHandler(req)

      expect(vocabLib.getAllVocab).toHaveBeenCalledWith({ sortBy: 'word', search: 'foo' })
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual([])
    })
  })

  describe('POST handler', () => {
    it('returns 201 with lastID on success', async () => {
      vocabLib.addVocab.mockResolvedValue({ lastID: 42 })

      const req = { json: async () => ({ word: 'xin', translation: 'hello' }) }
      const res = await postHandler(req)

      expect(vocabLib.addVocab).toHaveBeenCalledWith('xin', 'hello', '', '')
      expect(res.status).toBe(201)
      expect(await res.json()).toEqual({ success: true, lastID: 42 })
    })

    it('returns 400 if word and translation missing', async () => {
      const req = { json: async () => ({}) }
      const res = await postHandler(req)

      expect(res.status).toBe(400)
      expect(await res.json()).toEqual({ error: 'Either word or translation is required.' })
    })
  })

  describe('DELETE handler', () => {
    it('returns 200 on delete with id', async () => {
      vocabLib.deleteVocab.mockResolvedValue({})
      const req = { url: 'http://localhost/api/vocab?id=99' }
      const res = await deleteHandler(req)

      expect(vocabLib.deleteVocab).toHaveBeenCalledWith('99')
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual({ success: true, deletedID: '99' })
    })

    it('returns 400 when id is missing', async () => {
      const req = { url: 'http://localhost/api/vocab' }
      const res = await deleteHandler(req)

      expect(res.status).toBe(400)
      expect(await res.json()).toEqual({ error: 'Missing vocab ID.' })
    })
  })

  describe('PUT handler', () => {
    it('returns 200 on valid familiarity update', async () => {
      vocabLib.updateFamiliarity.mockResolvedValue({})
      const req = { json: async () => ({ id: '5', score: 2 }) }
      const res = await putHandler(req)

      expect(vocabLib.updateFamiliarity).toHaveBeenCalledWith('5', 2)
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual({ success: true, updatedID: '5' })
    })

    it('returns 400 on invalid score', async () => {
      const req = { json: async () => ({ id: '5', score: 9 }) }
      const res = await putHandler(req)

      expect(res.status).toBe(400)
      expect(await res.json()).toEqual({ error: 'Invalid ID or familiarity score.' })
    })
  })

  describe('PATCH handler', () => {
    it('returns 200 on successful edit', async () => {
      vocabLib.editVocab.mockResolvedValue({})
      const payload = { id: '7', word: 'a', translation: 'b', description: 'd', category: 'c' }
      const req = { json: async () => payload }
      const res = await patchHandler(req)

      expect(vocabLib.editVocab).toHaveBeenCalledWith('7', 'a', 'b', 'd', 'c')
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual({ success: true, updatedID: '7' })
    })

    it('returns 400 when required fields missing', async () => {
      const req = { json: async () => ({ id: '7', word: 'a' }) }
      const res = await patchHandler(req)

      expect(res.status).toBe(400)
      expect(await res.json()).toEqual({ error: 'ID, word, and translation are required.' })
    })
  })
})
