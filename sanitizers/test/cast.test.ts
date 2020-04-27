import { expect } from 'chai'
import { asNumber, cast, CastError } from '../src'

describe('cast', () => {
  it('can cast values', async () => {
    const data = '123'
    const result = cast(data, asNumber)
    expect(result).to.equal(123)
  })

  it('throws if the schema does not match', async () => {
    const data = 'foo'
    expect(() => cast(data, asNumber)).to.throw(CastError)
  })

  it('throws with proper message if the schema does not match', async () => {
    const data = 'foo'
    expect(() => cast(data, asNumber)).to.throw('Cannot cast')
    expect(() => cast(data, asNumber, 'Custom message')).to.throw('Custom message')
  })
})
