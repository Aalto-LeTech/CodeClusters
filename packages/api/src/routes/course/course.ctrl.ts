import { Response, NextFunction } from 'express'
// import Joi from 'joi'
import { courseService } from './course.service'

// import { CustomError } from '../../common'

import { IAuthRequest } from '../../types/request'

export const getCourses = async (req: IAuthRequest<{}>, res: Response, next: NextFunction) => {
  try {
    const courses = await courseService.getCourses()
    res.json({ courses })
  } catch (err) {
    next(err)
  }
}
