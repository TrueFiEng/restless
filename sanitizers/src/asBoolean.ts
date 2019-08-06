import { Either, Sanitizer } from './model'

const BOOLEAN_REGEX = /^(true|false)$/

const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean'

const isBooleanString = (value: unknown): value is string =>
  typeof value === 'string' && BOOLEAN_REGEX.test(value)

export const asBoolean: Sanitizer<boolean> = (value, path) => {
  if (isBoolean(value)) {
    return Either.right(value)
  } else if (isBooleanString(value)) {
    return Either.right(value === 'true')
  }
  return Either.left([{ path, expected: 'boolean' }])
}
