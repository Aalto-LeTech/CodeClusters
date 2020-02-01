// import { dbService } from '../../db/db.service'
import { config, axiosService } from '../../common'

import { IRunClusteringParams, IRunClusteringResponse } from 'shared'

function url(path: string) {
  return `${config.MODEL_SERVER_URL}/${path}`
}

export const modelService = {
  runClustering: async (params: IRunClusteringParams) : Promise<IRunClusteringResponse> => {
    const result = axiosService.post<IRunClusteringResponse>(url('cluster'), params)
    return result
  },
  getClusters: async () : Promise<IRunClusteringResponse[] | undefined> => {
    return Promise.resolve([])
    // return await dbService.queryMany<ISubmission>('SELECT id, student_id, course_id, exercise_id, code, timestamp FROM submission')
  },
}
