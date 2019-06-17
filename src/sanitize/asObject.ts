import { Either, Sanitizer, SanitizerError } from './sanitizer'

type Schema<T> = {
  [K in keyof T]: Sanitizer<T[K]>
}

export const asObject = <T extends object> (schema: Schema<T>): Sanitizer<T> =>
  (data, path) => {
    if (typeof data !== 'object' || data === null) {
      return Either.left([{ path, expected: 'object' }])
    }
    const value: T = {} as any
    const errors: SanitizerError[] = []
    for (const key in schema) {
      if (Object.hasOwnProperty.call(schema, key)) {
        const result = schema[key]((data as T)[key], `${path}.${key}`)
        if (Either.isRight(result)) {
          value[key] = result.right
        } else {
          errors.push(...result.left)
        }
      }
    }
    if (errors.length > 0) {
      return Either.left(errors)
    }
    return Either.right(value)
  }
