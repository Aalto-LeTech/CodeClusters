import { IReviewFlow, IReviewFlowCreateParams, IReviewFlowRunParams, IReviewFlowRunResponse } from 'shared'

import {
  authenticatedHeaders,
  get,
  post,
} from './methods'

export const addReviewFlow = (payload: IReviewFlowCreateParams) =>
  post<IReviewFlow>('reviewflow', payload, authenticatedHeaders())

export const getReviewFlows = () =>
  get<{reviewFlows: IReviewFlow[]}>('reviewflows', authenticatedHeaders())

export const runReviewFlow = (payload: IReviewFlowRunParams) =>
  post<IReviewFlowRunResponse>('reviewflow/run', payload, authenticatedHeaders())
