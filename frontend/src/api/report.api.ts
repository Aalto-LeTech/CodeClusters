import { IReport } from 'common'

import {
  authenticatedHeaders,
  get,
} from './methods'

export const getReports = () =>
  get<{reports: IReport[]}>('reports', authenticatedHeaders())

