import { Request, RequestHandler } from 'express'
import { Response } from './response'

type Fn<T, U> = (data: T) => U
type UnPromise<T> = T extends Promise<infer U> ? U : T

export function asyncHandler <R> (
  a: Fn<Request, Response<R> | Promise<Response<R>>>
): RequestHandler
export function asyncHandler <A, R> (
  a: Fn<Request, A>,
  b: Fn<UnPromise<A>, Response<R> | Promise<Response<R>>>
): RequestHandler
export function asyncHandler <A, B, R> (
  a: Fn<Request, A>,
  b: Fn<UnPromise<A>, B>,
  c: Fn<UnPromise<B>, Response<R> | Promise<Response<R>>>
): RequestHandler
export function asyncHandler <A, B, C, R> (
  a: Fn<Request, A>,
  b: Fn<UnPromise<A>, B>,
  c: Fn<UnPromise<B>, C>,
  d: Fn<UnPromise<C>, Response<R> | Promise<Response<R>>>
): RequestHandler
export function asyncHandler <A, B, C, D, R> (
  a: Fn<Request, A>,
  b: Fn<UnPromise<A>, B>,
  c: Fn<UnPromise<B>, C>,
  d: Fn<UnPromise<C>, D>,
  e: Fn<UnPromise<D>, Response<R> | Promise<Response<R>>>
): RequestHandler
export function asyncHandler <A, B, C, D, E, R> (
  a: Fn<Request, A>,
  b: Fn<UnPromise<A>, B>,
  c: Fn<UnPromise<B>, C>,
  d: Fn<UnPromise<C>, D>,
  e: Fn<UnPromise<D>, E>,
  f: Fn<UnPromise<E>, Response<R> | Promise<Response<R>>>
): RequestHandler
export function asyncHandler (...handlers: Array<Fn<any, any>>): RequestHandler {
  return async (req, res, next) => {
    try {
      const result = await asyncReduce(
        handlers,
        (data, handler) => handler(data),
        req
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
