import { Sanitizer, Result } from ".";

export const asNullable = <T>(sanitizer: Sanitizer<T>) : Sanitizer<T | null> =>
  (value, path) => value === null
    ? Result.ok(null)
      : value === undefined 
      ? Result.error([{ path: 'path', expected: 'not undefined' }])
        : sanitizer(value, path)
