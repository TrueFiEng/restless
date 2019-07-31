import { Result, Sanitizer } from './sanitizer'

export const asMatching = (re: RegExp, message?: string): Sanitizer<string> =>
  (value, path) => typeof value === 'string' && re.test(value)
    ? Result.right(value)
    : Result.left([{ path, expected: message || `string matching ${re}` }])
