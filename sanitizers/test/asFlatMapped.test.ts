import { expect } from 'chai'
import { asFlatMapped, asString, Result } from '../src'

describe('asFlatMapped', () => {
  it('sanitizes using the nested sanitizer and flat maps', async () => {
    const asStringInArray = asFlatMapped(asString, (x) => Result.right([x]))
    const result = asStringInArray('abc', '')
    expect(result).to.deep.equal(Result.right(['abc']))
  })

  it('returns nested sanitizer errors', async () => {
    const asStringInArray = asFlatMapped(asString, (x) => Result.right([x]))
    const result = asStringInArray(false, 'path')
    expect(result).to.deep.equal(
      Result.left([{ path: 'path', expected: 'string' }])
    )
  })

  it('returns flat mapped errors', async () => {
    const asStringInArray = asFlatMapped(
      asString,
      (value, path) => Result.left([{ path, expected: `not ${value}` }])
    )
    const result = asStringInArray('hello', 'path')
    expect(result).to.deep.equal(
      Result.left([{ path: 'path', expected: 'not hello' }])
    )
  })
})
