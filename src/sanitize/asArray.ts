import { Either, Sanitizer, SanitizerFailure } from './sanitizer'

export const asArray = <T> (sanitizer: Sanitizer<T>): Sanitizer<T[]> =>
  (value, path) => {
    if (!Array.isArray(value)) {
      return Either.left([{ path, expected: 'array' }])
    }
    const results: T[] = []
    const errors: SanitizerFailure[] = []
    for (let i = 0; i < value.length; i++) {
      const result = sanitizer(value[i], `${path}[${i}]`)
      if (Either.isRight(result)) {
        results.push(result.right)
      } else {
        errors.push(...result.left)
      }
    }
    return errors.length > 0
      ? Either.left(errors)
      : Either.right(results)
  }
