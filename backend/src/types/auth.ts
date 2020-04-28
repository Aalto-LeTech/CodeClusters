import { IUser } from 'shared'

export interface IJwtPayload {
  expires: number
  user: IUser
}
