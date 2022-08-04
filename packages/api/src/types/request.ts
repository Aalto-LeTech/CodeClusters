import type { IUser } from '@codeclusters/types'
import type { Request, Response } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'

// export type IRequest<
//   B = Record<string, any>,
//   P extends ParamsDictionary = Record<string, any>,
//   Q extends Record<string, any> = {}
// > = Request<P, {}, B, {}> & { query: Q }
export interface IRequest<
  B extends Record<string, any> = {},
  P extends ParamsDictionary = {},
  Q extends Record<string, any> = {}
> extends Request<P, {}, B, {}, { queryParams: Q }> {}

type AuthLocals = {
  user: IUser
}

export interface IAuthRequest<
  B extends Record<string, any> = {},
  P extends ParamsDictionary = {},
  Q extends Record<string, any> = {}
> extends Request<P, {}, B, {}, AuthLocals & { queryParams: Q }> {}

export type IAuthRequest2<
  B extends Record<string, any> = {},
  P extends ParamsDictionary = {},
  Q extends Record<string, any> = {}
> = Request<P, {}, B, {}, AuthLocals> & { query: Q }

export type AuthResponse<
  R = Record<string, never>,
  Q extends Record<string, any> = {}
> = Response<R, AuthLocals & { queryParams: Q }>

export type AnyRequest = IRequest | IAuthRequest
