import { Result, Sanitizer } from './model'

export const asOptional = <T> (sanitizer: Sanitizer<T>): Sanitizer<T | undefined> =>
  (value, path) => value == null
    ? Result.ok(undefined)
    : sanitizer(value, path)
