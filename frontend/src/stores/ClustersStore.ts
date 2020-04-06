import { action, computed, runInAction, observable } from 'mobx'

import { persist } from './persist'

import {
  IRunNgramResponse
} from 'shared'
import { ToastStore } from './ToastStore'
import { LocalSearchStore } from './LocalSearchStore'

interface IProps {
  toastStore: ToastStore
  localSearchStore: LocalSearchStore
}

export class ClustersStore {
  @observable latestRunNgram?: IRunNgramResponse = undefined
  @observable shownSubmissions: number[] = []
  @observable activeCluster: number = 0
  toastStore: ToastStore
  localSearchStore: LocalSearchStore

  constructor(props: IProps) {
    this.toastStore = props.toastStore
    this.localSearchStore = props.localSearchStore
    persist(() => this.latestRunNgram, (val: any) => this.latestRunNgram = val, 'clusters.latestRunNgram')
  }

  @computed get getNgramHistogramData() {
    if (this.latestRunNgram) {
      const clusterKeys = Object.keys(this.latestRunNgram.ngram.clusters) as unknown as number[]
      const histData = clusterKeys.map((key, i) => ({
        cluster: key,
        name: key.toString(),
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
  }

  @action setLatestNgramModel(model?: IRunNgramResponse) {
    this.latestRunNgram = model
  }

  @action setActiveCluster(cluster: number) {
    this.activeCluster = cluster
    if (this.latestRunNgram) {
      this.localSearchStore.searchByIds(this.latestRunNgram!.ngram.clusters[cluster])
    }
  }
}
