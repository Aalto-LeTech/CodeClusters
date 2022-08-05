import {
  IReview,
  IReviewSubmission,
  IReviewedSubmission,
  IReviewListQueryParams,
  IReviewCreateParams,
  IAcceptReviewsParams,
  IReviewSubmissionPutParams,
} from '@codeclusters/types'

import { authenticatedHeaders, get, getWithQuery, post, put, del } from './methods'

export const addReview = (payload: IReviewCreateParams) =>
  post<IReview>('review', payload, authenticatedHeaders())

export const updateReview = (reviewId: number, payload: Partial<IReview>) =>
  put<boolean>(`review/${reviewId}`, payload, authenticatedHeaders())

export const upsertReviewSubmission = (
  reviewId: number,
  submissionId: string,
  payload: IReviewSubmissionPutParams
) => put<boolean>(`review_submission/${reviewId}/${submissionId}`, payload, authenticatedHeaders())

export const deleteReview = (reviewId: number) =>
  del<boolean>(`review/${reviewId}`, authenticatedHeaders())

export const deleteReviewSubmission = (reviewId: number, submissionId: string) =>
  del<boolean>(`review_submission/${reviewId}/${submissionId}`, authenticatedHeaders())

export const getReviews = (payload: IReviewListQueryParams) =>
  getWithQuery<{
    reviews: IReview[]
    reviewSubmissions: IReviewSubmission[]
  }>('reviews', payload, authenticatedHeaders())

export const acceptPendingReviews = (payload: IAcceptReviewsParams) =>
  post<boolean>('reviews/pending', payload, authenticatedHeaders())

export const getUserReviews = (userId: number) =>
  get<{ reviewedSubmissions: IReviewedSubmission[] }>(
    `reviews/user/${userId}`,
    authenticatedHeaders()
  )
