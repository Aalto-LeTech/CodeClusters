import { Response, NextFunction } from 'express'
import * as Joi from 'joi'
import { reviewService } from './review.service'

// import { CustomError } from '../../common'

import { IAuthRequest } from '../../types/auth'
import { IReview, IUserReview, IReviewCreateParams, IReviewListQueryParams } from 'shared'

export const REVIEW_SELECTION_SCHEMA = Joi.object({
  submission_id: Joi.string().length(36).required(),
  selection: Joi.array().items(Joi.number().integer()).length(3).required(),
})
export const REVIEW_CREATE_SCHEMA = Joi.object({
  message: Joi.string().min(1).max(102400).required(),
  metadata: Joi.string().allow('').max(102400),
  selections: Joi.array().items(REVIEW_SELECTION_SCHEMA).required()
})
export const REVIEW_SCHEMA = Joi.object({
  review_id: Joi.number().integer(),
  message: Joi.string().min(1).max(10240).required(),
  timestamp: Joi.string().min(1).max(20).required(),
})
export const REVIEW_PENDING_LIST_QUERY_PARAMS = Joi.object({
  course_id: Joi.number().integer(),
  exercise_id: Joi.number().integer(),
})
export const REVIEW_LIST_QUERY_PARAMS = Joi.object({
  user_id: Joi.number().integer(),
})

export const getPendingReviews = async (req: IAuthRequest<{}, IReviewListQueryParams>, res: Response, next: NextFunction) => {
  try {
    const reviews = await reviewService.getPendingReviews()
    const reviewSubmissions = await reviewService.getReviewSubmissions()
    res.json({ reviews, reviewSubmissions })
  } catch (err) {
    next(err)
  }
}

export const getReviews = async (req: IAuthRequest<{}, { user_id?: number }>, res: Response, next: NextFunction) => {
  try {
    let reviewedSubmissions = [] as IReview[] | IUserReview[]
    if (req.queryParams.user_id) {
      reviewedSubmissions = await reviewService.getUserReviews(req.queryParams.user_id)
    } else {
      reviewedSubmissions = await reviewService.getReviews()
    }
    res.json({ reviewedSubmissions })
  } catch (err) {
    next(err)
  }
}

export const createReview = async (req: IAuthRequest<IReviewCreateParams>, res: Response, next: NextFunction) => {
  try {
    const review = await reviewService.createReview(req.body)
    res.json({ review })
  } catch (err) {
    next(err)
  }
}
