import { Response, NextFunction } from 'express'
import * as Joi from '@hapi/joi'
import { submissionService } from './submission.service'

// import { CustomError } from '../../common'

import { ISubmissionListQueryParams } from 'shared'
import { IAuthRequest } from '../../types/request'
import { ISubmissionCreateParams } from './submission.types'

export const SUBMISSION_CREATE_SCHEMA = Joi.object({
  student_id: Joi.number().integer().required(),
  course_id: Joi.number().integer().required(),
  exercise_id: Joi.number().integer().required(),
  code: Joi.string().min(1).max(102400).required(),
})

export const SUBMISSION_SCHEMA = Joi.object({
  id: Joi.number().integer(),
  student_id: Joi.number().integer().required(),
  course_id: Joi.number().integer().required(),
  exercise_id: Joi.number().integer().required(),
  code: Joi.string().min(1).max(102400).required(),
  date: Joi.date().required()
})

export const SUBMISSION_LIST_QUERY_PARAMS = Joi.object({
  course_id: Joi.number().integer(),
  exercise_id: Joi.number().integer(),
})

export const getSubmissions = async (req: IAuthRequest<{}, ISubmissionListQueryParams>, res: Response, next: NextFunction) => {
  try {
    const submissions = await submissionService.getSubmissions(req.queryParams.course_id, req.queryParams.exercise_id)
    res.json({ submissions })
  } catch (err) {
    next(err)
  }
}

export const createSubmission = async (req: IAuthRequest<ISubmissionCreateParams>, res: Response, next: NextFunction) => {
  try {
    const submission = await submissionService.createSubmission(req.body)
    res.json({ submission })
  } catch (err) {
    next(err)
  }
}
