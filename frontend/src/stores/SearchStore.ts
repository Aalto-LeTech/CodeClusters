import { action, runInAction, observable } from 'mobx'
import * as searchApi from '../api/search.api'

// import { persist } from './persist'

import { ISearchParams, ISearchResult } from 'shared'
import { ToastStore } from './ToastStore'

export class SearchStore {
  @observable searchResults: ISearchResult[] = []
  toastStore: ToastStore

  constructor(props: ToastStore) {
    this.toastStore = props
  }

  @action reset() {
    this.searchResults = []
  }

  @action search = async (payload: ISearchParams) => {
    const result = await searchApi.search(payload)
    if (result) {
      runInAction(() => {
        this.searchResults = result.results.map(r => ({ ...r, date: new Date(r.timestamp) }))
      })
    }
    return result
  }
}
