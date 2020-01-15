import { Request } from 'express'
import { IUser } from './user'

export interface IJwtPayload {
  expires: number
  user: IUser
}

export interface IAuthRequest<P = {}> extends Request {
  user: IUser
  body: P
}
