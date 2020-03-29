// import { dbService } from '../../db/db.service'
import { config, axiosService } from '../../common'

import { IRunNgramParams, IRunNgramResponse } from 'shared'

function url(path: string) {
  return `${config.MODEL_SERVER_URL}/${path}`
}

export const modelService = {
  runNgram: async (params: IRunNgramParams) : Promise<IRunNgramResponse | undefined> => {
    const result = axiosService.post<IRunNgramResponse>(url('ngram'), params)
    return result
  },
  getClusters: async () : Promise<IRunNgramResponse[] | undefined> => {
    return Promise.resolve([])
    // return await dbService.queryMany<ISubmission>('SELECT id, student_id, course_id, exercise_id, code, timestamp FROM submission')
  },
}
