export type Result<E, T> = { error: E } | { ok: T }
export const Result = {
  error: <E> (error: E) => ({ error }),
  ok: <T> (ok: T) => ({ ok }),
  isError<E> (value: Result<E, any>): value is ({ error: E }) {
    return Object.hasOwnProperty.call(value, 'error')
  },
  isOk<T> (value: Result<any, T>): value is ({ ok: T }) {
    return Object.hasOwnProperty.call(value, 'ok')
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

export type NonEmptyArray<T> = [T, ...T[]]

export type LiteralTypes = string | number | boolean | null | undefined
