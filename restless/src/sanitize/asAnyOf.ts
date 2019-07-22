import { Either, Sanitizer, SanitizerFailure } from './sanitizer'

type NonEmptyArray<T> = [T, ...T[]]

interface AsAnyOf {
  <A> (sanitizers: [Sanitizer<A>], expected: string): Sanitizer<A>
  <A, B> (sanitizers: [Sanitizer<A>, Sanitizer<B>], expected: string): Sanitizer<A | B>
  <A, B, C> (sanitizers: [Sanitizer<A>, Sanitizer<B>, Sanitizer<C>], expected: string): Sanitizer<A | B | C>
  <A, B, C, D> (sanitizers: [Sanitizer<A>, Sanitizer<B>, Sanitizer<C>, Sanitizer<D>], expected: string):
    Sanitizer<A | B | C | D>

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
