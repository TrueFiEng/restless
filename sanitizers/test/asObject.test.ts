import { expect } from 'chai'
import { asNumber, asObject, asString, Either } from '../src'

describe('asObject', () => {
  it('sanitizes objects', async () => {
    const asMyObject = asObject({})
    const result = asMyObject({}, '')
    expect(result).to.deep.equal(Either.right({}))
  })

  it('does not-accept non-objects', async () => {
    const asMyObject = asObject({})
    const result = asMyObject(123, 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'object' }])
    )
  })

  it('sanitizes using nested sanitizers', async () => {
    const asMyObject = asObject({
      foo: asNumber,
      bar: asObject({
        baz: asString
      })
    })
    const value = { foo: 123, bar: { baz: 'baz' } }
    const result = asMyObject(value, 'path')
    expect(result).to.deep.equal(Either.right(value))
  })

  it('removes unknown properties', async () => {
    const asMyObject = asObject({ x: asNumber })
    const result = asMyObject({ x: 1, y: 'foo' }, 'path')
    expect(result).to.deep.equal(Either.right({ x: 1 }))
  })

  it('returns errors from nested sanitizers', async () => {
    const asMyObject = asObject({
      foo: asNumber,
      bar: asObject({
        baz: asString
      })
    })
    const value = { foo: false, bar: {} }
    const result = asMyObject(value, 'path')
    expect(result).to.deep.equal(Either.left([
      { path: 'path.foo', expected: 'number' },
      { path: 'path.bar.baz', expected: 'string' }
    ]))
  })
})
