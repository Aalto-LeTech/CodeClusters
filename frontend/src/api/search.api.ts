import { ISearchParams, ISearchResponse } from 'shared'

import {
  authenticatedHeaders,
  get,
} from './methods'


export const search = (payload: ISearchParams) =>
  get<ISearchResponse>('search', payload, authenticatedHeaders())
