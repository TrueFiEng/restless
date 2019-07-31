import { Result, Sanitizer } from './sanitizer'

export const asString: Sanitizer<string> = (value, path) =>
  typeof value === 'string'
    ? Result.right(value)
    : Result.left([{ path, expected: 'string' }])
