import { Request } from 'express'
import { Either, Sanitizer, SanitizerError } from './sanitizer'

type Schema<T> = {
  [K in keyof T]: Sanitizer<T[K]>
}

export class SanitizeError extends Error {
  constructor (public errors: SanitizerError[]) {
    super('Sanitize failed')
    Object.setPrototypeOf(this, SanitizeError.prototype)
  }
}

export const sanitize = <T>(schema: Schema<T>) =>
  (data: unknown, req: Request) => {
    const sanitized: T = {} as any
    const errors: SanitizerError[] = []
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
