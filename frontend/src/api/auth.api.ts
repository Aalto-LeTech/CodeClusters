import { ILoginCredentials, ILoginResponse } from '../types/user'

import {
  post
} from './methods'

export const login = (credentials: ILoginCredentials) =>
  post<ILoginResponse>('login', credentials)
