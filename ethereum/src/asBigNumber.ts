import { Result, Sanitizer } from '@restless/sanitizers'
import { utils } from 'ethers'

export const asBigNumber: Sanitizer<utils.BigNumber> = (value, path) => {
  try {
    if (utils.BigNumber.isBigNumber(value)) {
      return Result.ok(value)
    } else if (typeof value === 'string' || typeof value === 'number') {
      return Result.ok(utils.bigNumberify(value))
    }
  } catch {} // tslint:disable-line
  return Result.error([{ path, expected: 'big number' }])
}
