import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import express from 'express'
import { asyncHandler } from '../src/asyncHandler'
import { Response, responseOf, responseOfBuffer } from '../src/response'

chai.use(chaiHttp)

describe('response', () => {
  describe('responseOf', () => {
    it('returns status 200 by default', async () => {
      const response = await testResponse(responseOf({ a: 1, b: 'xd' }))

      expect(response.status).to.equal(200)
      expect(response.body).to.deep.equal({ a: 1, b: 'xd' })
    })

    it('returns the provided status when passed', async () => {
      const response = await testResponse(responseOf('data', 404))

      expect(response.status).to.equal(404)
      expect(response.body).to.equal('data')
    })
  })

  describe('responseOfBuffer', () => {
    it('returns status 200 by default', async () => {
      const response = await testResponse(responseOfBuffer('png', Buffer.from('ABC', 'ascii')))

      expect(response.status).to.equal(200)
      expect(response.type).to.equal('image/png')
      expect(response.body).to.deep.equal(Buffer.from('ABC', 'ascii'))
    })

    it('returns the provided status when passed', async () => {
      const response = await testResponse(responseOfBuffer('png', Buffer.from('ABC', 'ascii'), 404))

      expect(response.status).to.equal(404)
      expect(response.type).to.equal('image/png')
      expect(response.body).to.deep.equal(Buffer.from('ABC', 'ascii'))
    })
  })
})

async function testResponse (response: Response) {
  const app = express()
  app.get('/', asyncHandler(() => response))

  return chai.request(app).get('/').send()
}
