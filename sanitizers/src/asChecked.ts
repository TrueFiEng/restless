import { Either, Sanitizer } from './model'

export const asChecked = <T> (
  sanitizer: Sanitizer<T>,
  predicate: (value: T) => boolean,
  expected: string = 'custom logic'
): Sanitizer<T> => (value, path) => {
  const result = sanitizer(value, path)
  if (Either.isRight(result) && !predicate(result.right)) {
    return Either.left([{ path, expected }])
  }
  return result
}
