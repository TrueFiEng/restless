import { Result, Sanitizer } from '@restless/sanitizers'
import { utils } from 'ethers'

export function asHexBytes (count: number): Sanitizer<string> {
  const regex = new RegExp(`^0x[0-9a-fA-F]{${count * 2}}$`)
  return (value, path) => {
    if (typeof value === 'string' && regex.test(value)) {
      return Result.ok(utils.hexlify(value).toLowerCase())
    } else {
      return Result.error([{ path, expected: `hex string representing ${count} bytes` }])
    }
  }
}
