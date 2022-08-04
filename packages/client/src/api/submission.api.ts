import { ISubmission, ISubmissionListQueryParams, ISubmissionCreateParams } from '@codeclusters/types'

import {
  authenticatedHeaders,
  getWithQuery,
  post,
} from './methods'

export const getSubmissions = (payload: ISubmissionListQueryParams) =>
  getWithQuery<{ submissions: ISubmission[]}>('submissions', payload, authenticatedHeaders())

export const addSubmission = (payload: ISubmissionCreateParams) =>
  post<ISubmission>('submission', payload, authenticatedHeaders())
