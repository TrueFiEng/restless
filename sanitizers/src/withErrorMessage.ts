import { Result, Sanitizer } from './sanitizer'

export const withErrorMessage = <T>(sanitizer: Sanitizer<T>, expected: string): Sanitizer<T> =>
  (value, path) => {
    const result = sanitizer(value, path)
    if (Result.isLeft(result)) {
      return Result.left([{ path, expected }])
    } else {
      return result
    }
  }
