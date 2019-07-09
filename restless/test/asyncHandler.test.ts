import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import express, { ErrorRequestHandler } from 'express'
import { asyncHandler } from '../src/asyncHandler'
import { responseOf } from '../src/response'

chai.use(chaiHttp)

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).send(err && err.message)
}

describe('asyncHandler', () => {
  it('accepts a function that transforms a request into a response', async () => {
    const app = express()
    app.get('/:foo', asyncHandler(
      (_, req) => responseOf({ foo: req.params.foo }, 404)
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
      (_, req) => req.params.foo as string,
      (foo) => parseInt(foo, 10),
      (value) => responseOf(value)
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
      async (_, req) => req.params.foo as string,
      (foo) => parseInt(foo, 10),
      (value) => Promise.resolve(responseOf(value))
    ))

    const response = await chai.request(app)
      .get('/1234')
      .send()

    expect(response.status).to.equal(200)
    expect(response.body).to.deep.equal(1234)
  })

  it('passes request to every function', async () => {
    const app = express()
    app.get('/:foo', asyncHandler(
      (_, req) => req.params.foo as string,
      (foo, req) => req.params.foo + foo,
      (foo2, req) => responseOf({ foo: req.params.foo, foo2 })
    ))

    const response = await chai.request(app)
      .get('/foo')
      .send()

    expect(response.status).to.equal(200)
    expect(response.body).to.deep.equal({
      foo: 'foo',
      foo2: 'foofoo'
    })
  })

  it('catches errors', async () => {
    const app = express()
    app.get('/:foo', asyncHandler(
      () => { throw new Error() }
    ))
    app.use(errorHandler)

    const response = await chai.request(app)
      .get('/1234')
      .send()

    expect(response.status).to.equal(500)
  })
})
