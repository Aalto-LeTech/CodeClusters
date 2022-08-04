import { config, axiosService } from '../../common'

function url(path: string) {
  return `${config.SOLR_URL}/${path}`
}

interface ISolrResponse {
  responseHeader: {
    status: number
    QTime: number
  }
}

export const solrService = {
  deleteIndexedSubmissions: () => {
    const data = {
      delete: {
        query: '*:*'
      }
    }
    const query = 'commit=true'
    return axiosService.post<ISolrResponse | undefined>(url(`solr/submission-search/update?${query}`), data)
  },
  reindexSubmissions: () => {
    const query = 'command=full-import&entity=submission'
    return axiosService.get<ISolrResponse | undefined>(url(`solr/submission-search/dataimport?${query}`))
  }
}
