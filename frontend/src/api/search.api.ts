import { ISearchParams, ISearchResponse } from 'shared'

import {
  authenticatedHeaders,
  getWithQuery,
} from './methods'


export const search = (payload: ISearchParams) =>
  getWithQuery<ISearchResponse>('search', payload, authenticatedHeaders())
