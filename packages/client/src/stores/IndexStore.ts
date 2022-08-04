import { action } from 'mobx'
import * as indexApi from '../api/index.api'
import * as solrApi from '../api/solr.api'

import { IIndexMetricsParams } from '@codeclusters/types'

import { ToastStore } from './ToastStore'

export class IndexStore {
  toastStore: ToastStore

  constructor(props: ToastStore) {
    this.toastStore = props
  }

  @action reindexSubmissions = async () => {
    let result
    try {
      result = await solrApi.reindexSubmissions()
      if (result) {
        this.toastStore.createToast('Solr submissions reindexed', 'success')
      }
      return result
    } catch (err) {
      console.log(err)
    }
    return Promise.resolve(undefined)
  }

  @action indexMetrics = async (params: IIndexMetricsParams) => {
    let result
    try {
      result = await indexApi.indexMetrics(params)
      if (result) {
        this.toastStore.createToast('Metrics ran and indexed', 'success')
      }
      return result
    } catch (err) {
      console.log(err)
    }
    return Promise.resolve(undefined)
  }
}
