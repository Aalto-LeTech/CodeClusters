import { action, computed, runInAction, observable } from 'mobx'
import * as modelApi from '../api/model.api'

import { IRunModelResult, IRunNgramParams, IRunNgramResponse } from 'shared'
import { ToastStore } from './ToastStore'

export class ModelStore {
  @observable runModels: IRunModelResult[] = []
  @observable latestRunNgram?: IRunNgramResponse
  toastStore: ToastStore

  constructor(props: ToastStore) {
    this.toastStore = props
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

  @action setLatestRunNgram(model: IRunNgramResponse) {
    this.runModels.push(model)
    this.latestRunNgram = model
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
}
