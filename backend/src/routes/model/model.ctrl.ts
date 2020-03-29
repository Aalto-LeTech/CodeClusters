import { Response, NextFunction } from 'express'
import * as Joi from 'joi'
import { modelService } from './model.service'

// import { CustomError } from '../../common'

import { IAuthRequest } from '../../types/auth'
import { IRunNgramParams } from 'shared'

export const RUN_CLUSTERING_SCHEMA = Joi.object({
  course_id: Joi.number().integer().required(),
  exercise_id: Joi.number().integer().required(),
  word_filters: Joi.array().items(Joi.string()).required()
})

export const RUN_NGRAM_PARAMS = Joi.object({
  model: Joi.string().min(1).max(256).required(),
  ngrams: Joi.array().items(Joi.number().integer()).length(2),
  n_components: Joi.number().integer(),
  submission_ids: Joi.array().items(Joi.string()),
})

export const runNgram = async (req: IAuthRequest<IRunNgramParams>, res: Response, next: NextFunction) => {
  try {
    const response = await modelService.runNgram(req.body)
    res.json(response)
  } catch (err) {
    next(err)
  }
}

export const getClusters = async (req: IAuthRequest<{}>, res: Response, next: NextFunction) => {
  try {
    const clusters = await modelService.getClusters()
    res.json({ clusters })
  } catch (err) {
    next(err)
  }
}
