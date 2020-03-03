import { action, runInAction, observable } from 'mobx'
import * as searchApi from '../api/search.api'

// import { persist } from './persist'

import { ISearchParams, ISolrSubmissionWithDate } from 'shared'
import { ToastStore } from './ToastStore'

const EMPTY_QUERY = {
  q: '',
  course_id: undefined,
  exercise_id: undefined,
  filters: [],
  case_sensitive: false,
  regex: false,
  whole_words: false
} as ISearchParams

export class SearchStore {
  @observable searchResults: ISolrSubmissionWithDate[] = []
  @observable latestQuery: ISearchParams = EMPTY_QUERY
  toastStore: ToastStore

  constructor(props: ToastStore) {
    this.toastStore = props
  }

  @action reset() {
    this.searchResults = []
  }

  @action search = async (payload: ISearchParams) => {
    const result = await searchApi.search(payload)
    this.latestQuery = payload
    if (result) {
      runInAction(() => {
        this.searchResults = result.response.docs.map(r => ({ ...r, date: new Date(r.timestamp) }))
      })
    }
    return result
  }
}
