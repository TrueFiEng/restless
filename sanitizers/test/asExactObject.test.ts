import { expect } from 'chai'
import { asExactObject, asNumber, asString, Result } from '../src'

describe('asExactObject', () => {
  it('sanitizes objects', async () => {
    const asMyObject = asExactObject({})
    const result = asMyObject({}, '')
    expect(result).to.deep.equal(Result.ok({}))
  })

  it('does not-accept non-objects', async () => {
    const asMyObject = asExactObject({})
    const result = asMyObject(123, 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'object' }])
    )
  })

  it('sanitizes using nested sanitizers', async () => {
    const asMyObject = asExactObject({
      foo: asNumber,
      bar: asExactObject({
        baz: asString
      })
    })
    const value = { foo: 123, bar: { baz: 'baz' } }
    const result = asMyObject(value, 'path')
    expect(result).to.deep.equal(Result.ok(value))
  })

  it('returns errors when finds unknown properties', async () => {
    const asMyObject = asExactObject({ x: asNumber })
    const result = asMyObject({ x: 1, y: 'foo' }, 'path')
    expect(result).to.deep.equal(Result.error([{ path: 'path.y', expected: 'absent' }]))
  })

  it('returns errors from nested sanitizers', async () => {
    const asMyObject = asExactObject({
      foo: asNumber,
      bar: asExactObject({
        baz: asString
      })
    })
    const value = { foo: false, bar: {}, lorem: { ipsum: true } }
    const result = asMyObject(value, 'path')
    expect(result).to.deep.equal(Result.error([
      { path: 'path.lorem', expected: 'absent' },
      { path: 'path.foo', expected: 'number' },
      { path: 'path.bar.baz', expected: 'string' }
    ]))
  })
})
