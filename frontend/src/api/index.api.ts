import { IIndexMetricsParams, IIndexMetricsResponse } from 'shared'

import {
  authenticatedHeaders,
  post,
} from './methods'

export const indexMetrics = (payload: IIndexMetricsParams) =>
  post<IIndexMetricsResponse>('index/metrics', payload, authenticatedHeaders())
