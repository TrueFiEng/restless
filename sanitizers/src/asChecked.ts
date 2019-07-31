import { Result, Sanitizer } from './sanitizer'

export const asChecked = <T> (
  sanitizer: Sanitizer<T>,
  predicate: (value: T) => boolean,
  expected: string = 'custom logic'
): Sanitizer<T> => (value, path) => {
  const result = sanitizer(value, path)
  if (Result.isRight(result) && !predicate(result.right)) {
    return Result.left([{ path, expected }])
  }
  return result
}
