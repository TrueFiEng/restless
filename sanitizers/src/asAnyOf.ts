import { Result, Sanitizer, Schema } from './model'

type NonEmptyArray<T> = [T, ...T[]]

interface AsAnyOf {
  <A> (sanitizers: Schema<[A]>, expected: string): Sanitizer<A>
  <A, B> (sanitizers: Schema<[A, B]>, expected: string): Sanitizer<A | B>
  <A, B, C> (sanitizers: Schema<[A, B, C]>, expected: string): Sanitizer<A | B | C>
  <A, B, C, D> (sanitizers: Schema<[A, B, C, D]>, expected: string): Sanitizer<A | B | C | D>

  (sanitizers: NonEmptyArray<Sanitizer<any>>, expected: string): Sanitizer<any>
}

export const asAnyOf: AsAnyOf = (
  sanitizers: Array<Sanitizer<any>>,
  expected: string
): Sanitizer<any> =>
  (value, path) => {
    if (sanitizers.length === 0) {
      return Result.ok(value)
    }
    for (const sanitizer of sanitizers) {
      const result = sanitizer(value, path)
      if (Result.isOk(result)) {
        return result
      }
    }
    return Result.error([{ path, expected }])
  }
