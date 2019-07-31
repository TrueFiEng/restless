import { Result, Sanitizer } from './sanitizer'

const BOOLEAN_REGEX = /^(true|false)$/

const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean'

const isBooleanString = (value: unknown): value is string =>
  typeof value === 'string' && BOOLEAN_REGEX.test(value)

export const asBoolean: Sanitizer<boolean> = (value, path) => {
  if (isBoolean(value)) {
    return Result.right(value)
  } else if (isBooleanString(value)) {
    return Result.right(value === 'true')
  }
  return Result.left([{ path, expected: 'boolean' }])
}
