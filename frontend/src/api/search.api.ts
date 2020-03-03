import { ISearchParams, ISolrSubmissionResponse } from 'shared'

import {
  authenticatedHeaders,
  getWithQuery,
} from './methods'


export const search = (payload: ISearchParams) =>
  getWithQuery<ISolrSubmissionResponse>('search', payload, authenticatedHeaders())
