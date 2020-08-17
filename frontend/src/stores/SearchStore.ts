import { action, computed, runInAction, observable } from 'mobx'
import * as searchApi from '../api/search.api'

import { persist } from './persist'

import {
  ISearchCodeParams, ISearchCodeResult, ISolrSearchCodeResponse,
  ISolrSubmissionWithDate, ISolrFullSubmissionWithDate
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
  num_results: undefined,
  num_lines: undefined,
  results_start: 0,
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
  @observable selectedPage: number = 1
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
    if (this.localSearchStore.searchActive) {
      return this.localSearchStore.searchedSubmissionIndexes.length
    }
    return this.selectedSearchResult.numFound || 0
  }

  @computed get searchResultsStart() {
    if (this.localSearchStore.searchActive) {
      return 0
    }
    return this.selectedSearchResult.start || 0
  }

  @computed get shownSubmissions() {
    if (this.localSearchStore.searchActive) {
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

  @action setSelectedPage = (page: number) => {
    if (this.localSearchStore.searchActive) {
      this.selectedPage = page
    } else {
      const numResults = this.searchParams.num_results || 20
      // mobx won't trigger observers of searchParams when non-observable keys are changed (or something)
      // -> set the whole object
      this.searchParams = { ...this.searchParams, ...{ results_start: numResults * (page - 1) } }
      this.selectedPage = page
      this.search(this.searchParams)
    }
  }

  parseSearchResponse(result: ISolrSearchCodeResponse) {
    const docs = result.response.docs.map(r => {
      const { code, ...rest } = r
      return {
        ...rest,
        date: new Date(r.timestamp),
        highlighted: result.highlighting !== undefined ? result.highlighting[r.id].code : code as string[]
      }
    })
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
        const numResults = payload.num_results || 20
        this.selectedPage = Math.ceil((payload.results_start || 0) / numResults) + 1
      }
      this.searchInProgress = false
    })
    return result
  }

  @action searchAll = async () => {
    let result
    const payload = { ...this.searchParams }
    payload.facets = this.searchFacetsStore.currentFacetParams
    payload.facet_filters = this.searchFacetsStore.createFiltersFromFacets()
    try {
      result = await searchApi.searchAll(payload)
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
    const payload = { ...this.searchParams }
    payload.facets = this.searchFacetsStore.currentFacetParams
    payload.facet_filters = this.searchFacetsStore.createFiltersFromFacets()
    const result = await searchApi.searchIds(payload)
    if (result) {
      return result.response.docs.map(r => r.id)
    }
    return []
  }
}
