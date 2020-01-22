import { ISubmission, ISubmissionCreateParams } from 'shared'

import {
  authenticatedHeaders,
  get,
  post,
} from './methods'

export const getSubmissions = () =>
  get<{ submissions: ISubmission[]}>('submissions', authenticatedHeaders())

export const addSubmission = (payload: ISubmissionCreateParams) =>
  post<ISubmission>('submission', payload, authenticatedHeaders())
