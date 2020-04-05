import { Response, NextFunction } from 'express'
import * as Joi from 'joi'
import { reviewFlowService } from './review_flow.service'
import { searchService } from '../search/search.service'
import { modelService } from '../model/model.service'
import { log } from '../../common/logger'

import { CustomError } from '../../common'

import { SEARCH_QUERY_PARAMS } from '../search/search.ctrl'
import { RUN_NGRAM_PARAMS } from '../model/model.ctrl'

import { IAuthRequest } from '../../types/auth'
import { IReviewFlow, IReviewFlowCreateParams, ISearchCodeParams, IRunNgramParams, IReviewFlowStep } from 'shared'
import { IReviewListQueryParams } from './review_flow.types'

export const REVIEW_FLOW_STEP_SCHEMA = Joi.object({
  index: Joi.number().min(1).max(102400).required(),
  action: Joi.string().min(1).max(102400).required(),
  parameters: Joi.string().min(1).max(102400).required(),
})

export const REVIEW_FLOW_CREATE_SCHEMA = Joi.object({
  course_id: Joi.number().integer(),
  exercise_id: Joi.number().integer(),
  title: Joi.string().min(1).max(102400).required(),
  description: Joi.string().min(1).max(102400).required(),
  public: Joi.bool(),
  tags: Joi.array().items(Joi.string()).required(),
  steps: Joi.array().items(REVIEW_FLOW_STEP_SCHEMA).required()
})

export const REVIEW_CREATE_SCHEMA = Joi.object({
  message: Joi.string().min(1).max(102400).required(),
  metadata: Joi.string().allow('').max(102400),
})

export const REVIEW_FLOW_LIST_QUERY_PARAMS = Joi.object({
})

export const REVIEW_FLOW_RUN_SCHEMA = Joi.object({
  review_flow_id: Joi.number().integer(),
  steps: Joi.array().items(REVIEW_FLOW_STEP_SCHEMA).required()
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

function getStepParams(steps: IReviewFlowStep[], action: string) {
  const found = steps.find(s => s.action === action)
  if (found) {
    const arr = Array.from(new URLSearchParams(found.parameters))
    return arr.reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {} as {[key: string]: string})
  }
  return undefined
}

export const runReviewFlow = async (req: IAuthRequest<IReviewFlow>, res: Response, next: NextFunction) => {
  try {
    const { body } = req
    const searchParams = getStepParams(body.steps, 'Search')
    const modelingParams = getStepParams(body.steps, 'Model')
    const searchValidated = Joi.validate<any>(searchParams, SEARCH_QUERY_PARAMS)
    const modelValidated = Joi.validate<any>(modelingParams, RUN_NGRAM_PARAMS)
    if (searchValidated.error) {
      log.debug(searchValidated.error)
      return next(new CustomError('Validation failed for the review flow Search-parameters: ', 400))
    }
    if (modelingParams && modelValidated.error) {
      log.debug(modelValidated.error)
      return next(new CustomError('Validation failed for the review flow Model-parameters', 400))
    }
    const searchPayload = searchValidated.value as ISearchCodeParams
    let modelingResult
    if (modelingParams) {
      const searchResponse = await searchService.searchSubmissionIds(searchPayload)
      const submissionIds = searchResponse?.response.docs.map(d => d.id)
      const modelingPayload = {
        ...modelValidated.value,
        submission_ids: submissionIds
      } as IRunNgramParams
      modelingResult = await modelService.runNgram(modelingPayload)
      if (modelingResult) modelingResult.model_id = modelingPayload.model_id
    }
    const searchResult = await searchService.searchSubmissions(searchPayload)
    res.json({ searchResult, modelingResult })
  } catch (err) {
    next(err)
  }
}
