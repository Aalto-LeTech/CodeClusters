import {
  ISearchCodeParams,
  ISolrSearchCodeResponse,
  ISolrSearchAllCodeResponse,
  ISolrSearchAllIdsResponse,
} from '@codeclusters/types'

import { authenticatedHeaders, get, getWithQuery } from './methods'

export const search = (payload: ISearchCodeParams) =>
  getWithQuery<ISolrSearchCodeResponse>('search', payload, authenticatedHeaders())

export const searchAll = (payload: ISearchCodeParams) =>
  getWithQuery<ISolrSearchAllCodeResponse>('search_all', payload, authenticatedHeaders())

export const searchIds = (payload: ISearchCodeParams) =>
  getWithQuery<ISolrSearchAllIdsResponse>('search_ids', payload, authenticatedHeaders())

export const getSearchSupplementaryData = () =>
  get<any>('search/supplementary', authenticatedHeaders())
