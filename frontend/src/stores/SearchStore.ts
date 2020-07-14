import { autorun, action, computed, runInAction, observable } from 'mobx'
import * as searchApi from '../api/search.api'

import { persist } from './persist'

import {
  ISearchCodeParams, ISearchFacetParams, ISearchCodeResult, ISupplementaryData, IProgrammingLanguageFacets, EProgrammingLanguage,
  ISolrSearchCodeResponse, ISolrSubmissionWithDate, ICourse, IExercise
} from 'shared'
import { FacetItem, FacetField } from '../types/search'
import { ToastStore } from './ToastStore'
import { LocalSearchStore } from './LocalSearchStore'
import { CourseStore } from './CourseStore'

interface IProps {
  toastStore: ToastStore
  localSearchStore: LocalSearchStore
  courseStore: CourseStore
}

type FacetParams = {
  [language: string]: {
    [facet: string]: ISearchFacetParams
  }
}
type SearchResult = {
  numFound?: number
  start?: number
  docs: ISolrSubmissionWithDate[]
  facetCounts: {
    [facet: string]: FacetField[]
  }
}
type FacetFieldFilters = {
  [facet_field: string]: boolean
  // [facet: string]: {
  //   [value: string]: boolean
  // }
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
const EMPTY_FACETS: IProgrammingLanguageFacets = {
  programming_language: EProgrammingLanguage.JAVA,
  tokens: [],
  metrics: [],
}
const FACETS_MAPPING = {
  LinesOfCode: 'LOC_metric',
  JavaNCSS_method: 'NCSS_method_metric',
  JavaNCSS_class: 'NCSS_class_metric',
  JavaNCSS_file: 'NCSS_file_metric',
  CyclomaticComplexity: 'CYC_metric',
  NPathComplexity: 'NPath_metric',
  ClassDataAbstractionCoupling: 'CDAC_metric',
  ClassFanOutComplexity: 'CFOC_metric',
  BooleanExpressionComplexity: 'bool_expression_metric',
  'Symbolic names': 'symbolic_names_tokens',
  'Rare symbolic names': 'rare_symbolic_names_tokens',
  Rules: 'rules_tokens'
}

export class SearchStore {
  @observable searchResults: ISearchCodeResult[] = []
  @observable selectedSearchResult = EMPTY_RESULT
  @observable searchParams: ISearchCodeParams = EMPTY_QUERY
  @observable supplementaryData: ISupplementaryData = { stats: [], facets: [] }
  @observable currentSearchFacets: IProgrammingLanguageFacets = EMPTY_FACETS
  @observable facetParams: FacetParams = {
    JAVA: {}
  }
  @observable selectedFacetFields: FacetFieldFilters = {}
  // For updating SearchConsole using review flows
  @observable initialSearchParams: ISearchCodeParams = EMPTY_QUERY
  toastStore: ToastStore
  localSearchStore: LocalSearchStore
  courseStore: CourseStore

  constructor(props: IProps) {
    this.toastStore = props.toastStore
    this.localSearchStore = props.localSearchStore
    this.courseStore = props.courseStore
    persist(() => this.searchResults, (val: any) => this.searchResults = val, 'search.searchResults')
    persist(() => this.supplementaryData, (val: any) => this.supplementaryData = val, 'search.supplementaryData')
    persist(() => this.currentSearchFacets, (val: any) => this.currentSearchFacets = val, 'search.currentSearchFacets')
    this.watchSelectedCourseExercise()
  }

  watchSelectedCourseExercise = () => {
    autorun(() => {
      this.setCurrentSearchFacets(this.supplementaryData, this.courseStore.selectedCourse, this.courseStore.selectedExercise)
    })
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

  @computed get currentFacetParams() {
    return this.facetParams[this.currentSearchFacets.programming_language]
  }

  @computed get currentMetricsFacets() : FacetItem[] {
    return this.currentSearchFacets.metrics.map(m => ({
      key: FACETS_MAPPING[m],
      value: m,
    }))
  }

  @computed get currentTokensFacets() : FacetItem[] {
    return this.currentSearchFacets.tokens.map(m => ({
      key: FACETS_MAPPING[m],
      value: m,
    }))
  }

  @action reset() {
    this.searchResults = []
  }

  @action setInitialSearchParams = (payload: ISearchCodeParams) => {
    this.searchParams = payload
    this.initialSearchParams = payload
  }

  @action setCurrentSearchFacets = (supplementaryData: ISupplementaryData, course?: ICourse, exercise?: IExercise) => {
    let found
    if (exercise) {
      found = supplementaryData.facets.find(f => f.programming_language === exercise.programming_language)
    } else if (course) {
      found = supplementaryData.facets.find(f => f.programming_language === course.default_programming_language)
    }
    this.currentSearchFacets = found || EMPTY_FACETS
  }

  @action toggleSearchFacetParams = (facet: string) => {
    const { programming_language } = this.currentSearchFacets
    if (this.facetParams[programming_language][facet]) {
      delete this.facetParams[programming_language][facet]
      // Delete all facet fields of the same untoggled facet
      Object.keys(this.selectedFacetFields).forEach(val => {
        if (val.includes(facet)) {
          delete this.selectedFacetFields[val]
        }
      })
    } else {
      this.facetParams[programming_language][facet] = true
    }
    // trigger new search with facets?
  }

  @action toggleFacetField = (item: FacetItem, field: FacetField, val: boolean) => {
    this.selectedFacetFields[`${item.key}.${field.value}`] = val
  }

  createFiltersFromFacets(selectedFacetFields: FacetFieldFilters) {
    const keys = Object.keys(selectedFacetFields)
    // Generate an object with the checked facet fields as lists eg { LOC_metric: ["30", "29", "27"] }
    return keys.reduce((acc: { [facet: string]: string[] }, facetField) => {
      // Discard false values
      if (!selectedFacetFields[facetField]) return acc
      const values = facetField.split('.')
      if (values.length !== 2) {
        throw Error(`Either facet or its field has extra "." in it, unable to parse the values: ${facetField}`)
      }
      const facet = values[0]
      const field = values[1]
      if (acc[facet] === undefined) {
        acc[facet] = [field]
      } else {
        acc[facet].push(field)
      }
      return acc
    }, {})
  }

  parseSearchResponse(result: ISolrSearchCodeResponse) {
    const docs = result.response.docs.map(r => ({
      ...r,
      date: new Date(r.timestamp),
      highlighted: result.highlighting[r.id].code
    }))
    const facetFields = result.facet_counts?.facet_fields || {}
    // Counts are returned as list of values where first is the name of the bucket and then its count eg
    // "LOC_metric":["28",15,"29",14,"30",13,"26",12,"27",11,"32",11]
    const facetCounts = Object.keys(facetFields).reduce((acc, facet) => {
      let counts = []
      for (let i = 0; i < facetFields[facet].length; i += 2) {
        counts.push({
          value: facetFields[facet][i],
          count: facetFields[facet][i + 1],
        })
      }
      acc[facet] = counts
      return acc
    }, {})
    const searchResult = {
      ...result.response,
      docs,
      facetCounts,
    }
    return searchResult
  }

  @action addSearchResult(result: ISolrSearchCodeResponse) {
    this.selectedSearchResult = this.parseSearchResponse(result)
  }

  @action search = async (payload: ISearchCodeParams) => {
    this.localSearchStore.setActive(false)
    payload.facets = this.currentFacetParams
    payload.facet_filters = this.createFiltersFromFacets(this.selectedFacetFields)
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
      runInAction(() => {
        this.supplementaryData = result
      })
    }
    return result
  }
}
