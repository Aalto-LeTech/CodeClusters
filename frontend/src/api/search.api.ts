import { ISearchCodeParams, ISolrSearchCodeResponse, ISolrSearchAllCodeResponse } from 'shared'

import {
  authenticatedHeaders,
  getWithQuery,
} from './methods'

export const search = (payload: ISearchCodeParams) =>
  getWithQuery<ISolrSearchCodeResponse>('search', payload, authenticatedHeaders())

export const searchAll = (payload: ISearchCodeParams) =>
  getWithQuery<ISolrSearchAllCodeResponse>('search_all', payload, authenticatedHeaders())
