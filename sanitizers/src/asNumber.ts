import { Result, Sanitizer } from './sanitizer'

const NUMBER_REGEX = /^-?\d*(\.\d+)?$/

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && !isNaN(value)

const isNumberString = (value: unknown): value is string =>
  typeof value === 'string' && value !== '' && NUMBER_REGEX.test(value)

export const asNumber: Sanitizer<number> = (value, path) => {
  if (isNumber(value)) {
    return Result.right(value)
  } else if (isNumberString(value)) {
    return Result.right(+value)
  }
  return Result.left([{ path, expected: 'number' }])
}
