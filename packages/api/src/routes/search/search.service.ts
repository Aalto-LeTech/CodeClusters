import qs from 'querystring'
// const { format, createLogger, transports } = pkg

import { config, axiosService } from '../../common'
import { dbService } from '../../db/db.service'

import {
  ISearchCodeParams, ISolrSearchCodeResponse, ISolrSearchAllCodeResponse, ISolrSearchAllIdsResponse,
  IProgrammingLanguageFacets, ISearchFacetParams
} from '@codeclusters/types'

function solrUrl(path: string) {
  return `${config.SOLR_URL}/${path}`
}

function arrayToObject(arr: { [key: string]: string | number | [] }[]) {
  return arr.reduce((acc, cur) => {
    const keys = Object.keys(cur)
    keys.forEach((k) => {
      acc[k] = cur[k]
    })
    return acc
  }, {})
}

/**
 * Creates a filter string that follows the Solr filter query syntax
 * https://lucene.apache.org/solr/guide/8_6/common-query-parameters.html
 * @param obj Object to parse
 */
function createFilters(obj: { [key: string]: string | number | undefined }) {
  return Object.keys(obj).reduce((acc, cur) => {
    if (cur !== undefined && obj[cur] !== undefined) {
      return `${acc}&fq=${cur}:${obj[cur]}`
    }
    return acc
  }, '')
}

function createFacets(obj: { [facet: string]: ISearchFacetParams }) {
  return Object.keys(obj).reduce((acc, facet) => {
    const val = obj[facet]
    if (typeof val === 'object') {
      const range = `f.${facet}.facet.range.start=${val.start}&f.${facet}.facet.range.end=${val.end}&f.${facet}.facet.range.gap=${val.gap}`
      return `${acc}&facet.range=${facet}&${range}&facet.mincount=0`
    }
    if (val) {
      return `${acc}&facet.field=${facet}&facet.mincount=1`
    }
    return acc
  }, '&facet=true')
}

function createFacetFilters(obj: { [facet: string]: string[] }) {
  return Object.keys(obj).reduce((acc, cur) => {
    const statement = obj[cur].reduce((acc, cur, i) => {
      let normalized = cur
      if (cur.includes(' - ')) {
        // An interval that includes leftside value using [ and excludes the rightside with }
        normalized = `[${cur.replace('-', 'TO')}}`
      }
      if (i === 0) return normalized
      return `${acc} OR ${normalized}`
    }, '')
    return `${acc}&fq=${cur}:(${statement})`
  }, '')
}

export const searchService = {
  getSearchSupplementaryData: async () => {
    const stats = await dbService.queryMany<any>(`
      SELECT course_id, exercise_id, CAST(COUNT(submission_id) AS integer) FROM submission
      GROUP BY(course_id, exercise_id)
    `)
    const facets = await dbService.queryMany<IProgrammingLanguageFacets>(`
      SELECT * FROM programming_language_facets
    `)
    return { stats, facets }
  },
  searchSubmissions: (params: ISearchCodeParams) : Promise<ISolrSearchCodeResponse | undefined> => {
    const {
      q,
      course_id,
      exercise_id,
      num_results = 20,
      num_lines = 0,
      facets = {},
      facet_filters = {},
      results_start = 0,
      custom_filters = [],
      // case_sensitive,
      // regex,
      // whole_words,
    } = params
    const usesHighlighting = q !== '*'
    // The query has to be URL encoded properly, otherwise Solr crashes. Weirdly enough this parameter is affected
    const urlEncodedQ = qs.escape(q)
    const general = `q=code:${urlEncodedQ}&rows=${num_results}&start=${results_start}`
    // Used search filters
    const filters = createFilters({ course_id, exercise_id, ...arrayToObject(custom_filters) })
    // Fields used in the Solr results (required for the highlighting), conditional code incase search all -query
    const fields = `&fl=id,+student_id,+course_id,+timestamp${usesHighlighting ? '' : ',+code'}`
    // Used facets, read Lucene's or Solr's documentation to understand their function
    const facetsString = createFacets(facets)
    // Selections of facets used as filters eg fq=LOC_metric:(30 OR 29 OR 28)
    const facetFilters = createFacetFilters(facet_filters)
    // Highlighted fields
    let hlfields = ''
    // Incase the query is "search everything" query, don't use highlighting since it will just highlight everything
    if (usesHighlighting) {
      hlfields = `&hl=on&hl.fl=code&hl.simple.pre=<mark>&hl.simple.post=</mark>&hl.fragsize=${num_lines}&hl.method=unified`
    }
    const query = `${general}${filters}${facetFilters}${facetsString}${fields}${hlfields}`
    return axiosService.get<ISolrSearchCodeResponse>(solrUrl(`solr/submission-search/select?${query}`))
  },
  searchAllSubmissions: (params: ISearchCodeParams) : Promise<ISolrSearchAllCodeResponse | undefined> => {
    const {
      q,
      course_id,
      exercise_id,
      facets = {},
      facet_filters = {},
      results_start = 0,
      custom_filters = [],
      // case_sensitive,
      // regex,
      // whole_words,
    } = params
    // Hard-coded max amount of used submissions.. Probably should be a parameter in the model form
    const numResults = 10000
    // The query has to be URL encoded properly, otherwise Solr crashes. Weirdly enough this parameter is affected
    const urlEncodedQ = qs.escape(q)
    const general = `q=code:${urlEncodedQ}&rows=${numResults}&start=${results_start}`
    // Used search filters
    const filters = createFilters({ course_id, exercise_id, ...arrayToObject(custom_filters) })
    // Fields used in the Solr results (required for the highlighting)
    const fields = '&fl=code,id,+student_id,+course_id,+timestamp'
    // Used facets, read Lucene's or Solr's documentation to understand their function
    const facetsString = createFacets(facets)
    // Selections of facets used as filters eg fq=LOC_metric:(30 OR 29 OR 28)
    const facetFilters = createFacetFilters(facet_filters)
    const query = `${general}${filters}${facetFilters}${facetsString}${fields}`
    return axiosService.get<ISolrSearchAllCodeResponse>(solrUrl(`solr/submission-search/select?${query}`))
  },
  searchAllSubmissionIds: (params: ISearchCodeParams) : Promise<ISolrSearchAllIdsResponse | undefined> => {
    const {
      q,
      course_id,
      exercise_id,
      num_results = 10000,
      facets = {},
      facet_filters = {},
      results_start = 0,
      custom_filters = [],
      // case_sensitive,
      // regex,
      // whole_words,
      // page
    } = params
    // The query has to be URL encoded properly, otherwise Solr crashes. Weirdly enough this parameter is affected
    const urlEncodedQ = qs.escape(q)
    const general = `q=code:${urlEncodedQ}&rows=${num_results}&start=${results_start}`
    // Used search filters
    const filters = createFilters({ course_id, exercise_id, ...arrayToObject(custom_filters) })
    // Fields used in the Solr results (required for the highlighting)
    const fields = '&fl=code,id,+student_id,+course_id,+timestamp'
    // Used facets, read Lucene's or Solr's documentation to understand their function
    const facetsString = createFacets(facets)
    // Selections of facets used as filters eg fq=LOC_metric:(30 OR 29 OR 28)
    const facetFilters = createFacetFilters(facet_filters)
    const query = `${general}${filters}${facetFilters}${facetsString}${fields}`
    return axiosService.get<ISolrSearchAllIdsResponse>(solrUrl(`solr/submission-search/select?${query}`))
  }
}
