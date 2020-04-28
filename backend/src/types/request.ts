// import * as Joi from 'joi'
import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { IUser } from 'shared'

export type AnyRequest<T = {}, P = {}, U extends ParamsDictionary = {}> = IRequest<T, P, U> | IAuthRequest<T, P, U>

export interface IRequest<T = {}, P = {}, U extends ParamsDictionary = {}> extends Request<U> {
  user: IUser
  body: T
  queryParams: P
}

export interface IAuthRequest<T = {}, P = {}, U extends ParamsDictionary = {}> extends Request<U> {
  user: IUser
  body: T
  queryParams: P
}
