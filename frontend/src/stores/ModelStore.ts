import { action, computed, runInAction, observable } from 'mobx'
import * as modelApi from '../api/model.api'

// import { persist } from './persist'

import {
  IModel, IModelParams, IRunModelResponse, INgramParams, NgramModelId
} from 'shared'
import { ToastStore } from './ToastStore'
import { SearchStore } from './SearchStore'
import { LocalSearchStore } from './LocalSearchStore'
import { ClustersStore } from './ClustersStore'

interface IProps {
  toastStore: ToastStore
  searchStore: SearchStore
  localSearchStore: LocalSearchStore
  clustersStore: ClustersStore
}

export class ModelStore {
  @observable models: IModel[] = []
  @observable selectedModel?: IModel = undefined
  @observable runModels: IRunModelResponse[] = []
  @observable modelParameters: { 
    [NgramModelId]: INgramParams
  } = {
    [NgramModelId]: {
      model_id: NgramModelId,
      token_set: 'modified',
      ngrams: [5, 5],
      svd_n_components: 40
    }
  }
  toastStore: ToastStore
  searchStore: SearchStore
  localSearchStore: LocalSearchStore
  clustersStore: ClustersStore

  constructor(props: IProps) {
   this.toastStore = props.toastStore
   this.searchStore = props.searchStore
   this.localSearchStore = props.localSearchStore
   this.clustersStore = props.clustersStore
 }

  @action reset() {
  }

  @action setSelectedModel(title?: string) {
    this.selectedModel = this.models.find(m => m.title === title)
  }

  @action updateModelParameters(model_id: string, data: Partial<INgramParams>) {
    this.modelParameters[model_id] = { ...this.modelParameters[model_id], ...data }
  }

  @action runModel = async (data: IModelParams) => {
    const submissions = await this.searchStore.searchAll()
    if (submissions === undefined) {
      this.toastStore.createToast('Bad search parameters', 'danger')
      return undefined
    }
    if (submissions.length < 20) {
      this.toastStore.createToast('Less than 20 search results', 'danger')
      return undefined
    }
    const payload = {
      ...data,
      submissions: submissions.map(s => ({ id: s.id, code: s.code[0] }))
    }
    this.localSearchStore.setSubmissions(submissions)
    this.localSearchStore.setActive(true)
    const result = await modelApi.runModel(data.model_id, payload)
    runInAction(() => {
      if (result) {
        this.toastStore.createToast('Model ran successfully', 'success')
        this.runModels.push(result)
        if (data.model_id === NgramModelId) {
          this.clustersStore.setLatestNgramModel(result)
          const firstCluster = Object.keys(result.ngram.clusters)[0]
          if (firstCluster) {
            this.clustersStore.setActiveCluster(firstCluster)
          }
        }
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
