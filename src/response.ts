import { Response } from 'express'

export type ResponseFunction = (res: Response) => void

export const responseOf = (data: any, status = 200): ResponseFunction =>
  res => res
    .status(status)
    .json(data)

export const responseOfBuffer = (type: string, data: Buffer, status = 200): ResponseFunction =>
  res => res
    .status(status)
    .type(type)
    .send(data)
