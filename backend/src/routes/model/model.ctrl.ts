import { Response, NextFunction } from 'express'
import * as Joi from 'joi'
import { modelService } from './model.service'

// import { CustomError } from '../../common'

import { IAuthRequest } from '../../types/request'
import { IRunNgramParams, IRunMetricsParams } from 'shared'

export const RUN_CLUSTERING_SCHEMA = Joi.object({
  course_id: Joi.number().integer().required(),
  exercise_id: Joi.number().integer().required(),
  word_filters: Joi.array().items(Joi.string()).required()
})

export const RUN_NGRAM_PARAMS = Joi.object({
  model_id: Joi.string().min(1).max(256).required(),
  token_set: Joi.string(),
  ngrams: Joi.array().items(Joi.number().integer()).length(2),
  svd_n_components: Joi.number().integer(),
  submissions: Joi.array().items(Joi.object({
    id: Joi.string().length(36).required(),
    code: Joi.string().required(),
  })),
})

export const RUN_METRICS_PARAMS = Joi.object({
  model_id: Joi.string().min(1).max(256).required(),
  submissions: Joi.array().items(Joi.object({
    id: Joi.string().length(36).required(),
    code: Joi.string().required(),
  })),
})

export const runNgram = async (req: IAuthRequest<IRunNgramParams>, res: Response, next: NextFunction) => {
  try {
    const response = await modelService.runNgram(req.body)
    res.json(response)
  } catch (err) {
    next(err)
  }
}

export const runMetrics = async (req: IAuthRequest<IRunMetricsParams>, res: Response, next: NextFunction) => {
  try {
    const response = await modelService.runMetrics(req.body)
    res.json(response)
  } catch (err) {
    next(err)
  }
}

export const getModels = async (req: IAuthRequest<{}>, res: Response, next: NextFunction) => {
  try {
    const models = await modelService.getModels()
    res.json({ models })
  } catch (err) {
    next(err)
  }
}
