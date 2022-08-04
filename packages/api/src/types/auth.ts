import { IUser } from '@codeclusters/types'

export interface IJwtPayload {
  expires: number
  user: IUser
}
