import { Either, Sanitizer, SanitizerFailure } from './sanitizer'

type NonEmptyArray<T> = [T, ...T[]]
type MapSanitizer<T> = { [K in keyof T]: Sanitizer<T[K]> }

interface AsAnyOf {
  <A> (sanitizers: MapSanitizer<[A]>, expected: string): Sanitizer<A>
  <A, B> (sanitizers: MapSanitizer<[A, B]>, expected: string): Sanitizer<A | B>
  <A, B, C> (sanitizers: MapSanitizer<[A, B, C]>, expected: string): Sanitizer<A | B | C>
  <A, B, C, D> (sanitizers: MapSanitizer<[A, B, C, D]>, expected: string): Sanitizer<A | B | C | D>

  (sanitizers: NonEmptyArray<Sanitizer<any>>, expected: string): Sanitizer<any>
}

export const asAnyOf: AsAnyOf = (
  sanitizers: Array<Sanitizer<any>>,
  expected: string
): Sanitizer<any> =>
  (value, path) => {
    if (sanitizers.length === 0) {
      return Either.right(value)
    }
    for (const sanitizer of sanitizers) {
      const result = sanitizer(value, path)
      if (Either.isRight(result)) {
        return result
      }
    }
    return Either.left([{ path, expected }])
  }
