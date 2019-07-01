import bodyParser from 'body-parser'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import express, { ErrorRequestHandler, Request } from 'express'
import { asNumber, asObject, asString } from '../../src'
import { asyncHandler } from '../../src/asyncHandler'
import { responseOf } from '../../src/response'
import { sanitize, SanitizeError } from '../../src/sanitize/sanitize'

chai.use(chaiHttp)

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof SanitizeError) {
    res.status(400).send(err.errors)
  } else {
    res.status(500).send(err && err.message)
  }
}

describe('sanitize', () => {
  function makeApp (path: string, middleware: (data: any, req: Request) => any) {
    const app = express()
    app.use(bodyParser.json())
    app.post(path, asyncHandler(
      middleware,
      x => responseOf(x)
    ))
    app.use(errorHandler)
    return app
  }

  it('sanitizes the input', async () => {
    const app = makeApp('/:foo', sanitize({
      foo: asString,
      body: asObject({
        bar: asString
      }),
      query: asObject({
        a: asString
      })
    }))

    const response = await chai.request(app)
      .post('/hello?a=world')
      .send({ bar: 'bar' })

    expect(response.status).to.equal(200)
    expect(response.body).to.deep.equal({
      foo: 'hello',
      body: { bar: 'bar' },
      query: { a: 'world' }
    })
  })

  it('handles failure', async () => {
    const app = makeApp('/:foo', sanitize({
      foo: asNumber,
      body: asObject({
        bar: asString
      }),
      query: asObject({
        a: asString
      })
    }))

    const response = await chai.request(app)
      .post('/hello')
      .send()

    expect(response.status).to.equal(400)
    expect(response.body).to.deep.equal([
      { path: 'params.foo', expected: 'number' },
      { path: 'body.bar', expected: 'string' },
      { path: 'query.a', expected: 'string' }
    ])
  })
})
