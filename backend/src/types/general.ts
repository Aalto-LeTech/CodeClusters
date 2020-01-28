// import * as Joi from 'joi'
import { Request } from 'express'
import { IUser } from 'shared'

export type AnyRequest<T = {}, P = {}> = IRequest<T,P> | IAuthRequest<T,P>

export interface IRequest<T = {}, P = {}> extends Request {
  body: T
  queryParams: P
}

export interface IAuthRequest<T = {}, P = {}> extends Request {
  user: IUser
  body: T
  queryParams: P
}
