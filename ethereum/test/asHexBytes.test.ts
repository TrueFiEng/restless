import { Result } from '@restless/sanitizers'
import { expect } from 'chai'
import { asHexBytes } from '../src/asHexBytes'

describe('asHexBytes', () => {
  it('sanitizes strings that are valid hex of specified length', async () => {
    const as5Bytes = asHexBytes(5)
    const result = as5Bytes('0x1122aabb33', '')
    expect(result).to.deep.equal(Result.ok('0x1122aabb33'))
  })

  it('keeps the string normalized', async () => {
    const as5Bytes = asHexBytes(5)
    const result = as5Bytes('0x1122AAbB33', '')
    expect(result).to.deep.equal(Result.ok('0x1122aabb33'))
  })

  it('does not accept strings of invalid length', async () => {
    const as5Bytes = asHexBytes(5)
    const result = as5Bytes('0x1122AAbB3', 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'hex string representing 5 bytes' }])
    )
  })

  it('does not accept non hex strings', async () => {
    const as5Bytes = asHexBytes(5)
    const result = as5Bytes('boo', 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'hex string representing 5 bytes' }])
    )
  })

  it('does not accept non strings', async () => {
    const as5Bytes = asHexBytes(5)
    const result = as5Bytes(1234, 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'hex string representing 5 bytes' }])
    )
  })
})
