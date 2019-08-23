import { asObject, Result, Sanitizer, SanitizerFailure, Schema } from '.'

const collectAllErrors = <T extends object> (
    path: string,
    unexpectedKeys: string[],
    objectSanitationResult: Result<SanitizerFailure[], T>) => {
  const unexpectedKeyErrors = unexpectedKeys.map((key) => ({ path: `${path}.${key}`, expected: 'absent' }))
  if (Result.isError(objectSanitationResult)) {
    return [...unexpectedKeyErrors, ...objectSanitationResult.error]
  }
  return unexpectedKeyErrors
}

export const asExactObject = <T extends object> (schema: Schema<T>): Sanitizer<T> =>
  (value, path) => {
    const expectedKeys = new Set(Object.keys(schema))
    const unexpectedKeys = Object.keys(value as object).filter((key) => !expectedKeys.has(key))
    const objectSanitationResult = asObject(schema)(value, path)
    if (unexpectedKeys.length > 0) {
      return Result.error(collectAllErrors(path, unexpectedKeys, objectSanitationResult))
    }
    return objectSanitationResult
  }
