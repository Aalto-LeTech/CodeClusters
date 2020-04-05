import { action, runInAction, observable } from 'mobx'
import * as searchApi from '../api/search.api'

import { persist } from './persist'

import {
  ISearchCodeParams, ISearchCodeResult, ISolrSearchCodeResponse, ISolrSubmissionWithDate
} from 'shared'
import { ToastStore } from './ToastStore'

const EMPTY_QUERY: ISearchCodeParams = {
  q: '*',
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
  @observable searchResults: ISearchCodeResult[] = []
  @observable searchedIds: string[] = []
  @observable selectedSearchResult = EMPTY_RESULT
  @observable searchParams: ISearchCodeParams = EMPTY_QUERY
  toastStore: ToastStore

  constructor(props: ToastStore) {
    this.toastStore = props
    persist(() => this.searchResults, (val: any) => this.searchResults = val, 'search.searchResults')
  }

  @action reset() {
    this.searchResults = []
  }

  @action addSearchResult(result: ISolrSearchCodeResponse) {
    const docs = result.response.docs.map(r => ({
      ...r,
      date: new Date(r.timestamp),
      highlighted: result.highlighting[r.id].code
    }))
    const searchResult = {
      ...result.response,
      docs
    }
    this.selectedSearchResult = searchResult
  }

  @action search = async (payload: ISearchCodeParams) => {
    const result = await searchApi.search(payload)
    runInAction(() => {
      this.searchParams = payload
    })
    if (result) {
      runInAction(() => {
        const docs = result.response.docs.map(r => ({
          ...r,
          date: new Date(r.timestamp),
          highlighted: result.highlighting[r.id].code,
        }))
        const searchResult = {
          ...result.response,
          docs
        }
        this.selectedSearchResult = searchResult
        this.searchResults.push({ ...searchResult, params: payload })
      })
    }
    return result
  }

  @action searchIds = async () => {
    const result = await searchApi.searchIds(this.searchParams)
    let ids = [] as string[]
    if (result) {
      runInAction(() => {
        ids = result.response.docs.map(r => r.id)
        this.searchedIds = ids
      })
    }
    return ids
  }
}
