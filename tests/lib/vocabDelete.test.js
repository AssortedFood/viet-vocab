// tests/lib/vocabDelete.test.js
import 'openai/shims/node'
jest.mock('../../lib/db.js')
import { getDB } from '../../lib/db.js'
import { deleteVocab, updateFamiliarity, getCategories } from '../../lib/vocab.js'

describe('lib/vocab delete/familiarity/categories', () => {
  beforeEach(() => jest.resetAllMocks())

  it('deleteVocab deletes the row by id', async () => {
    const db = { run: jest.fn().mockResolvedValue({ changes: 2 }) }
    getDB.mockResolvedValue(db)
    const res = await deleteVocab(42)
    expect(db.run).toHaveBeenCalledWith('DELETE FROM vocab WHERE id = ?', [42])
    expect(res).toEqual({ changes: 2, lastID: null, success: true })
  })

  it('updateFamiliarity sets a valid score', async () => {
    const db = { run: jest.fn().mockResolvedValue({ changes: 1 }) }
    getDB.mockResolvedValue(db)
    const res = await updateFamiliarity(3, 2)
    expect(db.run).toHaveBeenCalledWith(
      'UPDATE vocab SET familiarity = ? WHERE id = ?',
      [2, 3]
    )
    expect(res).toEqual({ changes: 1, lastID: null, success: true })
  })

  it('getCategories returns list of categories', async () => {
    const db = { all: jest.fn().mockResolvedValue(
      [{ category: 'A' }, { category: 'B' }, { category: 'A' }]
    ) }
    getDB.mockResolvedValue(db)
    const cats = await getCategories()
    expect(db.all).toHaveBeenCalledWith('SELECT DISTINCT category FROM vocab;')
    expect(cats).toEqual(['A', 'B', 'A'])
  })
})
