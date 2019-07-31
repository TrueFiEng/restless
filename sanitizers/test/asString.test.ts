import { expect } from 'chai'
import { asString, Result } from '../src'

describe('asString', () => {
  it('sanitizes strings', async () => {
    const result = asString('hello', '')
    expect(result).to.deep.equal(Result.ok('hello'))
  })

  it('does not accept non-strings', async () => {
    const result = asString(123, 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'string' }])
    )
  })
})
