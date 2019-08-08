import { expect } from 'chai'
import { asOptional, asString, Result } from '../src'

describe('asOptional', () => {
  it('sanitizes using the nested sanitizer', async () => {
    const asOptionalString = asOptional(asString)
    const result = asOptionalString('abc', '')
    expect(result).to.deep.equal(Result.ok('abc'))
  })

  it('returns nested sanitizer errors', async () => {
    const asOptionalString = asOptional(asString)
    const result = asOptionalString(false, 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'string' }])
    )
  })

  it('sanitizes undefined', async () => {
    const asOptionalString = asOptional(asString)
    const result = asOptionalString(undefined, 'path')
    expect(result).to.deep.equal(Result.ok(undefined))
  })

  it('sanitizes null', async () => {
    const asOptionalString = asOptional(asString)
    const result = asOptionalString(null, 'path')
    expect(result).to.deep.equal(Result.ok(undefined))
  })
})
