import { expect } from 'chai'
import { responseOf } from '../src/response'

describe('responseOf', () => {
  it('returns status 200 by default', () => {
    expect(responseOf({ a: 1, b: 'xd' })).to.deep.equal({
      data: { a: 1, b: 'xd' },
      status: 200
    })
  })

  it('returns the provided status when passed', () => {
    expect(responseOf('data', 404)).to.deep.equal({
      data: 'data',
      status: 404
    })
  })
})
