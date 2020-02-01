import { Response, NextFunction } from 'express'
import * as Joi from 'joi'
import { modelService } from './model.service'

// import { CustomError } from '../../common'

import { IAuthRequest } from '../../types/auth'
import { IRunClusteringParams } from 'shared'

export const RUN_CLUSTERING_SCHEMA = Joi.object({
  course_id: Joi.number().integer().required(),
  exercise_id: Joi.number().integer().required(),
})

export const runClustering = async (req: IAuthRequest<IRunClusteringParams>, res: Response, next: NextFunction) => {
  try {
    const response = await modelService.runClustering(req.body)
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
