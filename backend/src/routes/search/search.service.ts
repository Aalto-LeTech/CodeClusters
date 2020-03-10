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
      // filters,
      // case_sensitive,
      // regex,
      // whole_words,
      // page
    } = params
    // Fields used in the Solr results (required for the highlighting)
    const fields = 'fl=id,+student_id,+course_id,+timestamp'
    // Highlighted fields
    const hlfields = 'hl.fl=code&hl.simple.pre=<mark>&hl.simple.post=</mark>&hl.fragsize=0'
    const query = `q=${q}&course_id=${course_id}&exercise_id=${exercise_id}&hl=on&${fields}&${hlfields}`
    return axiosService.get<ISolrSearchResponse>(url(`solr/gettingstarted/select?${query}`))
  }
}
