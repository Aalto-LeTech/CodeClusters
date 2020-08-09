import { action, computed, runInAction, observable } from 'mobx'
import * as searchApi from '../api/search.api'

import { persist } from './persist'

import {
  ISearchCodeParams, ISearchCodeResult, ISolrSearchCodeResponse, ISolrSubmissionWithDate,
} from 'shared'
import { FacetField } from '../types/search'
import { ToastStore } from './ToastStore'
import { LocalSearchStore } from './LocalSearchStore'
import { SearchFacetsStore } from './SearchFacetsStore'

interface IProps {
  toastStore: ToastStore
  localSearchStore: LocalSearchStore
  searchFacetsStore: SearchFacetsStore
}

type SearchResult = {
  numFound?: number
  start?: number
  docs: ISolrSubmissionWithDate[]
  facetCounts: {
    [facet: string]: FacetField[]
  }
}

export const EMPTY_QUERY: ISearchCodeParams = {
  q: '*',
  course_id: undefined,
  exercise_id: undefined,
  facets: {},
  facet_filters: {},
  filters: [],
  case_sensitive: false,
  regex: false,
  whole_words: false
}
const EMPTY_RESULT: SearchResult = {
  numFound: undefined,
  start: undefined,
  docs: [],
  facetCounts: {},
}

export class SearchStore {
  @observable searchResults: ISearchCodeResult[] = []
  @observable selectedSearchResult = EMPTY_RESULT
  @observable searchParams: ISearchCodeParams = EMPTY_QUERY
  @observable searchInProgress: boolean = false
  // For updating SearchConsole using review flows
  @observable initialSearchParams: ISearchCodeParams = EMPTY_QUERY
  toastStore: ToastStore
  localSearchStore: LocalSearchStore
  searchFacetsStore: SearchFacetsStore

  constructor(props: IProps) {
    this.toastStore = props.toastStore
    this.localSearchStore = props.localSearchStore
    this.searchFacetsStore = props.searchFacetsStore
    persist(() => this.searchResults, (val: any) => this.searchResults = val, 'search.searchResults')
  }

  @computed get searchResultsCount() {
    if (this.localSearchStore.active) {
      return this.localSearchStore.foundSubmissionsIndexes.length
    }
    return this.selectedSearchResult.numFound || 0
  }

  @computed get shownSubmissions() {
    if (this.localSearchStore.active) {
      return this.localSearchStore.shownSubmissions
    }
    return this.selectedSearchResult.docs
  }

  @action reset() {
    this.searchResults = []
  }

  @action setInitialSearchParams = (payload: ISearchCodeParams) => {
    this.searchParams = payload
    this.initialSearchParams = payload
  }

  parseSearchResponse(result: ISolrSearchCodeResponse) {
    const docs = result.response.docs.map(r => ({
      ...r,
      date: new Date(r.timestamp),
      highlighted: result.highlighting[r.id].code
    }))
    const facetFields = this.searchFacetsStore.parseFacetFields(result.facet_counts?.facet_fields)
    const facetRanges = this.searchFacetsStore.parseFacetRanges(result.facet_counts?.facet_ranges)
    const searchResult = {
      ...result.response,
      docs,
      facetCounts: { ...facetFields, ...facetRanges },
    }
    return searchResult
  }

  @action addSearchResult(result: ISolrSearchCodeResponse) {
    this.selectedSearchResult = this.parseSearchResponse(result)
  }

  @action search = async (payload: ISearchCodeParams) => {
    this.localSearchStore.setActive(false)
    payload.facets = this.searchFacetsStore.currentFacetParams
    payload.facet_filters = this.searchFacetsStore.createFiltersFromFacets()
    runInAction(() => {
      this.searchInProgress = true
      this.searchParams = payload
    })
    const result = await searchApi.search(payload)
    runInAction(() => {
      if (result) {
        const searchResult = this.parseSearchResponse(result)
        this.selectedSearchResult = searchResult
        this.searchResults.push({ ...searchResult, params: payload })
      }
      this.searchInProgress = false
    })
    return result
  }

  @action searchAll = async () => {
    let result
    try {
      result = await searchApi.searchAll(this.searchParams)
      if (result === undefined) return undefined
    } catch (err) {
      return undefined
    }
    const docs = result.response.docs.map(r => ({
      ...r,
      date: new Date(r.timestamp),
    }))
    return docs
  }

  @action searchIds = async () => {
    const result = await searchApi.searchIds(this.searchParams)
    if (result) {
      return result.response.docs.map(r => r.id)
    }
    return []
  }
}
