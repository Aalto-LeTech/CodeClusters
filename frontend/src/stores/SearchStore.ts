import { action, runInAction, observable } from 'mobx'
import * as searchApi from '../api/search.api'

import { persist } from './persist'

import {
  ISearchCodeParams, ISearchCodeResult, ISolrSearchCodeResponse, ISolrSubmissionWithDate
} from 'shared'
import { ToastStore } from './ToastStore'
import { LocalSearchStore } from './LocalSearchStore'

interface IProps {
  toastStore: ToastStore
  localSearchStore: LocalSearchStore
}

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
  @observable currentlySelectedIds: string[] = []
  @observable selectedSearchResult = EMPTY_RESULT
  @observable searchParams: ISearchCodeParams = EMPTY_QUERY
  toastStore: ToastStore
  localSearchStore: LocalSearchStore

  constructor(props: IProps) {
    this.toastStore = props.toastStore
    this.localSearchStore = props.localSearchStore
    persist(() => this.searchResults, (val: any) => this.searchResults = val, 'search.searchResults')
  }

  @action reset() {
    this.searchResults = []
  }

  @action resetSelectedIds() {
    this.currentlySelectedIds = []
  }

  parseSearchResponse(result: ISolrSearchCodeResponse) {
    const docs = result.response.docs.map(r => ({
      ...r,
      date: new Date(r.timestamp),
      highlighted: result.highlighting[r.id].code
    }))
    const searchResult = {
      ...result.response,
      docs
    }
    return searchResult
  }

  @action addSearchResult(result: ISolrSearchCodeResponse) {
    this.selectedSearchResult = this.parseSearchResponse(result)
  }

  @action search = async (payload: ISearchCodeParams) => {
    this.localSearchStore.setActive(false)
    const result = await searchApi.search(payload)
    runInAction(() => {
      this.searchParams = payload
    })
    if (result) {
      runInAction(() => {
        const searchResult = this.parseSearchResponse(result)
        this.selectedSearchResult = searchResult
        this.searchResults.push({ ...searchResult, params: payload })
      })
    }
    return result
  }


  @action searchAll = async () => {
    const result = await searchApi.searchAll(this.searchParams)
    if (result === undefined) return undefined
    const docs = result.response.docs.map(r => ({
      ...r,
      date: new Date(r.timestamp),
    }))
    // const searchResult = {
    //   ...result.response,
    //   docs
    // }
    return docs
  }
}
