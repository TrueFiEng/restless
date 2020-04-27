import { expect } from 'chai'
import { asNumber, castOr } from '../src'

describe('castOr', () => {
  it('can cast values', async () => {
    const data = '123'
    const result = castOr(data, asNumber, 5)
    expect(result).to.equal(123)
  })

  it('returns default value if sanitization fails', async () => {
    const data = 'foo'
    const result = castOr(data, asNumber, 5)
    expect(result).to.equal(5)
  })

  it('sanitizer and default value can have different types (undefined)', async () => {
    const data = 'foo'
    const result = castOr(data, asNumber, undefined)
    expect(result).to.equal(undefined)
  })

  it('sanitizer and default value can have different types (string)', async () => {
    const data = 'foo'
    const result = castOr(data, asNumber, 'bar')
    expect(result).to.equal('bar')
  })
})
