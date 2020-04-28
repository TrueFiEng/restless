import { Result, SanitizerFailure, Schema, SchemaResult } from '@restless/sanitizers'
import { Request } from 'express'

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
        const result = req.params[key] !== undefined // tslint:disable-line
          ? schema[key](req.params[key], `params.${key}`)
          : schema[key]((req as any)[key], key)

        if (Result.isOk(result)) {
          sanitized[key] = result.ok
        } else {
          errors.push(...result.error)
        }
      }
    }
    if (errors.length > 0) {
      throw new SanitizeError(errors)
    }
    return sanitized
  }
