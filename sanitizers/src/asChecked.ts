import { Result, Sanitizer } from './model'

export function asChecked<T, U extends T> (
  sanitizer: Sanitizer<T>,
  predicate: (value: T) => value is U,
  expected?: string
): Sanitizer<U>
export function asChecked<T> (
  sanitizer: Sanitizer<T>,
  predicate: (value: T) => boolean,
  expected?: string
): Sanitizer<T>
export function asChecked<T> (
  sanitizer: Sanitizer<T>,
  predicate: (value: T) => boolean,
  expected: string = 'custom logic'
): Sanitizer<T> {
  return (value, path) => {
    const result = sanitizer(value, path)
    if (Result.isOk(result) && !predicate(result.ok)) {
      return Result.error([{ path, expected }])
    }
    return result
  }
}
