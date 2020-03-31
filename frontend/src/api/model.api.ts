import { IRunNgramParams, IRunNgramResponse } from 'shared'

import {
  authenticatedHeaders,
  post,
} from './methods'

export const runNgram = (payload: IRunNgramParams) =>
  post<IRunNgramResponse>('model/ngram', payload, authenticatedHeaders())
