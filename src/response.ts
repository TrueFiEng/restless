import { Response as ExpressResponse } from 'express'

export type Response = (res: ExpressResponse) => void

export const responseOf = (data: any, status = 200): Response => (res) => {
  res
    .status(status)
    .json(data)
}

export const responseOfBuffer = (type: string, data: Buffer, status = 200): Response => (res) => {
  res.status(status)
    .type(type)
    .send(data)
}
