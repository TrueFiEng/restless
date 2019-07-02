import { Request, RequestHandler } from 'express'
import { Response } from './response'

type Fn<T, U> = (data: T, req: Request) => MaybePromise<U>
type MaybePromise<T> = T | Promise<T>

export function asyncHandler <R> (
  a: Fn<undefined, Response<R>>
): RequestHandler
export function asyncHandler <A, R> (
  a: Fn<undefined, A>,
  b: Fn<A, Response<R>>
): RequestHandler
export function asyncHandler <A, B, R> (
  a: Fn<undefined, A>,
  b: Fn<A, B>,
  c: Fn<B, Response<R>>
): RequestHandler
export function asyncHandler <A, B, C, R> (
  a: Fn<undefined, A>,
  b: Fn<A, B>,
  c: Fn<B, C>,
  d: Fn<C, Response<R>>
): RequestHandler
export function asyncHandler <A, B, C, D, R> (
  a: Fn<undefined, A>,
  b: Fn<A, B>,
  c: Fn<B, C>,
  d: Fn<C, D>,
  e: Fn<D, Response<R>>
): RequestHandler
export function asyncHandler <A, B, C, D, E, R> (
  a: Fn<undefined, A>,
  b: Fn<A, B>,
  c: Fn<B, C>,
  d: Fn<C, D>,
  e: Fn<D, E>,
  f: Fn<E, Response<R>>
): RequestHandler
export function asyncHandler (...handlers: Array<Fn<any, any>>): RequestHandler {
  return async (req, res, next) => {
    try {
      const result = await asyncReduce(
        handlers,
        (data, handler) => handler(data, req),
        undefined
      ) as any as Response<any>
      res.status(result.status).json(result.data)
      next()
    } catch (err) {
      next(err)
    }
  }
}

const asyncReduce = async <T, U>(
  items: T[],
  reducer: (acc: U, item: T) => Promise<U>,
  initial: U
) => {
  let acc = initial
  for (const item of items) {
    acc = await reducer(acc, item)
  }
  return acc
}
