import { expect } from 'chai'
import { asChecked, asString, Result } from '../src'

describe('asChecked', () => {
  it('sanitizes using the nested sanitizer', async () => {
    const asCheckedString = asChecked(asString, (x) => x !== '')
    const result = asCheckedString('abc', '')
    expect(result).to.deep.equal(Result.right('abc'))
  })

  it('returns nested sanitizer errors', async () => {
    const asCheckedString = asChecked(asString, (x) => x !== '')
    const result = asCheckedString(false, 'path')
    expect(result).to.deep.equal(
      Result.left([{ path: 'path', expected: 'string' }])
    )
  })

  it('returns error if check fails', async () => {
    const asCheckedString = asChecked(asString, (x) => x !== '')
    const result = asCheckedString('', 'path')
    expect(result).to.deep.equal(
      Result.left([{ path: 'path', expected: 'custom logic' }])
    )
  })

  it('returns error with custom message', async () => {
    const asCheckedString = asChecked(asString, (x) => x !== '', 'non-empty string')
    const result = asCheckedString('', 'path')
    expect(result).to.deep.equal(
      Result.left([{ path: 'path', expected: 'non-empty string' }])
    )
  })
})
