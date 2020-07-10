import { action, computed, runInAction, observable } from 'mobx'
import * as searchApi from '../api/search.api'

import { persist } from './persist'

import {
  ISearchCodeParams, ISearchFilter, ISearchCodeResult, ISolrSearchCodeResponse, ISolrSubmissionWithDate
} from 'shared'
import { ToastStore } from './ToastStore'
import { LocalSearchStore } from './LocalSearchStore'

interface IProps {
  toastStore: ToastStore
  localSearchStore: LocalSearchStore
}

export const EMPTY_QUERY: ISearchCodeParams = {
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
  @observable selectedSearchResult = EMPTY_RESULT
  @observable searchParams: ISearchCodeParams = EMPTY_QUERY
  @observable filters: ISearchFilter[] = []
  @observable supplementaryData: any = {}
  // For updating SearchConsole using review flows
  @observable initialSearchParams: ISearchCodeParams = EMPTY_QUERY
  toastStore: ToastStore
  localSearchStore: LocalSearchStore

  constructor(props: IProps) {
    this.toastStore = props.toastStore
    this.localSearchStore = props.localSearchStore
    persist(() => this.searchResults, (val: any) => this.searchResults = val, 'search.searchResults')
  }

  @computed get searchResultsCount() {
    if (this.localSearchStore.active) {
      return this.localSearchStore.foundSubmissionsIndexes.length
    }
    return this.selectedSearchResult.numFound || 0
  }

  @computed get getShownSubmissions() {
    if (this.localSearchStore.active) {
      return this.localSearchStore.shownSubmissions
    }
    return this.selectedSearchResult.docs
  }

  @action reset() {
    this.searchResults = []
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

  @action setInitialSearchParams = (payload: ISearchCodeParams) => {
    this.searchParams = payload
    this.initialSearchParams = payload
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

  @action searchIds = async () => {
    const result = await searchApi.searchIds(this.searchParams)
    if (result) {
      return result.response.docs.map(r => r.id)
    }
    return []
  }

  @action getSearchSupplementaryData = async () => {
    const result = await searchApi.getSearchSupplementaryData()
    if (result) {
      this.supplementaryData = result
    }
    return result
  }
}
