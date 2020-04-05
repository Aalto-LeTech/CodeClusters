import { IModel, IModelParams, IRunModelResponse, IRunNgramParams, IRunNgramResponse } from 'shared'

import {
  authenticatedHeaders,
  get,
  post,
} from './methods'

export const runModel = (model_id: string, payload: IModelParams) =>
  post<IRunModelResponse>(`model/${model_id}`, payload, authenticatedHeaders())

export const runNgram = (payload: IRunNgramParams) =>
  post<IRunNgramResponse>('model/ngram', payload, authenticatedHeaders())

export const getModels = () =>
  get<{ models: IModel[]}>('models', authenticatedHeaders())
