import { expect } from 'chai'
import { asArray, asNumber, Either } from '../src'

describe('asArray', () => {
  it('sanitizes empty arrays', async () => {
    const asMyArray = asArray(asNumber)
    const result = asMyArray([], '')
    expect(result).to.deep.equal(Either.right([]))
  })

  it('sanitizes non-empty arrays', async () => {
    const asMyArray = asArray(asNumber)
    const result = asMyArray([1, 2], '')
    expect(result).to.deep.equal(Either.right([1, 2]))
  })

  it('does not-accept non-arrays', async () => {
    const asMyArray = asArray(asNumber)
    const result = asMyArray('foo', 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'array' }])
    )
  })

  it('returns errors from nested sanitizers', async () => {
    const asMyArray = asArray(asNumber)
    const result = asMyArray([1, 'a', 'b'], 'path')
    expect(result).to.deep.equal(Either.left([
      { path: 'path[1]', expected: 'number' },
      { path: 'path[2]', expected: 'number' }
    ]))
  })
})
