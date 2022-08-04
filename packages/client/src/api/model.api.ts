import { IModel, IModelParams, IRunModelResponse } from '@codeclusters/types'

import { authenticatedHeaders, get, post } from './methods'

export const runModel = (model_id: string, payload: IModelParams) =>
  post<IRunModelResponse>(`model/${model_id}`, payload, authenticatedHeaders())

export const getModels = () => get<{ models: IModel[] }>('models', authenticatedHeaders())
