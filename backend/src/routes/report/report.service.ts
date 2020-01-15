import { dbService } from '../../db/db.service'

import { IReport } from 'common'
import { IReportCreateParams } from './report.types'

export const reportService = {
  getReports: async () : Promise<IReport[] | undefined> => {
    return await dbService.queryMany<IReport>(`
      SELECT report.id AS report_id, submission_id, message, student_id, course_id, exercise_id, code, timestamp FROM report
      JOIN submission ON submission_id = submission.id
    `)
  },
  createReport: async (params: IReportCreateParams) : Promise<IReport | undefined> => {
    const reports = await dbService.queryOne<IReport | undefined>(`
      INSERT INTO report (submission_id, message)
      VALUES($1, $2) RETURNING id, submission_id, message
    `,
      [params.submission_id, params.message])
    return reports
  }
}
