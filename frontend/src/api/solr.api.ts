import {
  authenticatedHeaders,
  get,
} from './methods'

export const reindexSubmissions = () =>
  get<Object | undefined>('solr/reindex', authenticatedHeaders())
