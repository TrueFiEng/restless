import { Either, Sanitizer } from './sanitizer'

export const asOptional = <T> (sanitizer: Sanitizer<T>): Sanitizer<T | undefined> =>
  (value, path) => value == null
    ? Either.right(undefined)
    : sanitizer(value, path)
