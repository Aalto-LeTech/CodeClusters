import { action, runInAction, observable } from 'mobx'
import * as clusterApi from '../api/cluster.api'

import { IRunClusteringParams, IRunClusteringResponse } from 'shared'
import { ToastStore } from './ToastStore'

export class ClusteringStore {
  @observable clusterings: IRunClusteringResponse[] = []
  toastStore: ToastStore

  constructor(props: ToastStore) {
    this.toastStore = props
  }

  @action reset() {
    this.clusterings = []
  }

  @action getClusterings = async () => {
    const result = await clusterApi.getClusteringResults()
    runInAction(() => {
      if (result) {
        // this.clusterings = result
      }
    })
    return result
  }

  @action runClustering = async (payload: IRunClusteringParams) => {
    const result = await clusterApi.runClustering(payload)
    if (result) {
      runInAction(() => {
        // this.toastStore.createToast('Clustering job started', 'success')
        this.clusterings.push(result)
      })
    }
    return result
  }
}
