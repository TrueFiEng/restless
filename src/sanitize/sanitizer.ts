export type Either<L, R> = { left: L } | { right: R }
export const Either = {
  left: <L> (left: L) => ({ left }),
  right: <R> (right: R) => ({ right }),
  isLeft<L> (value: Either<L, any>): value is ({ left: L }) {
    return Object.hasOwnProperty.call(value, 'left')
  },
  isRight<R> (value: Either<any, R>): value is ({ right: R }) {
    return Object.hasOwnProperty.call(value, 'right')
  }
}

export interface SanitizerError { path: string, expected: string }
export type Sanitizer<T> = (value: unknown, path: string) => Either<SanitizerError[], T>
