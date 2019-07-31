import { Result, Sanitizer } from './sanitizer'

export const asMatching = (re: RegExp, message?: string): Sanitizer<string> =>
  (value, path) => typeof value === 'string' && re.test(value)
    ? Result.ok(value)
    : Result.error([{ path, expected: message || `string matching ${re}` }])
