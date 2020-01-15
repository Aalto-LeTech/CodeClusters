import { dbService } from '../../db/db.service'

import { IUser, ILoginCredentials, IUserCreateParams } from '../../types/user'

export const userService = {
  loginUser: async (credentials: ILoginCredentials) : Promise<IUser | undefined> => {
    const user = await dbService.queryOne(
      'SELECT id, name, email, privileges FROM app_user WHERE email=$1 AND password=$2',
      [credentials.email, credentials.password]) as IUser | undefined
    return user
  },
  getUsers: async () : Promise<IUser[] | undefined> => {
    const users = await dbService.queryMany('SELECT id, name, email, privileges FROM app_user') as IUser[]
    return users
  },
  createUser: async (params: IUserCreateParams) : Promise<IUser | undefined> => {
    const user = await dbService.queryOne(`
      INSERT INTO app_user (name, email, password, privileges)
      VALUES($1, $2, $3, $4) RETURNING id, name, email, privileges`,
      [params.name, params.email, params.password, params.privileges]) as IUser | undefined
    return user
  }
}
