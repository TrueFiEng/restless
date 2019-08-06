import { expect } from 'chai'
import { asNumber, Result } from '../src'

describe('asNumber', () => {
  it('sanitizes strings containing numbers', async () => {
    const result = asNumber('-123.5', '')
    expect(result).to.deep.equal(Result.ok(-123.5))
  })

  it('does not accept non-number strings', async () => {
    const result = asNumber('12abc', 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'number' }])
    )
  })

  it('sanitizes numbers', async () => {
    const result = asNumber(123, '')
    expect(result).to.deep.equal(Result.ok(123))
  })

  it('does not accept NaN', async () => {
    const result = asNumber(NaN, 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'number' }])
    )
  })

  it('does not accept types other than number or string', async () => {
    const result = asNumber(true, 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'number' }])
    )
  })
})
