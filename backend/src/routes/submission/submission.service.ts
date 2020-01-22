import { dbService } from '../../db/db.service'

import { ISubmission } from 'shared'
import { ISubmissionCreateParams } from './submission.types'

export const submissionService = {
  getSubmissions: async () : Promise<ISubmission[] | undefined> => {
    return await dbService.queryMany<ISubmission>('SELECT id, student_id, course_id, exercise_id, code, timestamp FROM submission')
  },
  createSubmission: async (params: ISubmissionCreateParams) : Promise<ISubmission | undefined> => {
    const submissions = await dbService.queryOne<ISubmission | undefined>(`
      INSERT INTO submission (student_id, course_id, exercise_id, code)
      VALUES($1, $2, $3, $4) RETURNING id, student_id, course_id, exercise_id, timestamp
    `,
      [params.student_id, params.course_id, params.exercise_id, params.code])
    return submissions
  }
}
