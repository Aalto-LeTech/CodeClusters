import { Response, NextFunction } from 'express'
import * as Joi from 'joi'
import { reviewService } from './review.service'

// import { CustomError } from '../../common'

import { IAuthRequest } from '../../types/request'
import { IReviewCreateParams, IAcceptReviewsParams, IReviewListQueryParams } from 'shared'
import { ValidationError } from '../../common'

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
export const REVIEW_LIST_QUERY_PARAMS = Joi.object({
  course_id: Joi.number().integer(),
  exercise_id: Joi.number().integer(),
  status: Joi.string(),
})
export const REVIEW_USER_LIST_QUERY_PARAMS = Joi.object({
  user_id: Joi.number().integer().required(),
})
export const REVIEW_PENDING_ACCEPT_PARAMS = Joi.object({
  reviewIds: Joi.array().items(Joi.number().integer()).required()
})

export const getReviews = async (req: IAuthRequest<{}, IReviewListQueryParams>, res: Response, next: NextFunction) => {
  try {
    const { course_id, exercise_id, status } = req.queryParams
    const reviews = await reviewService.getReviews(course_id, exercise_id, status)
    const reviewSubmissions = await reviewService.getReviewSubmissions(course_id, exercise_id, status)
    res.json({ reviews, reviewSubmissions })
  } catch (err) {
    next(err)
  }
}

export const getUserReviews = async (req: IAuthRequest<{}, {}, { user_id: string }>, res: Response, next: NextFunction) => {
  try {
    let userId
    try {
      userId = parseInt(req.params.user_id, 10)
    } catch (e) {
      return next(new ValidationError('User id wasn\'t an integer'))
    }
    const reviewedSubmissions = await reviewService.getUserReviews(userId)
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

export const acceptPendingReviews = async (req: IAuthRequest<IAcceptReviewsParams>, res: Response, next: NextFunction) => {
  try {
    if (req.body.reviewIds.length === 0) {
      res.status(200).send(true)
      return
    }
    const updatedRows = await reviewService.acceptPendingReviews(req.body)
    res.json(updatedRows)
  } catch (err) {
    next(err)
  }
}
