import { Either, Sanitizer } from './model'

const NUMBER_REGEX = /^-?\d*(\.\d+)?$/

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && !isNaN(value)

const isNumberString = (value: unknown): value is string =>
  typeof value === 'string' && value !== '' && NUMBER_REGEX.test(value)

export const asNumber: Sanitizer<number> = (value, path) => {
  if (isNumber(value)) {
    return Either.right(value)
  } else if (isNumberString(value)) {
    return Either.right(+value)
  }
  return Either.left([{ path, expected: 'number' }])
}
