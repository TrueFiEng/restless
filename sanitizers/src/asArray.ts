import { Result, Sanitizer, SanitizerFailure } from './sanitizer'

export const asArray = <T>(sanitizer: Sanitizer<T>): Sanitizer<T[]> =>
  (value, path) => {
    if (!Array.isArray(value)) {
      return Result.error([{ path, expected: 'array' }])
    }
    const results: T[] = []
    const errors: SanitizerFailure[] = []
    for (let i = 0; i < value.length; i++) {
      const result = sanitizer(value[i], `${path}[${i}]`)
      if (Result.isOk(result)) {
        results.push(result.data)
      } else {
        errors.push(...result.error)
      }
    }
    return errors.length > 0
      ? Result.error(errors)
      : Result.ok(results)
  }
