import { ISubmission, ISubmissionListQueryParams, ISubmissionCreateParams } from 'shared'

import {
  authenticatedHeaders,
  getWithQuery,
  post,
} from './methods'

export const getSubmissions = (payload: ISubmissionListQueryParams) =>
  getWithQuery<{ submissions: ISubmission[]}>('submissions', payload, authenticatedHeaders())

export const addSubmission = (payload: ISubmissionCreateParams) =>
  post<ISubmission>('submission', payload, authenticatedHeaders())
