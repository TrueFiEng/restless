import { Either, Sanitizer } from './sanitizer'

export const asMatching = (re: RegExp, message?: string): Sanitizer<string> =>
  (value, path) => typeof value === 'string' && re.test(value)
    ? Either.right(value)
    : Either.left([{ path, expected: message || `string matching ${re}` }])
