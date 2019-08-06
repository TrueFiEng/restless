import { expect } from 'chai'
import { asNumber, asObject, Either, withErrorMessage } from '../src'

describe('withErrorMessage', () => {
  it('returns set error message if sanitizer fails', () => {
    const sanitizer = withErrorMessage(asObject({ a: asNumber }), 'foo')
    const result = sanitizer({ a: 'not a number' }, 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'foo' }])
    )
  })

  it('returns data if sanitization succeeded', () => {
    const sanitizer = withErrorMessage(asObject({ a: asNumber }), 'foo')
    const result = sanitizer({ a: 42 }, 'path')
    expect(result).to.deep.equal(Either.right({ a: 42 }))
  })
})
