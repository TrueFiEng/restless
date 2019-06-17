import { expect } from 'chai'
import { asString } from '../../src/sanitize/asString'
import { Either } from '../../src/sanitize/sanitizer'

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
