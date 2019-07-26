import { expect } from 'chai'
import { asNumber, asObject, Either, withErrorMessage } from '../../src'

describe('withErrorMessage', () => {
  it('returns set error message if sanitizer fails', () => {
    const sanitizer = withErrorMessage(asObject({ a: asNumber }), 'foo')
    const res = { a: 'not a number' }

    expect(sanitizer(res, 'path')).to.equal(Either.left([{ expected: 'foo', path: 'path' }]))
  })

  it('returns data if sanitization succeeded', () => {
    const sanitizer = withErrorMessage(asObject({ a: asNumber }), 'foo')
    const res = { a: 42 }

    expect(sanitizer(res, 'path')).to.equal(Either.right(42))
  })
})
