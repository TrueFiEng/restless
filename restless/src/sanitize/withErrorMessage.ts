import { Either, Sanitizer } from './sanitizer'

export const withErrorMessage = <T>(sanitizer: Sanitizer<T>, expected: string): Sanitizer<T> =>
  (value, path) => {
    const result = sanitizer(value, path)
    if (Either.isLeft(result)) {
      return Either.left([{ expected, path }])
    } else {
      return result
    }
  }
