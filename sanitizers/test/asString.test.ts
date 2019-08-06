import { expect } from 'chai'
import { asString, Either } from '../src'

describe('asString', () => {
  it('sanitizes strings', async () => {
    const result = asString('hello', '')
    expect(result).to.deep.equal(Either.right('hello'))
  })

  it('does not accept non-strings', async () => {
    const result = asString(123, 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'string' }])
    )
  })
})
