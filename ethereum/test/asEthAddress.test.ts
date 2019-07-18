import { expect } from 'chai'
import { Wallet } from 'ethers'
import { Either } from '@restless/restless'
import { asEthAddress } from '../src/asEthAddress'

describe('asEthAddress', () => {
  it('sanitizes strings that are valid ethereum addresses', async () => {
    const { address } = Wallet.createRandom()
    const result = asEthAddress(address, '')
    expect(result).to.deep.equal(Either.right(address))
  })

  it('keeps the string normalized', async () => {
    const { address } = Wallet.createRandom()
    const result = asEthAddress(address.toLowerCase(), '')
    expect(result).to.deep.equal(Either.right(address))
  })

  it('does not accept invalid ethereum addresses', async () => {
    const INVALID_ADDRESS = '0x7a4EdC939038dbB58befD7028b1625DFf2ca58b8'
    const result = asEthAddress(INVALID_ADDRESS, 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'ethereum address' }])
    )
  })

  it('does not accept non address strings', async () => {
    const NOT_AN_ADDRESS = 'bla bla bla'
    const result = asEthAddress(NOT_AN_ADDRESS, 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'ethereum address' }])
    )
  })

  it('does not accept non strings', async () => {
    const result = asEthAddress(123, 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'ethereum address' }])
    )
  })
})
