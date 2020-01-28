import { dbService } from '../../db/db.service'

import { IUser, IUserCreateParams } from 'shared'
import { ILoginCredentials } from './user.types'

export const userService = {
  loginUser: async (credentials: ILoginCredentials) : Promise<IUser | undefined> => {
    const user = await dbService.queryOne(
      'SELECT id, name, email, role FROM app_user WHERE email=$1 AND password=$2',
      [credentials.email, credentials.password]) as IUser | undefined
    return user
  },
  getUsers: async () : Promise<IUser[] | undefined> => {
    const users = await dbService.queryMany('SELECT id, name, email, role FROM app_user') as IUser[]
    return users
  },
  createUser: async (params: IUserCreateParams) : Promise<IUser | undefined> => {
    const user = await dbService.queryOne(`
      INSERT INTO app_user (name, email, password, role)
      VALUES($1, $2, $3, $4) RETURNING id, name, email, role`,
      [params.name, params.email, params.password, params.role]) as IUser | undefined
    return user
  }
}
