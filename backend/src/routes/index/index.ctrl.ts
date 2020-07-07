import { Response, NextFunction } from 'express'
import * as Joi from '@hapi/joi'
import { indexService } from './index.service'

import { IAuthRequest } from '../../types/request'
import { IIndexMetricsParams } from 'shared'

export const INDEX_METRICS_PARAMS = Joi.object({
  course_id: Joi.number().integer().required(),
  exercise_id: Joi.number().integer().required(),
})

export const runAndIndexMetrics = async (req: IAuthRequest<IIndexMetricsParams>, res: Response, next: NextFunction) => {
  try {
    const response = await indexService.indexMetrics(req.body)
    res.json(response)
  } catch (err) {
    next(err)
  }
}
