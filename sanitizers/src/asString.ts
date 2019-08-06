import { Either, Sanitizer } from './model'

export const asString: Sanitizer<string> = (value, path) =>
  typeof value === 'string'
    ? Either.right(value)
    : Either.left([{ path, expected: 'string' }])
