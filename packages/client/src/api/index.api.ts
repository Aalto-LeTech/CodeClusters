import { IIndexMetricsParams, IIndexMetricsResponse } from '@codeclusters/types'

import { authenticatedHeaders, post } from './methods'

export const indexMetrics = (payload: IIndexMetricsParams) =>
  post<IIndexMetricsResponse>('index/metrics', payload, authenticatedHeaders())
