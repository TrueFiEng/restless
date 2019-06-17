import { Either, Sanitizer } from './sanitizer'

export const asString: Sanitizer<string> = (value, path) => {
  if (typeof value === 'string') return Either.right(value)
  else return Either.left([{ path, expected: 'string' }])
}
