import { asAnyOf } from './asAnyOf'
import { asExactly } from './asExactly'
import { LiteralTypes, NonEmptyArray, Sanitizer } from './model'

export const asEnum = <T extends LiteralTypes>(variants: NonEmptyArray<T>, expected: string): Sanitizer<T> =>
  asAnyOf(variants.map(asExactly) as NonEmptyArray<Sanitizer<T>>, expected)
