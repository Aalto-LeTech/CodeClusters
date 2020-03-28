import { action, computed, runInAction, observable } from 'mobx'
import * as userApi from '../api/auth.api'

import { persist } from './persist'

import { IUser, ILoginCredentials, IJwt } from 'shared'

const EMPTY_JWT = {
  expires: -1,
  token: ''
}

export class AuthStore {
  @observable user?: IUser = undefined
  @observable jwt: IJwt = EMPTY_JWT
  resetAllStores: () => void

  constructor(resetFn: () => void) {
    this.resetAllStores = resetFn
    persist(() => this.user, (val: any) => this.user = val, 'auth.user')
    persist(() => this.jwt, (val: any) => this.jwt = val, 'auth.jwt')
  }

  @action reset() {
    this.user = undefined
    this.jwt = EMPTY_JWT
  }

  @action logInUser = async (credentials: ILoginCredentials) => {
    const result = await userApi.login(credentials)
    runInAction(() => {
      if (result) {
        this.user = result.user
        this.jwt = result.jwt
      }
    })
    return result
  }

  @action logout = () => {
    this.resetAllStores()
  }

  @computed
  get isAuthenticated() {
    return this.user !== undefined
  }
}
