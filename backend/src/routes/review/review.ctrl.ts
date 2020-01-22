import { Response, NextFunction } from 'express'
import * as Joi from 'joi'
import { reviewService } from './review.service'

// import { CustomError } from '../../common'

import { IAuthRequest } from '../../types/auth'
import { IReviewCreateParams } from 'shared'

export const REVIEW_CREATE_SCHEMA = Joi.object({
  submission_id: Joi.number().integer().required(),
  message: Joi.string().min(1).max(102400).required(),
  metadata: Joi.string().min(1).max(102400).required(),
})

export const REVIEW_SCHEMA = Joi.object({
  review_id: Joi.number().integer(),
  message: Joi.string().min(1).max(10240).required(),
  timestamp: Joi.string().min(1).max(20).required(),
})

export const getReviews = async (req: IAuthRequest<{}>, res: Response, next: NextFunction) => {
  try {
    const reviews = await reviewService.getReviews()
    res.json({ reviews })
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
