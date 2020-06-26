import { IReviewFlow, IReviewFlowCreateParams } from 'shared'

import {
  authenticatedHeaders,
  get,
  post,
} from './methods'

export const getReviewFlows = () =>
  get<{reviewFlows: IReviewFlow[]}>('reviewflows', authenticatedHeaders())

export const addReviewFlow = (payload: IReviewFlowCreateParams) =>
  post<IReviewFlow>('reviewflow', payload, authenticatedHeaders())
