import { IRunClusteringParams, IRunClusteringResponse } from 'shared'

import {
  authenticatedHeaders,
  get,
  post,
} from './methods'

export const runClustering = (payload: IRunClusteringParams) =>
  post<IRunClusteringResponse>('model/cluster', payload, authenticatedHeaders())

export const getClusteringResults = () =>
  get<IRunClusteringResponse[]>(`model/clusters`, authenticatedHeaders())
