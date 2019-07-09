import { Either, Sanitizer } from './sanitizer'

export const asString: Sanitizer<string> = (value, path) =>
  typeof value === 'string'
    ? Either.right(value)
    : Either.left([{ path, expected: 'string' }])
