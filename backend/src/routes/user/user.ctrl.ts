import { Request, Response, NextFunction } from 'express'
import * as Joi from '@hapi/joi'
import { userService } from './user.service'
import { jwtService } from '../../common/jwt.service'

import { CustomError } from '../../common'

import { IUser, ILoginResponse, IUserCreateParams } from 'shared'
import { IAuthRequest } from '../../types/request'
import { ILoginCredentials } from './user.types'

export const USER_CREDENTIALS_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(255).required(),
})

export const USER_CREATE_SCHEMA = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(255).required(),
  role: Joi.string().min(1).max(255).required(),
})

export const USER_SCHEMA = Joi.object({
  id: Joi.number().integer(),
  name: Joi.string().min(1).max(255).required(),
  email: Joi.string().email().required(),
  role: Joi.string().min(1).max(255).required(),
})

function createLoginResponse(user: IUser) {
  const expires = jwtService.createSessionExpiration()
  return {
    user,
    jwt: {
      expires,
      token: jwtService.createSessionToken(user, expires)
    }
  } as ILoginResponse
}

export const loginUser = async (req: Request<ILoginCredentials>, res: Response, next: NextFunction) => {
  try {
    const user = await userService.loginUser(req.body)
    if (!user) {
      throw new CustomError('Login failed, no user found with given credentials', 401)
    }
    res.json(createLoginResponse(user))
  } catch (err) {
    next(err)
  }
}

export const getUsers = async (req: IAuthRequest<{}>, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getUsers()
    res.json({ users })
  } catch (err) {
    next(err)
  }
}

export const createUser = async (req: IAuthRequest<IUserCreateParams>, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body)
    res.json({ user })
  } catch (err) {
    next(err)
  }
}
