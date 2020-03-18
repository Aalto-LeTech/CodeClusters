import { IReview, IReviewedSubmission, IReviewCreateParams } from 'shared'

import {
  authenticatedHeaders,
  get,
  post,
} from './methods'

export const addReview = (payload: IReviewCreateParams) =>
  post<IReview>('review', payload, authenticatedHeaders())

export const getReviews = () =>
  get<{reviewedSubmissions: IReviewedSubmission[]}>('reviews', authenticatedHeaders())

export const getUserReviews = (userId: number) =>
  get<{reviewedSubmissions: IReviewedSubmission[]}>(`reviews?user_id=${userId}`, authenticatedHeaders())
