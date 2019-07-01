import { Either, Sanitizer, SanitizerFailure } from './sanitizer'

type Schema<T> = {
  [K in keyof T]: Sanitizer<T[K]>
}

export const asObject = <T extends object> (schema: Schema<T>): Sanitizer<T> =>
  (value, path) => {
    if (typeof value !== 'object' || value === null) {
      return Either.left([{ path, expected: 'object' }])
    }
    const results: T = {} as any
    const errors: SanitizerFailure[] = []
    for (const key in schema) {
      if (Object.hasOwnProperty.call(schema, key)) {
        const result = schema[key]((value as T)[key], `${path}.${key}`)
        if (Either.isRight(result)) {
          results[key] = result.right
        } else {
          errors.push(...result.left)
        }
      }
    }
    return errors.length > 0
      ? Either.left(errors)
      : Either.right(results)
  }
