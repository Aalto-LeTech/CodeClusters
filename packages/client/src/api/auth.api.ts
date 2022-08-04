import { ILoginCredentials, ILoginResponse } from '@codeclusters/types'

import {
  post
} from './methods'

export const login = (credentials: ILoginCredentials) =>
  post<ILoginResponse>('login', credentials)
