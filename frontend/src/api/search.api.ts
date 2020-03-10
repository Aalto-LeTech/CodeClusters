import { ISearchParams, ISolrSearchResponse } from 'shared'

import {
  authenticatedHeaders,
  getWithQuery,
} from './methods'


export const search = (payload: ISearchParams) =>
  getWithQuery<ISolrSearchResponse>('search', payload, authenticatedHeaders())
