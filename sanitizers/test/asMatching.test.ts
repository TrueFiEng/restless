import { expect } from 'chai'
import { asMatching, Result } from '../src'

describe('asMatching', () => {
  it('sanitizes strings', async () => {
    const asMyString = asMatching(/.*/)
    const result = asMyString('hello', '')
    expect(result).to.deep.equal(Result.right('hello'))
  })

  it('does not accept non-strings', async () => {
    const asMyString = asMatching(/.*/)
    const result = asMyString(123, 'path')
    expect(result).to.deep.equal(
      Result.left([{ path: 'path', expected: 'string matching /.*/' }])
    )
  })

  it('checks the regex', async () => {
    const asMyString = asMatching(/^a?b$/)
    const result = asMyString('ac', 'path')
    expect(result).to.deep.equal(
      Result.left([{ path: 'path', expected: 'string matching /^a?b$/' }])
    )
  })

  it('accepts a custom message', async () => {
    const asMyString = asMatching(/^a?b$/, 'foo')
    const result = asMyString('ac', 'path')
    expect(result).to.deep.equal(
      Result.left([{ path: 'path', expected: 'foo' }])
    )
  })
})
