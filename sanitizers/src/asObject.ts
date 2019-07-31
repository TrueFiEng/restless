import { Result, Sanitizer, SanitizerFailure, Schema } from './sanitizer'

export const asObject = <T extends object> (schema: Schema<T>): Sanitizer<T> =>
  (value, path) => {
    if (typeof value !== 'object' || value === null) {
      return Result.left([{ path, expected: 'object' }])
    }
    const results: T = {} as any
    const errors: SanitizerFailure[] = []
    for (const key in schema) {
      if (Object.hasOwnProperty.call(schema, key)) {
        const result = schema[key]((value as T)[key], `${path}.${key}`)
        if (Result.isRight(result)) {
          results[key] = result.right
        } else {
          errors.push(...result.left)
        }
      }
    }
    return errors.length > 0
      ? Result.left(errors)
      : Result.right(results)
  }
