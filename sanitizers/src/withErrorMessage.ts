import { Result, Sanitizer } from './model'

export const withErrorMessage = <T>(sanitizer: Sanitizer<T>, expected: string): Sanitizer<T> =>
  (value, path) => {
    const result = sanitizer(value, path)
    if (Result.isError(result)) {
      return Result.error([{ path, expected }])
    } else {
      return result
    }
  }
