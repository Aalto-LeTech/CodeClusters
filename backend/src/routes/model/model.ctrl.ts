import { Response, NextFunction } from 'express'
import * as Joi from '@hapi/joi'
import { modelService } from './model.service'

// import { CustomError } from '../../common'

import { IAuthRequest } from '../../types/request'
import { IRunNgramParams, IRunMetricsParams } from 'shared'

export const DBSCAN_SCHEMA = Joi.object({
  name: Joi.string().valid('DBSCAN').required(),
  min_samples: Joi.number().integer().min(0),
  eps: Joi.number().min(0).max(1),
})
export const HDBSCAN_SCHEMA = Joi.object({
  name: Joi.string().valid('HDBSCAN').required(),
  min_cluster_size: Joi.number().integer().min(2),
  min_samples: Joi.number().integer().min(0),
  show_linkage_tree: Joi.boolean(),
})
export const OPTICS_SCHEMA = Joi.object({
  name: Joi.string().valid('OPTICS').required(),
  min_samples: Joi.number().integer().min(0),
  max_eps: Joi.number().min(-1),
})
export const KMEANS_SCHEMA = Joi.object({
  name: Joi.string().valid('KMeans').required(),
  k_clusters: Joi.number().integer().min(2),
})
export const RUN_NGRAM_PARAMS = Joi.object({
  model_id: Joi.string().valid('ngram').required(),
  token_set: Joi.string().valid('modified', 'keywords'),
  ngrams: Joi.array().items(Joi.number().integer()).length(2),
  svd_n_components: Joi.number().integer(),
  clustering_params: Joi.alternatives().try(DBSCAN_SCHEMA, HDBSCAN_SCHEMA, OPTICS_SCHEMA, KMEANS_SCHEMA),
  submissions: Joi.array().items(Joi.object({
    id: Joi.string().length(36).required(),
    code: Joi.string().required(),
  })),
})
export const RUN_METRICS_PARAMS = Joi.object({
  model_id: Joi.string().valid('metrics').required(),
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
