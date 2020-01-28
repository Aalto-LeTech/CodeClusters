import { Request } from 'express'
import { IUser } from 'shared'

export interface IJwtPayload {
  expires: number
  user: IUser
}

export interface IAuthRequest<T = {}, P = {}> extends Request {
  user: IUser
  body: T
  queryParams: P
}
