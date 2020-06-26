import { Response, NextFunction } from 'express'
import * as Joi from '@hapi/joi'
import { reviewFlowService } from './review_flow.service'

import { IAuthRequest } from '../../types/request'
import { IReviewFlowCreateParams } from 'shared'
import { IReviewListQueryParams } from './review_flow.types'

export const REVIEW_FLOW_STEP_SCHEMA = Joi.object({
  index: Joi.number().min(0).max(10).required(),
  action: Joi.string().min(1).max(255).required(),
  data: Joi.object().required(),
})

export const REVIEW_FLOW_CREATE_SCHEMA = Joi.object({
  course_id: Joi.number().integer(),
  exercise_id: Joi.number().integer(),
  user_id: Joi.number().integer().required(),
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(1).max(102400).required(),
  tags: Joi.array().items(Joi.string()).required(),
  steps: Joi.array().items(REVIEW_FLOW_STEP_SCHEMA).required()
})

export const REVIEW_FLOW_LIST_QUERY_PARAMS = Joi.object({
})

export const getReviewFlows = async (req: IAuthRequest<{}, IReviewListQueryParams>, res: Response, next: NextFunction) => {
  try {
    const reviewFlows = await reviewFlowService.getReviewFlows(req.user.user_id)
    res.json({ reviewFlows })
  } catch (err) {
    next(err)
  }
}

export const createReviewFlow = async (req: IAuthRequest<IReviewFlowCreateParams>, res: Response, next: NextFunction) => {
  try {
    const reviewFlow = await reviewFlowService.createReviewFlow(req.body)
    res.json({ reviewFlow })
  } catch (err) {
    next(err)
  }
}
