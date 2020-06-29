import { action } from 'mobx'
import * as solrApi from '../api/solr.api'

import { ToastStore } from './ToastStore'

export class SolrStore {
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
}
