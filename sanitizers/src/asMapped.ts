import { Result, Sanitizer } from './sanitizer'

export const asMapped = <T, U>(
  sanitizer: Sanitizer<T>,
  mapFn: (value: T) => U
): Sanitizer<U> => (value, path) => {
  const result = sanitizer(value, path)
  if (Result.isOk(result)) {
    return Result.ok(mapFn(result.data))
  }
  return result
}
