import { expect } from 'chai'
import { asFlatMapped } from '../../src/sanitize/asFlatMapped'
import { asString } from '../../src/sanitize/asString'
import { Either } from '../../src/sanitize/sanitizer'

describe('asFlatMapped', () => {
  it('sanitizes using the nested sanitizer and flat maps', async () => {
    const asStringInArray = asFlatMapped(asString, (x) => Either.right([x]))
    const result = asStringInArray('abc', '')
    expect(result).to.deep.equal(Either.right(['abc']))
  })

  it('returns nested sanitizer errors', async () => {
    const asStringInArray = asFlatMapped(asString, (x) => Either.right([x]))
    const result = asStringInArray(false, 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'string' }])
    )
  })

  it('returns flat mapped errors', async () => {
    const asStringInArray = asFlatMapped(
      asString,
      (value, path) => Either.left([{ path, expected: `not ${value}` }])
    )
    const result = asStringInArray('hello', 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'not hello' }])
    )
  })
})
