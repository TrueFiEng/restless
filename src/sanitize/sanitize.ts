import { Request } from 'express'
import { Either, SanitizerFailure, Schema, SchemaResult } from './sanitizer'

export class SanitizeError extends Error {
  constructor (public errors: SanitizerFailure[]) {
    super('Sanitize failed')
    Object.setPrototypeOf(this, SanitizeError.prototype)
  }
}

export const sanitize = <S extends Schema<any>>(schema: S) =>
  (data: unknown, req: Request): SchemaResult<S> => {
    const sanitized: SchemaResult<S> = {} as any
    const errors: SanitizerFailure[] = []
    for (const key in schema) {
      if (Object.hasOwnProperty.call(schema, key)) {
        let result
        if (key === 'body') {
          result = schema[key](req.body, 'body')
        } else if (key === 'query') {
          result = schema[key](req.query, 'query')
        } else {
          result = schema[key](req.params[key], `params.${key}`)
        }
        if (Either.isRight(result)) {
          sanitized[key] = result.right
        } else {
          errors.push(...result.left)
        }
      }
    }
    if (errors.length > 0) {
      throw new SanitizeError(errors)
    }
    return sanitized
  }
