import { config, axiosService } from '../../common'

import { ISearchParams, ISolrSearchResponse } from 'shared'

function url(path: string) {
  return `${config.SOLR_URL}/${path}`
}

export const searchService = {
  searchSubmissions: (params: ISearchParams) : Promise<ISolrSearchResponse | undefined> => {
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
    return axiosService.get<ISolrSearchResponse>(url(`solr/gettingstarted/select?${query}`))
  },
  searchSubmissionIds: (params: ISearchParams) : Promise<ISolrSearchResponse | undefined> => {
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
    const general = `q=id:${q}&course_id=${course_id}&exercise_id=${exercise_id}&rows=${num_results}`
    const fields = 'fl=id'
    const query = `${general}&${fields}`
    return axiosService.get<ISolrSearchResponse>(url(`solr/gettingstarted/select?${query}`))
  }
}
