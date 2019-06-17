import { expect } from 'chai'
import { asNumber } from '../../src/sanitize/asNumber'
import { asObject } from '../../src/sanitize/asObject'
import { asString } from '../../src/sanitize/asString'
import { Either } from '../../src/sanitize/sanitizer'

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
      bar: asObject({
        baz: asString
      }),
      foo: asNumber
    })
    const value = { bar: { baz: 'baz' }, foo: 123 }
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
      bar: asObject({
        baz: asString
      }),
      foo: asNumber
    })
    const value = { bar: {}, foo: false }
    const result = asMyObject(value, 'path')
    expect(result).to.deep.equal(Either.left([
      { path: 'path.bar.baz', expected: 'string' },
      { path: 'path.foo', expected: 'number' }
    ]))
  })
})
