import { expect } from 'chai'
import { asMapped, asString, Either } from '../src'

describe('asMapped', () => {
  it('sanitizes using the nested sanitizer and maps the result', async () => {
    const asLowercaseString = asMapped(asString, (x) => x.toLowerCase())
    const result = asLowercaseString('ABC', '')
    expect(result).to.deep.equal(Either.right('abc'))
  })

  it('handles different types', async () => {
    const asStringEmptiness = asMapped(asString, (x) => x !== '')
    const result = asStringEmptiness('ABC', '')
    expect(result).to.deep.equal(Either.right(true))
  })

  it('returns nested sanitizer errors', async () => {
    const asLowercaseString = asMapped(asString, (x) => x.toLowerCase())
    const result = asLowercaseString(false, 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'string' }])
    )
  })
})
