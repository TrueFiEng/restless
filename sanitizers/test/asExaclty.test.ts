import { expect } from 'chai'
import { asExactly, asObject, cast, Result, Sanitizer } from '../src'

describe('asExactly', () => {
  it('succeeds for exactly matching values', async () => {
    const sanitizer = asExactly('foo')
    const result = sanitizer('foo', 'path')
    expect(result).to.deep.equal(Result.ok('foo'))
  })

  it('fails for non-matching values of the same type', async () => {
    const sanitizer = asExactly('foo')
    const result = sanitizer('bar', 'path')
    expect(result).to.deep.equal(Result.error([{ path: 'path', expected: 'exactly "foo"' }]))
  })

  it('distinguishes null from undefined', async () => {
    const sanitizer = asExactly(null)
    const result = sanitizer(undefined, 'path')
    expect(result).to.deep.equal(Result.error([{ path: 'path', expected: 'exactly null' }]))
  })

  it('displays undefined in errors correctly', async () => {
    const sanitizer = asExactly(undefined)
    const result = sanitizer(0, 'path')
    expect(result).to.deep.equal(Result.error([{ path: 'path', expected: 'exactly undefined' }]))
  })

  it('displays null in errors correctly', async () => {
    const sanitizer = asExactly(null)
    const result = sanitizer(0, 'path')
    expect(result).to.deep.equal(Result.error([{ path: 'path', expected: 'exactly null' }]))
  })

  it('sanitizer preserves literal types', async () => {
    const sanitizer: Sanitizer<'foo'> = asExactly('foo')
    const result = sanitizer(0, 'path')
    expect(result).to.deep.equal(Result.error([{ path: 'path', expected: 'exactly "foo"' }]))
  })

  it('works as a part of a data model', async () => {
    const asFoo = asObject({
      type: asExactly('foo')
    })
    const value = cast({ type: 'foo' }, asFoo)
    const type: 'foo' = value.type
  })
})
