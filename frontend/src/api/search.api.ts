import { ISearchCodeParams, ISolrSearchCodeResponse, ISolrSearchIdsResponse } from 'shared'

import {
  authenticatedHeaders,
  getWithQuery,
} from './methods'


export const search = (payload: ISearchCodeParams) =>
  getWithQuery<ISolrSearchCodeResponse>('search', payload, authenticatedHeaders())

export const searchIds = (payload: ISearchCodeParams) =>
  getWithQuery<ISolrSearchIdsResponse>('search_ids', payload, authenticatedHeaders())
