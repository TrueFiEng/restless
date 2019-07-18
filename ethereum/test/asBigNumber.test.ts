import { expect } from 'chai'
import { utils } from 'ethers'
import { Either } from '@restless/restless'
import { asBigNumber } from '../src/asBigNumber'

describe('asBigNumber', () => {
  it('sanitizes strings that are valid big numbers', async () => {
    const result = asBigNumber('1234', '')
    expect(result).to.deep.equal(Either.right(utils.bigNumberify('1234')))
  })

  it('sanitizes hex strings that are valid big numbers', async () => {
    const result = asBigNumber('0xaBf3', '')
    expect(result).to.deep.equal(Either.right(utils.bigNumberify('0xaBf3')))
  })

  it('sanitizes numbers', async () => {
    const result = asBigNumber(1234, '')
    expect(result).to.deep.equal(Either.right(utils.bigNumberify(1234)))
  })

  it('does not accept non integers', async () => {
    const result = asBigNumber(1.234567, 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'big number' }])
    )
  })

  it('does not accept non big number strings', async () => {
    const result = asBigNumber('bla bla bla', 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'big number' }])
    )
  })

  it('does not accept types other than string or number', async () => {
    const result = asBigNumber(true, 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'big number' }])
    )
  })
})
