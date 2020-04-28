import { Response, NextFunction } from 'express'
import * as Joi from 'joi'
import { reviewSubmissionService } from './review_submission.service'

import { IAuthRequest } from '../../types/request'
// import { ValidationError } from '../../common'

import { IReviewSubmissionPutParams } from 'shared'

export const REVIEW_SUBMISSION_PUT_SCHEMA = Joi.object({
  selection: Joi.array().items(Joi.number().integer()).length(3).required(),
})

type IReviewSubmissionRouteParams = {
  review_id: string
  submission_id: string
}

export const upsertReviewSubmission = async (
  req: IAuthRequest<IReviewSubmissionPutParams, {}, IReviewSubmissionRouteParams>,
  res: Response,
  next: NextFunction
  ) => {
  try {
    const { review_id, submission_id } = req.params
    const { selection } = req.body
    const result = await reviewSubmissionService.upsertReviewSubmission(review_id, submission_id, selection)
    res.json({ result })
  } catch (err) {
    next(err)
  }
}

export const deleteReviewSubmission = async (
  req: IAuthRequest<{}, {}, IReviewSubmissionRouteParams>,
  res: Response,
  next: NextFunction
  ) => {
  try {
    const { review_id, submission_id } = req.params
    const result = await reviewSubmissionService.deleteReviewSubmission(review_id, submission_id)
    res.json({ result })
  } catch (err) {
    next(err)
  }
}
