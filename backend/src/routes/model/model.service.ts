import { dbService } from '../../db/db.service'
import { config, axiosService } from '../../common'

import { IRunNgramParams, IRunNgramResponse, IModel } from 'shared'

function url(path: string) {
  return `${config.MODEL_SERVER_URL}/${path}`
}

export const modelService = {
  runNgram: (params: IRunNgramParams) => {
    return axiosService.post<IRunNgramResponse>(url('ngram'), params)
  },
  getModels: () => {
    return dbService.queryMany<IModel>('SELECT * FROM model')
  },
}
