import { IReview, IReviewCreateParams } from 'shared'

import {
  authenticatedHeaders,
  get,
  post,
} from './methods'

export const addReview = (payload: IReviewCreateParams) =>
  post<IReview>('review', payload, authenticatedHeaders())

export const getReviews = () =>
  get<{reviews: IReview[]}>('reviews', authenticatedHeaders())
