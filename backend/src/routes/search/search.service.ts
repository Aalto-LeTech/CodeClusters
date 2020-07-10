import { config, axiosService } from '../../common'
import { dbService } from '../../db/db.service'

import {
  ISearchCodeParams, ISolrSearchCodeResponse, ISolrSearchAllCodeResponse, ISolrSearchAllIdsResponse,
  IProgrammingLanguageFacets
} from 'shared'

function url(path: string) {
  return `${config.SOLR_URL}/${path}`
}

function createFilters(obj: { [key:string]: string | number | undefined }) {
  return Object.keys(obj).reduce((acc, cur) => {
    if (cur !== undefined && obj[cur] !== undefined) {
      return `${acc}&fq=${cur}:${obj[cur]}`
    }
    return acc
  }, '')
}

export const searchService = {
  getSearchSupplementaryData: async () => {
    const stats = await dbService.queryMany<any>(`
      SELECT course_id, exercise_id, COUNT(submission_id) FROM submission
      GROUP BY(course_id, exercise_id)
    `)
    const facets = await dbService.queryMany<IProgrammingLanguageFacets>(`
      SELECT * FROM available_programming_language_facets
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
      // filters,
      // case_sensitive,
      // regex,
      // whole_words,
      // page
    } = params
    const general = `q=code:${q}&rows=${num_results}`
    // Used search filters
    const filters = createFilters({ course_id, exercise_id })
    // Fields used in the Solr results (required for the highlighting)
    const fields = 'fl=id,+student_id,+course_id,+timestamp'
    // Highlighted fields
    const hlfields = `hl=on&hl.fl=code&hl.simple.pre=<mark>&hl.simple.post=</mark>&hl.fragsize=${num_lines}&hl.method=unified`
    const query = `${general}${filters}&${fields}&${hlfields}`
    return axiosService.get<ISolrSearchCodeResponse>(url(`solr/submission-search/select?${query}`))
  },
  searchAllSubmissions: (params: ISearchCodeParams) : Promise<ISolrSearchAllCodeResponse | undefined> => {
    const {
      q,
      course_id,
      exercise_id,
      num_results = 10000,
      // filters,
      // case_sensitive,
      // regex,
      // whole_words,
      // page
    } = params
    const general = `q=code:${q}&rows=${num_results}`
    const filters = createFilters({ course_id, exercise_id })
    // Fields used in the Solr results (required for the highlighting)
    const fields = 'fl=code,id,+student_id,+course_id,+timestamp'
    const query = `${general}${filters}&${fields}`
    return axiosService.get<ISolrSearchAllCodeResponse>(url(`solr/submission-search/select?${query}`))
  },
  searchAllSubmissionIds: (params: ISearchCodeParams) : Promise<ISolrSearchAllIdsResponse | undefined> => {
    const {
      q,
      course_id,
      exercise_id,
      num_results = 10000,
      // filters,
      // case_sensitive,
      // regex,
      // whole_words,
      // page
    } = params
    const general = `q=code:${q}&rows=${num_results}`
    const filters = createFilters({ course_id, exercise_id })
    // Fields used in the Solr results (required for the highlighting)
    const fields = 'fl=id,+student_id,+course_id,+timestamp'
    const query = `${general}${filters}&${fields}`
    return axiosService.get<ISolrSearchAllIdsResponse>(url(`solr/submission-search/select?${query}`))
  }
}
