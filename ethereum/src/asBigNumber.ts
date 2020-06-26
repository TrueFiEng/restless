import { Result, Sanitizer } from '@restless/sanitizers'
import { BigNumber } from 'ethers'

export const asBigNumber: Sanitizer<BigNumber> = (value, path) => {
  try {
    if (BigNumber.isBigNumber(value)) {
      return Result.ok(value)
    } else if (typeof value === 'string' || typeof value === 'number') {
      return Result.ok(BigNumber.from(value))
    }
  } catch {} // tslint:disable-line
  return Result.error([{ path, expected: 'big number' }])
}
