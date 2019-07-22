import { expect } from 'chai'
import { asArray } from '../../src'
import { asAnyOf } from '../../src/sanitize/asAnyOf'
import { asBoolean } from '../../src/sanitize/asBoolean'
import { asNumber } from '../../src/sanitize/asNumber'
import { asString } from '../../src/sanitize/asString'
import { Either, Sanitizer } from '../../src/sanitize/sanitizer'

describe('asAnyOf', () => {
  it('should work with one failing nested sanitizer', async () => {
    const mySanitizer = asAnyOf([asBoolean], 'as any of')
    const result = mySanitizer('1', 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'as any of' }])
    )
  })

  it('should work with one passing nested sanitizer', async () => {
    const mySanitizer = asAnyOf([asNumber], 'as any of')
    const result = mySanitizer('1', 'path')
    expect(result).to.deep.equal(
      Either.right(1)
    )
  })

  it('should work if passing sanitizer is the first of multiple failing sanitizers', async () => {
    const mySanitizer = asAnyOf([asNumber, asBoolean, asBoolean, asBoolean], 'as any of')
    const result = mySanitizer('1', 'path')
    expect(result).to.deep.equal(
      Either.right(1)
    )
  })

  it('should work if passing sanitizer is the last of multiple failing sanitizers', async () => {
    const mySanitizer = asAnyOf([asBoolean, asBoolean, asBoolean, asNumber], 'as any of')
    const result = mySanitizer('1', 'path')
    expect(result).to.deep.equal(
      Either.right(1)
    )
  })

  it('should work if passing sanitizer is in the middle of multiple failing sanitizers', async () => {
    const mySanitizer = asAnyOf([asBoolean, asNumber, asBoolean, asBoolean], 'as any of')
    const result = mySanitizer('1', 'path')
    expect(result).to.deep.equal(
      Either.right(1)
    )
  })

  it('should work if there are multiple, not passing sanitizers', async () => {
    const mySanitizer = asAnyOf([asBoolean, asString], 'as any of')
    const result = mySanitizer(1, 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'as any of' }])
    )
  })

  it('should work with nested errors', async () => {
    const mySanitizer = asAnyOf([asArray(asString), asArray(asNumber)], 'as any of')
    const result = mySanitizer([1, 'x'], 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'as any of' }])
    )
  })

  it('should take the first of multiple passing nested sanitizers', async () => {
    expect(asAnyOf([asNumber, asString], 'as any of')('1', 'path'))
      .to.deep.equal(Either.right(1))

    expect(asAnyOf([asString, asNumber], 'as any of')('1', 'path'))
      .to.deep.equal(Either.right('1'))
  })

  it('should work with empty array of sanitizers', async () => {
    const mySanitizer = asAnyOf([], 'as any of')
    const result = mySanitizer('1', 'path')
    expect(result).to.deep.equal(
      Either.right('1')
    )
  })
})
