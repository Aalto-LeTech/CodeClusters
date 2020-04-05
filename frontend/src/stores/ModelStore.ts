import { action, computed, runInAction, observable } from 'mobx'
import * as modelApi from '../api/model.api'

import {
  IModel, IRunModelResponse, IRunNgramParams, IRunNgramResponse, NgramModelId
} from 'shared'
import { ToastStore } from './ToastStore'
import { SearchStore } from './SearchStore'

interface IProps {
  toastStore: ToastStore
  searchStore: SearchStore
}

export class ModelStore {
  @observable models: IModel[] = []
  @observable selectedModel?: IModel = undefined
  @observable runModels: IRunModelResponse[] = []
  @observable latestRunNgram?: IRunNgramResponse = undefined
  @observable modelParameters: { 
    [NgramModelId]: Partial<IRunNgramParams>
  } = {
    [NgramModelId]: {
      ngrams: [5, 5],
      n_components: 50
    }
  }
  toastStore: ToastStore
  searchStore: SearchStore

  constructor(props: IProps) {
   this.toastStore = props.toastStore
   this.searchStore = props.searchStore
 }

  @computed get getNgramHistogramData() {
    if (this.latestRunNgram) {
      const clusterKeys = Object.keys(this.latestRunNgram.ngram.clusters)
      const histData = clusterKeys.map((key, i) => ({
        cluster: i,
        name: key,
        count: this.latestRunNgram!.ngram.clusters[key].length,
      }))
      return histData
    }
    return []
  }

  @computed get getNgramScatterData() {
    if (this.latestRunNgram) {
      return this.latestRunNgram.ngram.TSNE
    }
    return []
  }

  @action reset() {
    this.latestRunNgram = undefined
  }

  @action setSelectedModel(title?: string) {
    this.selectedModel = this.models.find(m => m.title === title)
  }

  @action setLatestRunNgram(model: IRunNgramResponse) {
    this.runModels.push(model)
    this.latestRunNgram = model
  }

  @action updateModelParameters(model_id: string, data: Partial<IRunNgramParams>) {
    this.modelParameters[model_id] = { ...this.modelParameters[model_id], ...data }
  }

  @action runModel = async (model_id: string) => {
    const submission_ids = await this.searchStore.searchIds()
    if (submission_ids.length === 0) {
      this.toastStore.createToast('Bad search parameters', 'danger')
      return undefined
    }
    const payload = { ...this.modelParameters[model_id], model_id, submission_ids }
    const result = await modelApi.runModel(model_id, payload)
    runInAction(() => {
      if (result) {
        this.toastStore.createToast('Model ran successfully', 'success')
        this.runModels.push(result)
        if (model_id === NgramModelId) this.latestRunNgram = result
      }
    })
    return result
  }

  @action runNgram = async (payload: IRunNgramParams) => {
    const result = await modelApi.runNgram(payload)
    runInAction(() => {
      if (result) {
        this.toastStore.createToast('Ngram model ran', 'success')
        this.runModels.push(result)
        this.latestRunNgram = result
      }
    })
    return result
  }

  @action getModels = async () => {
    const result = await modelApi.getModels()
    runInAction(() => {
      if (result) {
        this.models = result.models
      }
    })
    return result?.models
  }
}
