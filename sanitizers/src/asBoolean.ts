import { Result, Sanitizer } from './sanitizer'

const BOOLEAN_REGEX = /^(true|false)$/

const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean'

const isBooleanString = (value: unknown): value is string =>
  typeof value === 'string' && BOOLEAN_REGEX.test(value)

export const asBoolean: Sanitizer<boolean> = (value, path) => {
  if (isBoolean(value)) {
    return Result.ok(value)
  } else if (isBooleanString(value)) {
    return Result.ok(value === 'true')
  }
  return Result.error([{ path, expected: 'boolean' }])
}
