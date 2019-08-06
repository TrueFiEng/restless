import { Sanitizer, Result, SanitizerFailure } from './model'

export class CastError extends TypeError {
  constructor (public errors: SanitizerFailure[]) {
    super('Cannot cast')
    Object.setPrototypeOf(this, CastError.prototype)
  }
}

export function cast <T> (value: unknown, sanitizer: Sanitizer<T>): T {
  const result = sanitizer(value, '')
  if (Result.isOk(result)) {
    return result.ok
  } else {
    throw new CastError(result.error)
  }
}
