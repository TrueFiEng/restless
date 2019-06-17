export interface Response<R> { data: R, status: number }
export const responseOf = <R> (data: R, status = 200) => ({ data, status })
