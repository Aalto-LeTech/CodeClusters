import { Response, NextFunction } from 'express'
// import * as Joi from 'joi'
import { courseService } from './course.service'

// import { CustomError } from '../../common'

import { IAuthRequest } from '../../types/auth'

export const getCourses = async (req: IAuthRequest<{}>, res: Response, next: NextFunction) => {
  try {
    const courses = await courseService.getCourses()
    res.json({ courses })
  } catch (err) {
    next(err)
  }
}
