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
  @observable activeCluster: string | null = null
  toastStore: ToastStore
  localSearchStore: LocalSearchStore

  constructor(props: IProps) {
    this.toastStore = props.toastStore
    this.localSearchStore = props.localSearchStore
    persist(() => this.latestRunNgram, (val: any) => this.latestRunNgram = val, 'clusters.latestRunNgram')
  }

  @computed get ngramHistogramData() {
    if (this.latestRunNgram) {
      const clusterKeys = Object.keys(this.latestRunNgram.ngram.clusters)
      const histData = clusterKeys.map((key, i) => ({
        cluster: key,
        name: key,
        count: this.latestRunNgram!.ngram.clusters[key].length,
      }))
      return histData
    }
    return []
  }

  @computed get ngramScatterData() {
    if (this.latestRunNgram) {
      return this.latestRunNgram.ngram['2d']
    }
    return []
  }

  @computed get currentClusters() {
    if (this.latestRunNgram) {
      return this.latestRunNgram!.ngram.clusters
    }
    return []
  }

  @action reset() {
    this.latestRunNgram = undefined
  }

  @action resetActiveCluster = () => {
    this.activeCluster = null
    this.localSearchStore.resetLocalSelectedSubmissions()
  }

  @action setLatestNgramModel = (model?: IRunNgramResponse) => {
    this.latestRunNgram = model
  }

  @action setActiveCluster = (cluster: string) => {
    this.activeCluster = cluster
    if (this.latestRunNgram) {
      this.localSearchStore.setSelectedSubmissions(this.latestRunNgram!.ngram.clusters[cluster])
      this.localSearchStore.searchByIds(this.latestRunNgram!.ngram.clusters[cluster])
      this.localSearchStore.setSelectedPage(1)
    }
  }
}
