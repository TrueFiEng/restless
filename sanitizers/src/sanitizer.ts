export type Result<E, D> = { error: E } | { data: D }
export const Result = {
  error: <E>(error: E) => ({ error }),
  ok: <D>(data: D) => ({ data }),
  isError<L>(value: Result<L, any>): value is ({ error: L }) {
    return Object.hasOwnProperty.call(value, 'error')
  },
  isOk<R>(value: Result<any, R>): value is ({ data: R }) {
    return Object.hasOwnProperty.call(value, 'data')
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
  constructor(public errors: SanitizerFailure[]) {
    super('Sanitize failed')
    Object.setPrototypeOf(this, SanitizeError.prototype)
  }
}
