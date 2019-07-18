import { Either, Sanitizer } from '@restless/restless'
import { utils } from 'ethers'

export const asBigNumber: Sanitizer<utils.BigNumber> = (value, path) => {
  try {
    if (typeof value === 'string' || typeof value === 'number') {
      return Either.right(utils.bigNumberify(value))
    }
  } catch {}
  return Either.left([{ path, expected: 'big number' }])
}
