import { expect } from 'chai'
import { Either } from '../../src/sanitize/sanitizer'
import { asNumber } from '../../src/sanitize/asNumber'

describe('asNumber', () => {
  it('sanitizes strings containing numbers', async () => {
    const result = asNumber('-123.5', '')
    expect(result).to.deep.equal(Either.right(-123.5))
  })

  it('does not accept non-number strings', async () => {
    const result = asNumber('12abc', 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'number' }])
    )
  })

  it('sanitizes numbers', async () => {
    const result = asNumber(123, '')
    expect(result).to.deep.equal(Either.right(123))
  })

  it('does not accept NaN', async () => {
    const result = asNumber(NaN, 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'number' }])
    )
  })

  it('does not accept types other than number or string', async () => {
    const result = asNumber(true, 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'number' }])
    )
  })
})
