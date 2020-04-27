import { asChecked } from './asChecked'
import { asNumber } from './asNumber'
import { withErrorMessage } from './withErrorMessage'

export const asInteger = withErrorMessage(
  asChecked(asNumber, Number.isInteger),
  'integer'
)
