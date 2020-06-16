import { config, axiosService } from '../../common'

import {
  ISearchCodeParams, ISolrSearchCodeResponse, ISolrSearchAllCodeResponse, ISolrSearchAllIdsResponse
} from 'shared'

function url(path: string) {
  return `${config.SOLR_URL}/${path}`
}

export const searchService = {
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
    const general = `q=code:${q}&course_id=${course_id}&exercise_id=${exercise_id}&rows=${num_results}`
    // Fields used in the Solr results (required for the highlighting)
    const fields = 'fl=id,+student_id,+course_id,+timestamp'
    // Highlighted fields
    const hlfields = `hl=on&hl.fl=code&hl.simple.pre=<mark>&hl.simple.post=</mark>&hl.fragsize=${num_lines}&hl.method=unified`
    const query = `${general}&${fields}&${hlfields}`
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
    const general = `q=code:${q}&course_id=${course_id}&exercise_id=${exercise_id}&rows=${num_results}`
    // Fields used in the Solr results (required for the highlighting)
    const fields = 'fl=code,id,+student_id,+course_id,+timestamp'
    const query = `${general}&${fields}`
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
    const general = `q=code:${q}&course_id=${course_id}&exercise_id=${exercise_id}&rows=${num_results}`
    // Fields used in the Solr results (required for the highlighting)
    const fields = 'fl=id,+student_id,+course_id,+timestamp'
    const query = `${general}&${fields}`
    return axiosService.get<ISolrSearchAllIdsResponse>(url(`solr/submission-search/select?${query}`))
  }
}
