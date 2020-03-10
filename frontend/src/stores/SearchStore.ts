import { action, runInAction, observable } from 'mobx'
import * as searchApi from '../api/search.api'

// import { persist } from './persist'

import { ISearchParams, ISolrSubmissionResponse, ISolrSubmissionWithDate } from 'shared'
import { ToastStore } from './ToastStore'

const EMPTY_QUERY: ISearchParams = {
  q: '',
  course_id: undefined,
  exercise_id: undefined,
  filters: [],
  case_sensitive: false,
  regex: false,
  whole_words: false
}
const EMPTY_RESULT = {
  numFound: undefined,
  start: undefined,
  docs: []
} as {
  numFound?: number
  start?: number
  docs: ISolrSubmissionWithDate[]
}

export class SearchStore {
  @observable searchResults: ISolrSubmissionWithDate[] = []
  @observable searchResult = EMPTY_RESULT
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
    runInAction(() => {
      this.latestQuery = payload
    })
    if (result) {
      runInAction(() => {
        const docs = result.response.docs.map(r => ({
          ...r,
          date: new Date(r.timestamp),
          highlighted: result.highlighting[r.id].code
        }))
        this.searchResult = {
          ...result.response,
          docs
        }
      })
    }
    return result
  }
}
