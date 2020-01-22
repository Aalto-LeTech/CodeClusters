import { ILoginCredentials, ILoginResponse } from 'shared'

import {
  post
} from './methods'

export const login = (credentials: ILoginCredentials) =>
  post<ILoginResponse>('login', credentials)
