import { dbService } from '../../db/db.service'
import { config, axiosService } from '../../common'

import { IRunNgramParams, IRunNgramResponse, IModel } from 'shared'

function url(path: string) {
  return `${config.MODEL_SERVER_URL}/${path}`
}

export const modelService = {
  runNgram: async (params: IRunNgramParams) : Promise<IRunNgramResponse | undefined> => {
    const result = axiosService.post<IRunNgramResponse>(url('ngram'), params)
    return result
  },
  getModels: async () => {
    return await dbService.queryMany<IModel>('SELECT * FROM model')
  },
}
