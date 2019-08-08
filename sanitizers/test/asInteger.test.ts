import { expect } from 'chai'
import { asInteger, Result } from '../src'

describe('asInteger', () => {
  it('sanitizes strings containing integers', async () => {
    const result = asInteger('-123', '')
    expect(result).to.deep.equal(Result.ok(-123))
  })

  it('does not accept non-integer strings', async () => {
    const result = asInteger('12abc', 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'integer' }])
    )
  })

  it('sanitizes integers', async () => {
    const result = asInteger(123, '')
    expect(result).to.deep.equal(Result.ok(123))
  })

  it('sanitizes negative integers', async () => {
    const result = asInteger(-123, '')
    expect(result).to.deep.equal(Result.ok(-123))
  })

  it('does not accept floating point values', async () => {
    const result = asInteger(123.45, 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'integer' }])
    )
  })

  it('does not accept NaN', async () => {
    const result = asInteger(NaN, 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'integer' }])
    )
  })

  it('does not accept types other than integer or string', async () => {
    const result = asInteger(true, 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'integer' }])
    )
  })
})
