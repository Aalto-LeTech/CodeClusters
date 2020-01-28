import * as core from 'express-serve-static-core'

export interface ILoginCredentials extends core.ParamsDictionary {
  email: string
  password: string
}
