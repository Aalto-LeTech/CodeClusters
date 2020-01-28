import { action, computed, runInAction, observable } from 'mobx'
import * as userApi from '../api/auth.api'

import { IUser, ILoginCredentials, IJwt } from 'shared'

const EMPTY_JWT = {
  expires: -1,
  token: ''
}

export class AuthStore {
  @observable user?: IUser = undefined
  @observable jwt: IJwt = EMPTY_JWT
  resetFn: () => void

  constructor(resetFn: () => void) {
    const savedUser = localStorage.getItem('user')
    const savedJwt = localStorage.getItem('jwt')
    if (savedUser && savedJwt && savedUser.length > 0 && savedJwt.length > 0) {
      this.user = JSON.parse(savedUser)
      this.jwt = JSON.parse(savedJwt)
    }
    this.resetFn = resetFn
  }

  @action reset() {
    this.user = undefined
    this.jwt = EMPTY_JWT
    localStorage.setItem('user', '')
    localStorage.setItem('jwt', '')
  }

  @action logInUser = async (credentials: ILoginCredentials) => {
    const result = await userApi.login(credentials)
    runInAction(() => {
      if (result) {
        this.user = result.user
        this.jwt = result.jwt
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('jwt', JSON.stringify(this.jwt))
      }
    })
    return result
  }

  @action logout = () => {
    this.resetFn()
  }

  @computed
  get isAuthenticated() {
    return this.user !== undefined
  }
}
