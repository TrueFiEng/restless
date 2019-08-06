import { Either, Sanitizer } from '@restless/sanitizers'
import { utils } from 'ethers'

export const asEthAddress: Sanitizer<string> = (value, path) => {
  try {
    if (typeof value === 'string') {
      return Either.right(utils.getAddress(value))
    }
  } catch {} // tslint:disable-line
  return Either.left([{ path, expected: 'ethereum address' }])
}
