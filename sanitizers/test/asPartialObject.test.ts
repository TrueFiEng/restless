import { expect } from 'chai'
import { asNumber, asObject, asOptional, asPartialObject, asString, Result } from '../src'

describe('asPartialObject', () => {
  it('sanitizes objects', async () => {
    const asMyObject = asPartialObject({})
    const result = asMyObject({}, '')
    expect(result).to.deep.equal(Result.ok({}))
  })

  it('does not-accept non-objects', async () => {
    const asMyObject = asPartialObject({})
    const result = asMyObject(123, 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'object' }])
    )
  })

  it('sanitizes using nested sanitizers', async () => {
    const asMyObject = asPartialObject({
      foo: asNumber,
      bar: asPartialObject({
        baz: asString
      })
    })
    const value = { foo: 123, bar: { baz: 'baz' } }
    const result = asMyObject(value, 'path')
    expect(result).to.deep.equal(Result.ok(value))
  })

  it('removes unknown properties', async () => {
    const asMyObject = asPartialObject({ x: asNumber })
    const result = asMyObject({ x: 1, y: 'foo' }, 'path')
    expect(result).to.deep.equal(Result.ok({ x: 1 }))
  })

  it('returns errors from nested sanitizers', async () => {
    const asMyObject = asPartialObject({
      foo: asNumber,
      bar: asObject({
        baz: asString
      })
    })
    const value = { foo: false, bar: {} }
    const result = asMyObject(value, 'path')
    expect(result).to.deep.equal(Result.error([
      { path: 'path.foo', expected: 'number' },
      { path: 'path.bar.baz', expected: 'string' }
    ]))
  })

  it('omits missing fields', async () => {
    const asMyObject = asPartialObject({
      x: asNumber,
      y: asNumber
    })
    const result = asMyObject({ x: 1, z: 'foo' }, 'path')
    expect(result).to.deep.equal(Result.ok({ x: 1 }))
  })

  it('keeps fields that are undefined', async () => {
    const asMyObject = asPartialObject({
      x: asNumber,
      y: asOptional(asNumber)
    })
    const result = asMyObject({ x: 1, y: undefined, z: 'foo' }, 'path')
    expect(result).to.deep.equal(Result.ok({ x: 1, y: undefined }))
  })
})
