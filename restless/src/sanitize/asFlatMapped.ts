import { Either, Sanitizer, SanitizerFailure } from './sanitizer'

export const asFlatMapped = <T, U> (
  sanitizer: Sanitizer<T>,
  flatMapFn: (value: T, path: string) => Either<SanitizerFailure[], U>
): Sanitizer<U> => (value, path) => {
  const result = sanitizer(value, path)
  if (Either.isRight(result)) {
    return flatMapFn(result.right, path)
  }
  return result
}
