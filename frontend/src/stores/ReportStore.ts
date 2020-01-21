import { action, runInAction, observable } from 'mobx'
import * as reportApi from '../api/report.api'

import { IReportWithDate } from 'common'

export class ReportStore {
  @observable reports: IReportWithDate[] = []

  @action getReports = async () => {
    const result = await reportApi.getReports()
    runInAction(() => {
      if (result) {
        this.reports = result.reports.map(r => ({ ...r, date: new Date(r.timestamp) }))
      }
    })
    return result
  }
}
