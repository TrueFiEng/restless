import { Result, Sanitizer, SanitizerFailure } from './model'

export class CastError extends TypeError {
  constructor (public errors: SanitizerFailure[], message?: string) {
    super(message || 'Cannot cast')
    Object.setPrototypeOf(this, CastError.prototype)
  }
}

export function cast <T> (value: unknown, sanitizer: Sanitizer<T>, message?: string): T {
  const result = sanitizer(value, '')
  if (Result.isOk(result)) {
    return result.ok
  } else {
    throw new CastError(result.error, message)
  }
}
