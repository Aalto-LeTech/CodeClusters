import { config, axiosService } from '../../common'

import { IIndexMetricsParams } from '@codeclusters/types'

function url(path: string) {
  return `${config.MODEL_SERVER_URL}/${path}`
}

export const indexService = {
  indexMetrics: (params: IIndexMetricsParams) => {
    return axiosService.post<any>(url('metrics'), params)
  },
}
