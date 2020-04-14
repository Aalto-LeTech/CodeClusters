import {
  IReview, IReviewSubmission, IReviewedSubmission, IReviewListQueryParams, IReviewCreateParams, IAcceptReviewsParams
} from 'shared'

import {
  authenticatedHeaders,
  get,
  getWithQuery,
  post,
  put,
  del,
} from './methods'

export const addReview = (payload: IReviewCreateParams) =>
  post<IReview>('review', payload, authenticatedHeaders())

export const updateReview = (reviewId: number, payload: Partial<IReview>) =>
  put<boolean>(`review/${reviewId}`, payload, authenticatedHeaders())

export const deleteReview = (reviewId: number) =>
  del<boolean>(`review/${reviewId}`, authenticatedHeaders())

export const getPendingReviews = (payload: IReviewListQueryParams) =>
  getWithQuery<{
    reviews: IReview[],
    reviewSubmissions: IReviewSubmission[]
  }>('reviews/pending', payload, authenticatedHeaders())

export const acceptPendingReviews = (payload: IAcceptReviewsParams) =>
  post<boolean>('reviews/pending', payload, authenticatedHeaders())

export const getReviews = () =>
  get<{reviewedSubmissions: IReviewedSubmission[]}>('reviews', authenticatedHeaders())

export const getUserReviews = (userId: number) =>
  get<{reviewedSubmissions: IReviewedSubmission[]}>(`reviews?user_id=${userId}`, authenticatedHeaders())
