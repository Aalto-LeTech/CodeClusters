import { dbService } from '../../db/db.service'

import { ISubmission } from 'shared'
import { ISubmissionCreateParams } from './submission.types'

export const submissionService = {
  getSubmissions: (courseId?: number, exerciseId?: number) => {
    const courseCondition = courseId ? 'WHERE course_id=$1' : ''
    const exerciseCondition = exerciseId ? ' AND exercise_id=$2' : ''
    const params = [courseId, exerciseId].filter(e => e !== undefined)
    return dbService.queryMany<ISubmission>(`
      SELECT submission_id, student_id, course_id, exercise_id, code, timestamp FROM submission
      ${courseCondition} ${exerciseCondition}
    `, params)
  },
  createSubmission: async (params: ISubmissionCreateParams) : Promise<ISubmission | undefined> => {
    const submissions = await dbService.queryOne<ISubmission | undefined>(`
      INSERT INTO submission (student_id, course_id, exercise_id, code)
      VALUES($1, $2, $3, $4) RETURNING submission_id, student_id, course_id, exercise_id, timestamp
    `,
      [params.student_id, params.course_id, params.exercise_id, params.code])
    return submissions
  }
}
