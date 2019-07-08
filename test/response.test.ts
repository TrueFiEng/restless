import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import express from 'express'
import { asyncHandler } from '../src/asyncHandler'
import { responseOf } from '../src/response'

chai.use(chaiHttp)

describe('response', () => {
  describe('responseOf', () => {
    it('returns status 200 by default', async () => {
      const app = express()
      app.get('/', asyncHandler(() => responseOf({ a: 1, b: 'xd' })))

      const response = await chai.request(app).get('/').send()

      expect(response.status).to.equal(200)
      expect(response.body).to.deep.equal({ a: 1, b: 'xd' })
    })

    it('returns the provided status when passed', async () => {
      const app = express()
      app.get('/', asyncHandler(() => responseOf('data', 404)))

      const response = await chai.request(app).get('/').send()

      expect(response.status).to.equal(404)
      expect(response.body).to.equal('data')
    })
  })
})
