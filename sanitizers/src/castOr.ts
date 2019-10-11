import { Result, Sanitizer } from './model'

export function castOr <T, U> (value: unknown, sanitizer: Sanitizer<T>, defaultValue: U): T | U {
  const result = sanitizer(value, '')
  if (Result.isOk(result)) {
    return result.ok
  } else {
    return defaultValue
  }
}
