import { Response, NextFunction } from 'express'
import * as Joi from '@hapi/joi'
import { reviewService } from './review.service'

// import { CustomError } from '../../common'

import { IAuthRequest } from '../../types/request'
import { IReview, IReviewCreateParams, IAcceptReviewsParams, IReviewListQueryParams, EReviewStatus } from 'shared'
import { ValidationError } from '../../common'

export const REVIEW_SELECTION_SCHEMA = Joi.object({
  submission_id: Joi.string().length(36).required(),
  selection: Joi.array().items(Joi.number().integer()).length(2).required(),
})
export const REVIEW_CREATE_SCHEMA = Joi.object({
  message: Joi.string().min(1).max(102400).required(),
  metadata: Joi.string().allow('').max(102400),
  tags: Joi.array().items(Joi.string()).required(),
  selections: Joi.array().items(REVIEW_SELECTION_SCHEMA).required()
})
export const REVIEW_SCHEMA = Joi.object({
  review_id: Joi.number().integer().required(),
  message: Joi.string().min(1).max(10240).required(),
  metadata: Joi.string().allow('').max(10240).required(),
  tags: Joi.array().items(Joi.string()).required(),
  timestamp: Joi.string().required(),
  status: Joi.string().valid(EReviewStatus.SENT, EReviewStatus.PENDING).required(),
})
export const REVIEW_LIST_QUERY_PARAMS = Joi.object({
  course_id: Joi.number().integer(),
  exercise_id: Joi.number().integer(),
  statuses: Joi.array().items(Joi.string().valid(EReviewStatus.SENT, EReviewStatus.PENDING)).min(1).required(),
})
export const REVIEW_USER_LIST_QUERY_PARAMS = Joi.object({
  user_id: Joi.number().integer().required(),
})
export const REVIEW_PENDING_ACCEPT_PARAMS = Joi.object({
  reviewIds: Joi.array().items(Joi.number().integer()).required()
})

export const getReviews = async (req: IAuthRequest<{}, IReviewListQueryParams>, res: Response, next: NextFunction) => {
  try {
    const reviews = await reviewService.getReviews(req.queryParams)
    const reviewSubmissions = await reviewService.getReviewSubmissions(req.queryParams)
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
    res.json(review)
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

export const updateReview = async (req: IAuthRequest<IReview, {}, { review_id: string }>, res: Response, next: NextFunction) => {
  try {
    let reviewId
    try {
      reviewId = parseInt(req.params.review_id, 10)
    } catch (e) {
      return next(new ValidationError('Review id wasn\'t an integer'))
    }
    const updated = await reviewService.updateReview(reviewId, req.body)
    res.json(!!updated)
  } catch (err) {
    next(err)
  }
}

export const deleteReview = async (req: IAuthRequest<{}, {}, { review_id: string }>, res: Response, next: NextFunction) => {
  try {
    let reviewId
    try {
      reviewId = parseInt(req.params.review_id, 10)
    } catch (e) {
      return next(new ValidationError('Review id wasn\'t an integer'))
    }
    const deleted = await reviewService.deleteReview(reviewId)
    res.json(deleted)
  } catch (err) {
    next(err)
  }
}
