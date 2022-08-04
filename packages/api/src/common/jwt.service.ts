import pkg from 'jsonwebtoken'
const { sign, verify } = pkg

import { config } from './config'
import { CustomError } from './error'

import { IUser } from '@codeclusters/types'
import { IJwtPayload } from '../types/auth'

const SECRET = config.JWT.SECRET

const ALGORITHM = 'HS512'
const EXPIRATION_IN_MILLIS = 172800000 // 2 days

export const jwtService = {
  createSessionToken(user: IUser, expires: number) {
    const payload = {
      expires,
      user,
    }
    return sign(payload, SECRET, { algorithm: ALGORITHM, expiresIn: expires })
  },
  decryptSessionToken(jwtToken: string) {
    try {
      return verify(jwtToken, SECRET) as IJwtPayload
    } catch (err: any) {
      if (err && err.name === 'TokenExpiredError') {
        throw new CustomError('Jwt token has expired', 401)
      } else {
        throw new CustomError('Jwt token is invalid', 401)
      }
    }
  },
  createSessionExpiration() {
    return Date.now() + EXPIRATION_IN_MILLIS // Timestamp + 2 days in millis
  },
}
