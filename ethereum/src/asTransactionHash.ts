import { withErrorMessage } from '@restless/sanitizers'
import { asHexBytes } from './asHexBytes'

export const asTransactionHash = withErrorMessage(asHexBytes(32), 'transaction hash')
