import { Result } from '@restless/sanitizers'
import { expect } from 'chai'
import { asTransactionHash } from '../src/asTransactionHash'

const EXAMPLE_HASH = '0x' + '1234abcd'.repeat(8)

describe('asTransactionHash', () => {
  it('sanitizes strings that are valid transaction hashes', async () => {
    const result = asTransactionHash(EXAMPLE_HASH, '')
    expect(result).to.deep.equal(Result.ok(EXAMPLE_HASH))
  })

  it('keeps the string normalized', async () => {
    const result = asTransactionHash('0x' + '1234aBCd'.repeat(8), '')
    expect(result).to.deep.equal(Result.ok(EXAMPLE_HASH))
  })

  it('does not accept strings of invalid length', async () => {
    const result = asTransactionHash('0x1234', 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'transaction hash' }])
    )
  })

  it('does not accept non hex strings', async () => {
    const result = asTransactionHash('foo', 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'transaction hash' }])
    )
  })

  it('does not accept non strings', async () => {
    const result = asTransactionHash(1234, 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'transaction hash' }])
    )
  })
})
