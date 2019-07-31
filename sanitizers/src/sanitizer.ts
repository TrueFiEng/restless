export type Result<L, R> = { left: L } | { right: R }
export const Result = {
  left: <L>(left: L) => ({ left }),
  right: <R>(right: R) => ({ right }),
  isLeft<L> (value: Result<L, any>): value is ({ left: L }) {
    return Object.hasOwnProperty.call(value, 'left')
  },
  isRight<R> (value: Result<any, R>): value is ({ right: R }) {
    return Object.hasOwnProperty.call(value, 'right')
  }
}

export interface SanitizerFailure { path: string, expected: string }
export type Sanitizer<T> = (value: unknown, path: string) => Result<SanitizerFailure[], T>

export type Schema<T> = {
  [K in keyof T]: Sanitizer<T[K]>
}

export type SchemaResult<S> = {
  [K in keyof S]: S[K] extends Sanitizer<infer T> ? T : never
}

export class SanitizeError extends Error {
  constructor (public errors: SanitizerFailure[]) {
    super('Sanitize failed')
    Object.setPrototypeOf(this, SanitizeError.prototype)
  }
}
