import { Response, NextFunction } from 'express'
import * as Joi from 'joi'
import { reportService } from './report.service'

// import { CustomError } from '../../common'

import { SUBMISSION_SCHEMA } from '../submission/submission.ctrl'

import { IAuthRequest } from '../../types/auth'
import { IReportCreateParams } from './report.types'

export const REPORT_CREATE_SCHEMA = Joi.object({
  student_id: Joi.number().integer().required(),
  course_id: Joi.number().integer().required(),
  exercise_id: Joi.number().integer().required(),
  code: Joi.string().min(1).max(102400).required(),
})

export const REPORT_SCHEMA = Joi.object({
  id: Joi.number().integer(),
  report: SUBMISSION_SCHEMA,
  message: Joi.string().min(1).max(10240).required(),
})

export const getReports = async (req: IAuthRequest<{}>, res: Response, next: NextFunction) => {
  try {
    const reports = await reportService.getReports()
    res.json({ reports })
  } catch (err) {
    next(err)
  }
}

export const createReport = async (req: IAuthRequest<IReportCreateParams>, res: Response, next: NextFunction) => {
  try {
    const report = await reportService.createReport(req.body)
    res.json({ report })
  } catch (err) {
    next(err)
  }
}
