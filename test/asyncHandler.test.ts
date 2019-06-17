import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import express from 'express'
import { responseOf } from '../src/response'
import { asyncHandler } from '../src/asyncHandler'

chai.use(chaiHttp)

describe('asyncHandler', () => {
  it('accepts a function that transforms a request into a response', async () => {
    const app = express()
    app.get('/:foo', asyncHandler(
      req => responseOf({ foo: req.params.foo }, 404)
    ))

    const response = await chai.request(app)
      .get('/1234')
      .send()

    expect(response.status).to.equal(404)
    expect(response.body).to.deep.equal({ foo: '1234' })
  })

  it('accepts multiple functions that connect as a pipe', async () => {
    const app = express()
    app.get('/:foo', asyncHandler(
      req => req.params.foo as string,
      foo => parseInt(foo),
      value => responseOf(value)
    ))

    const response = await chai.request(app)
      .get('/1234')
      .send()

    expect(response.status).to.equal(200)
    expect(response.body).to.deep.equal(1234)
  })

  it('handles async functions', async () => {
    const app = express()
    app.get('/:foo', asyncHandler(
      async req => req.params.foo as string,
      foo => parseInt(foo),
      value => Promise.resolve(responseOf(value))
    ))

    const response = await chai.request(app)
      .get('/1234')
      .send()

    expect(response.status).to.equal(200)
    expect(response.body).to.deep.equal(1234)
  })
})
