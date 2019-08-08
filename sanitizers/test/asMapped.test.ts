import { expect } from 'chai'
import { asMapped, asString, Result } from '../src'

describe('asMapped', () => {
  it('sanitizes using the nested sanitizer and maps the result', async () => {
    const asLowercaseString = asMapped(asString, (x) => x.toLowerCase())
    const result = asLowercaseString('ABC', '')
    expect(result).to.deep.equal(Result.ok('abc'))
  })

  it('handles different types', async () => {
    const asStringEmptiness = asMapped(asString, (x) => x !== '')
    const result = asStringEmptiness('ABC', '')
    expect(result).to.deep.equal(Result.ok(true))
  })

  it('returns nested sanitizer errors', async () => {
    const asLowercaseString = asMapped(asString, (x) => x.toLowerCase())
    const result = asLowercaseString(false, 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'string' }])
    )
  })
})
