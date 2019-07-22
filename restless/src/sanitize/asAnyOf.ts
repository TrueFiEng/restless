import { Either, Sanitizer, SanitizerFailure } from './sanitizer'

interface AsAnyOf {
  <A> (sanitizers: Array<Sanitizer<A>>, expected?: string): Sanitizer<A>
  <A, B> (sanitizers: Array<Sanitizer<A | B>>, expected?: string): Sanitizer<A | B>
  <A, B, C> (sanitizers: Array<Sanitizer<A | B | C>>, expected?: string): Sanitizer<A | B | C>
  <A, B, C, D> (sanitizers: Array<Sanitizer<A | B | C | D>>, expected?: string): Sanitizer<A | B | C | D>
  (sanitizers: Array<Sanitizer<any>>, expected?: string): Sanitizer<any>
}

export const asAnyOf: AsAnyOf = (
  sanitizers: Array<Sanitizer<any>>,
  expected: string = 'as any of'
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
