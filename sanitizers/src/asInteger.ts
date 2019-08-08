import { asChecked } from './asChecked'
import { asNumber } from './asNumber'
import { withErrorMessage } from './withErrorMessage'

const isInteger = (num: number) => num === Math.floor(num)

export const asInteger = withErrorMessage(
  asChecked(asNumber, isInteger),
  'integer'
)
