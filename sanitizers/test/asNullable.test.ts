import { expect } from 'chai'
import { asString, asNullable, Result } from '../src';


describe('asNullable', () => {
    it('sanitizes using the nested sanitizer', async () => {
        const asNullableString = asNullable(asString)
        const result = asNullableString('abc', '')
        expect(result).to.deep.equal(Result.ok('abc'))
      })
    
      it('returns nested sanitizer errors', async () => {
        const asNullableString = asNullable(asString)
        const result = asNullableString(false, 'path')
        expect(result).to.deep.equal(
          Result.error([{ path: 'path', expected: 'string' }])
        )
      })
    
      it('sanitizes undefined', async () => {
        const asNullableString = asNullable(asString)
        const result = asNullableString(undefined, 'path')
        expect(result).to.deep.equal(
            Result.error([{ path: 'path', expected: 'not undefined' }])
          )
      })
    
      it('sanitizes null', async () => {
        const asNullableString = asNullable(asString)
        const result = asNullableString(null, 'path')
        expect(result).to.deep.equal(Result.ok(null))
      })
});