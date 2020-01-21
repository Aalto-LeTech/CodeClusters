import { ISubmission, ISubmissionCreateParams } from 'common'

import {
  authenticatedHeaders,
  post,
} from './methods'

export const addSubmission = (payload: ISubmissionCreateParams) =>
  post<ISubmission>('submission', payload, authenticatedHeaders())
