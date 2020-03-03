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
    const query = `_=1583238245848&q=${q}&course_id${course_id}&exercise_id=${exercise_id}`
    return axiosService.get<ISolrSubmissionResponse>(url(`solr/gettingstarted/select?${query}`))
  }
}
