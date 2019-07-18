import { Either, Sanitizer, SanitizerFailure } from './sanitizer'

interface AsAnyOf {
  <A> (a: Sanitizer<A>): Sanitizer<A>
  <A, B> (a: Sanitizer<A>, b: Sanitizer<B>): Sanitizer<A | B>
  <A, B, C> (a: Sanitizer<A>, b: Sanitizer<B>, c: Sanitizer<C>): Sanitizer<A | B | C>
  <A, B, C, D> (a: Sanitizer<A>, b: Sanitizer<B>, c: Sanitizer<C>, d: Sanitizer<D>): Sanitizer<A | B | C | D>
  <A, B, C, D, E> (a: Sanitizer<A>, b: Sanitizer<B>, c: Sanitizer<C>, d: Sanitizer<D>, e: Sanitizer<E>):
    Sanitizer<A | B | C | D | E>

  <A, B, C, D, E, F> (
    a: Sanitizer<A>, b: Sanitizer<B>, c: Sanitizer<C>, d: Sanitizer<D>, e: Sanitizer<E>, f: Sanitizer<F>
  ): Sanitizer<A | B | C | D | E | F>

  (firstSanitizer: Sanitizer<any>, ...nextSanitizers: Array<Sanitizer<any>>): Sanitizer<any>
}

export const asAnyOf: AsAnyOf = (...sanitizers: Array<Sanitizer<any>>): Sanitizer<any> =>
  (value, path) => {
    const errors: SanitizerFailure[] = []
    for (const sanitizer of sanitizers) {
      const result = sanitizer(value, path)
      if (Either.isRight(result)) {
        return result
      }
      errors.push(...result.left)
    }
    return Either.left(errors)
  }
