import { Either, Sanitizer } from './sanitizer'

export const asMapped = <T, U> (
  sanitizer: Sanitizer<T>,
  mapFn: (value: T) => U,
): Sanitizer<U> => (value, path) => {
  const result = sanitizer(value, path)
  if (Either.isRight(result)) {
    return Either.right(mapFn(result.right))
  }
  return result
}
