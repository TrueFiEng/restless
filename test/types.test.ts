import { Request } from 'express'
import {
  asNumber,
  asObject,
  asString,
  asyncHandler,
  responseOf,
  sanitize
} from '../src'

describe('Type declarations', () => {
  it('handles normal use case', async () => {
    asyncHandler(
      sanitize({ foo: asString }),
      (data) => responseOf(data.foo)
    )
  })

  it('handles extracted function', async () => {
    const fn = (data: { foo: string }) => responseOf(data.foo)
    asyncHandler(
      sanitize({ foo: asString }),
      fn
    )
  })

  it('handles extracted function with second argument', async () => {
    const fn = (data: { foo: string }, req: Request) => responseOf(data.foo + req.params.foo)
    asyncHandler(
      sanitize({ foo: asString }),
      fn
    )
  })

  it('handles multiple functions', async () => {
    const fn = (data: { foo: string }, req: Request) => responseOf(data.foo + req.params.foo)
    asyncHandler(
      sanitize({ foo: asString }),
      fn,
      async (res) => res,
      (res) => Promise.resolve(responseOf(res.data, 404))
    )
  })

  it('handles a nested asObject with other sanitizers', async () => {
    asyncHandler(
      sanitize({
        a: asString,
        body: asObject({
          foo: asNumber
        })
      }),
      ({ body }) => responseOf(body.foo)
    )
  })

  it('handles a nested asObject without other sanitizers', async () => {
    asyncHandler(
      sanitize({
        body: asObject({
          foo: asString
        })
      }),
      ({ body }) => responseOf(body.foo)
    )
  })

  it('handles nested asObject sanitizers', async () => {
    asyncHandler(
      sanitize({
        body: asObject({
          foo: asObject({
            foo: asObject({
              foo: asString
            })
          })
        })
      }),
      ({ body }) => responseOf(body.foo.foo.foo)
    )
  })
})
