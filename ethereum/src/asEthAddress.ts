import { Result, Sanitizer } from '@restless/sanitizers'
import { utils } from 'ethers'

export const asEthAddress: Sanitizer<string> = (value, path) => {
  try {
    if (typeof value === 'string') {
      return Result.ok(utils.getAddress(value))
    }
  } catch {} // tslint:disable-line
  return Result.error([{ path, expected: 'ethereum address' }])
}
