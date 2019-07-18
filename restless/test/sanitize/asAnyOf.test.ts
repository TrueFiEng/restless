import { expect } from 'chai'
import { asAnyOf } from '../../src/sanitize/asAnyOf'
import { asBoolean } from '../../src/sanitize/asBoolean'
import { asNumber } from '../../src/sanitize/asNumber'
import { asString } from '../../src/sanitize/asString'
import { Either } from '../../src/sanitize/sanitizer'
import { asArray } from '../../src';

describe('asAnyOf', () => {
  it('should work with one failing nested sanitizer', async () => {
    const mySanitizer = asAnyOf(asBoolean)
    const result = mySanitizer('1', 'path')
    expect(result).to.deep.equal(
      Either.left([{ path: 'path', expected: 'boolean' }])
    )
  })

  it('should work with one passing nested sanitizer', async () => {
    const mySanitizer = asAnyOf(asNumber)
    const result = mySanitizer('1', 'path')
    expect(result).to.deep.equal(
      Either.right(1)
    )
  })

  it('should work if passing sanitizer is the first of multiple failing sanitizers', async () => {
    const mySanitizer = asAnyOf(asNumber, asBoolean, asBoolean, asBoolean)
    const result = mySanitizer('1', 'path')
    expect(result).to.deep.equal(
      Either.right(1)
    )
  })

  it('should work if passing sanitizer is the last of multiple failing sanitizers', async () => {
    const mySanitizer = asAnyOf(asBoolean, asBoolean, asBoolean, asNumber)
    const result = mySanitizer('1', 'path')
    expect(result).to.deep.equal(
      Either.right(1)
    )
  })

  it('should work if passing sanitizer is in the middle of multiple failing sanitizers', async () => {
    const mySanitizer = asAnyOf(asBoolean, asNumber, asBoolean, asBoolean)
    const result = mySanitizer('1', 'path')
    expect(result).to.deep.equal(
      Either.right(1)
    )
  })

  it('should work if there are multiple, not passing sanitizers', async () => {
    const mySanitizer = asAnyOf(asBoolean, asString)
    const result = mySanitizer(1, 'path')
    expect(result).to.deep.equal(
      Either.left([
        { expected: 'boolean', path: 'path' },
        { expected: 'string', path: 'path' }
      ])
    )
  })

  it('should work with nested errors', async () => {
    const mySanitizer = asAnyOf(asArray(asString), asArray(asNumber))
    const result = mySanitizer([1, 'x'], 'path')
    expect(result).to.deep.equal(
      Either.left([
        { expected: 'string', path: 'path[0]' },
        { expected: 'number', path: 'path[1]' }
      ])
    )
  })

  it('should take the first of multiple passing nested sanitizers', async () => {
    expect(asAnyOf(asNumber, asString)('1', 'path'))
      .to.deep.equal(Either.right(1))

    expect(asAnyOf(asString, asNumber)('1', 'path'))
      .to.deep.equal(Either.right('1'))
  })
})
