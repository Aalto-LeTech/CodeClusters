import { config, axiosService } from '../../common'

import { ISearchParams, ISolrSubmissionResponse } from 'shared'

function url(path: string) {
  return `${config.SOLR_URL}/${path}`
}

export const searchService = {
  searchSubmissions: (params: ISearchParams) : Promise<ISolrSubmissionResponse | undefined> => {
    const {
      q,
      course_id,
      exercise_id,
      // filters,
      // case_sensitive,
      // regex,
      // whole_words,
      // page
    } = params
    // Fields used in the Solr results (required for the highlighting)
    const fields = 'fl=id,+code,+student_id,+course_id,+timestamp'
    // Highlighted fields
    const hlfields = 'hl.fl=code&hl.simple.pre=<mark>&hl.simple.post=</mark>&hl.fragsize=200'
    const query = `q=${q}&course_id=${course_id}&exercise_id=${exercise_id}&hl=on&${fields}&${hlfields}`
    return axiosService.get<ISolrSubmissionResponse>(url(`solr/gettingstarted/select?${query}`))
  }
}
