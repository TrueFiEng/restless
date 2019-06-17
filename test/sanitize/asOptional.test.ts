import { expect } from 'chai'
import { asOptional } from '../../src/sanitize/asOptional'
import { asString } from '../../src/sanitize/asString'
import { Either } from '../../src/sanitize/sanitizer'

describe('asOptional', () => {
  it('sanitizes using the nested sanitizer', async () => {
    const asOptionalString = asOptional(asString)
    const result = asOptionalString('abc', '')
    expect(result).to.deep.equal(Either.right('abc'))
  })

  it('returns nested sanitizer errors', async () => {
    const asOptionalString = asOptional(asString)
    const result = asOptionalString(false, 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'string' }])
    )
  })

  it('sanitizes undefined', async () => {
    const asOptionalString = asOptional(asString)
    const result = asOptionalString(undefined, 'path')
    expect(result).to.deep.equal(Either.right(undefined))
  })

  it('sanitizes null', async () => {
    const asOptionalString = asOptional(asString)
    const result = asOptionalString(null, 'path')
    expect(result).to.deep.equal(Either.right(undefined))
  })
})
