import { dbService } from '../../db/db.service'
import { config, axiosService } from '../../common'

import { IRunNgramParams, IRunNgramResponse, IModel, IRunMetricsParams, IRunMetricsResponse } from 'shared'

function url(path: string) {
  return `${config.MODEL_SERVER_URL}/${path}`
}

export const modelService = {
  runNgram: (params: IRunNgramParams) => {
    return axiosService.post<IRunNgramResponse>(url('ngram'), params)
  },
  runMetrics: (params: IRunMetricsParams) => {
    return axiosService.post<IRunMetricsResponse>(url('metrics'), params)
  },
  getModels: () => {
    return dbService.queryMany<IModel>('SELECT * FROM model')
  },
}
