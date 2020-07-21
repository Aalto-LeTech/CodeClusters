import { autorun, action, computed, extendObservable, runInAction, observable } from 'mobx'
import * as searchApi from '../api/search.api'

import { persist } from './persist'

import {
  ISearchCodeParams, ISearchFacetParams, ISearchFacetRange, ISearchCodeResult, ISupplementaryData, IProgrammingLanguageFacets,
  EProgrammingLanguage, ISolrSearchCodeResponse, ISolrSubmissionWithDate, ICourse, IExercise
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

type SearchResult = {
  numFound?: number
  start?: number
  docs: ISolrSubmissionWithDate[]
  facetCounts: {
    [facet: string]: FacetField[]
  }
}
type SearchFacetParams = {
  [language: string]: {
    [facet: string]: ISearchFacetParams
  }
}
type ToggledFacetFields = {
  [facet: string]: {
    [facet_field: string]: boolean
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
const RANGE_DELIMITER = ' - '

export class SearchStore {
  @observable searchResults: ISearchCodeResult[] = []
  @observable selectedSearchResult = EMPTY_RESULT
  @observable searchParams: ISearchCodeParams = EMPTY_QUERY
  @observable searchInProgress: boolean = false
  @observable supplementaryData: ISupplementaryData = { stats: [], facets: [] }
  @observable currentSearchFacets: IProgrammingLanguageFacets = EMPTY_FACETS
  @observable facetParams: SearchFacetParams = {
    JAVA: {}
  }
  @observable toggledFacetFields: ToggledFacetFields = {}
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
      this.toggledFacetFields[facet] = {}
    } else {
      this.facetParams[programming_language][facet] = true
    }
    // trigger new search with facets?
  }

  @action setFacetParamsRange = (facet: string, range?: ISearchFacetRange) => {
    const { programming_language } = this.currentSearchFacets
    if (range) {
      this.facetParams[programming_language][facet] = range
    } else {
      this.facetParams[programming_language][facet] = true
      // Delete any existing checked range fields
      this.toggledFacetFields[facet] = {}
    }
  }

  /**
   * Toggles a facet's facet field value to either true or false
   * 
   * The nasty logic here is for extending the observability of the object for nested values since mobx does not do that by default.
   * @param item The key-value pair of a facet
   * @param field The value-count pair of a facet field
   * @param val The toggled value from the CheckBox
   */
  @action toggleFacetField = (item: FacetItem, field: FacetField, val: boolean) => {
    if (this.toggledFacetFields[item.key] === undefined) {
      this.toggledFacetFields[item.key] = {}
    }
    if (this.toggledFacetFields[item.key][field.value] === undefined) {
      extendObservable(this.toggledFacetFields[item.key], { [field.value]: val })
    } else {
      this.toggledFacetFields[item.key][field.value] = val
    }
  }

  joinAdjacentFacetFilters(field: string, filters: string[]) {
    const previous = filters[filters.length - 1]
    const previousRangeEnd = previous.substr(previous.indexOf(RANGE_DELIMITER) + RANGE_DELIMITER.length)
    const currentRangeStart = field.substr(0, field.indexOf(RANGE_DELIMITER))
    if (previousRangeEnd === currentRangeStart) {
      const previousRangeStart = previous.substr(0, previous.indexOf(RANGE_DELIMITER))
      const currentRangeEnd = field.substr(field.indexOf(RANGE_DELIMITER) + RANGE_DELIMITER.length)
      const range = `${previousRangeStart}${RANGE_DELIMITER}${currentRangeEnd}`
      return range
    }
    return undefined
  }

  createFiltersFromFacets(toggledFacetFields: ToggledFacetFields) {
    // Generate an object with the checked facet fields as lists eg { LOC_metric: ["27", "29", "30"] }
    // Or if range: { LOC_metric: ["27-29", "31-35"] }
    const result = {}
    Object.keys(toggledFacetFields).forEach(facet => {
      Object.keys(toggledFacetFields[facet]).forEach(facetField => {
        const checked = toggledFacetFields[facet][facetField]
        const isRange = facetField.includes(RANGE_DELIMITER)
        // First checked value for a facet -> no previous ranges to join
        if (checked && result[facet] === undefined) {
          result[facet] = [facetField]
        } else if (checked && isRange) {
          // Incase adjacent ranges are checked eg { CyclomaticComplexity: ["20-22", "22-24"] }
          // join them to a single to make things easier for backend -> { CyclomaticComplexity: ["20-24"] }
          const joined = this.joinAdjacentFacetFilters(facetField, result[facet])
          if (joined) {
            result[facet].splice(-1, 1, joined)
          } else {
            result[facet].push(facetField)
          }
        // Just regular single value eg "42"
        } else if (checked) {
          result[facet].push(facetField)
        }
      })
    })
    return result
  }

  parseFacetFields(facetFields: { [facet: string]: (string | number)[] } = {}) {
    // Counts are returned as list of values where first is the name of the bucket and then its count eg
    // "LOC_metric":["28",15,"29",14,"30",13,"31",12,"32",11,"33",11]
    return Object.keys(facetFields).reduce((acc, facet) => {
      const arr = facetFields[facet]
      let counts = []
      for (let i = 0; i < arr.length; i += 2) {
        counts.push({
          value: arr[i],
          count: arr[i + 1],
        })
      }
      acc[facet] = counts
      return acc
    }, {})
  }

  parseFacetRanges(facetRanges: {
    [facet: string]: {
      counts: (string | number)[]
      start: number
      end: number
      gap: number
    }
  } = {}) {
    // Similar to parseFacetFields, except now the counts are within the range eg
    // "LOC_metric": { "start":28, "end":34, "gap":2, "counts": ["28",39,"30",28,"32",11] }
    return Object.keys(facetRanges).reduce((acc, facet) => {
      const range = facetRanges[facet]
      let counts = []
      for (let i = 0; i < range.counts.length; i += 2) {
        let value = range.counts[i]
        const count = range.counts[i + 1]
        if (i === range.counts.length - 2) {
          value = `${value}${RANGE_DELIMITER}${range.end}`
        } else {
          value = `${value}${RANGE_DELIMITER}${range.counts[i + 2]}`
        }
        counts.push({
          value,
          count,
        })
      }
      acc[facet] = counts
      return acc
    }, {})
  }

  parseSearchResponse(result: ISolrSearchCodeResponse) {
    const docs = result.response.docs.map(r => ({
      ...r,
      date: new Date(r.timestamp),
      highlighted: result.highlighting[r.id].code
    }))
    const facetFields = this.parseFacetFields(result.facet_counts?.facet_fields)
    const facetRanges = this.parseFacetRanges(result.facet_counts?.facet_ranges)
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
    payload.facets = this.currentFacetParams
    payload.facet_filters = this.createFiltersFromFacets(this.toggledFacetFields)
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
    const result = await searchApi.searchAll(this.searchParams)
    if (result === undefined) {
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
