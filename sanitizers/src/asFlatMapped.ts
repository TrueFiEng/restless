import { Result, Sanitizer, SanitizerFailure } from './sanitizer'

export const asFlatMapped = <T, U>(
  sanitizer: Sanitizer<T>,
  flatMapFn: (value: T, path: string) => Result<SanitizerFailure[], U>
): Sanitizer<U> => (value, path) => {
  const result = sanitizer(value, path)
  if (Result.isOk(result)) {
    return flatMapFn(result.data, path)
  }
  return result
}
