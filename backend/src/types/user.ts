import * as core from 'express-serve-static-core'

/**
 * Database schema interfaces
 */
export interface IUser {
  id: number
  name: string
  email: string
  privileges: Privileges
}

export interface IUserInternal {
  id: number
  name: string
  email: string
  password: string
  privileges: Privileges
}

export type Privileges = 'ADMIN' | 'USER'

/**
 * Route specific interfaces
 */

export interface ILoginCredentials extends core.ParamsDictionary {
  email: string
  password: string
}

export interface ILoginResponse {
  user: IUser
  jwt: {
    expires: number
    token: string
  }
}

export interface IUserCreateParams {
  name: string
  email: string
  password: string
  privileges: Privileges
}
