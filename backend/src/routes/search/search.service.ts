import { dbService } from '../../db/db.service'

import { ISubmission, ISearchParams } from 'shared'

export const searchService = {
  searchSubmissions: (params: ISearchParams) : Promise<ISubmission[] | undefined> => {
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
    if (course_id && exercise_id) {
      return dbService.queryMany<ISubmission>(`
        SELECT id, student_id, course_id, exercise_id, code, timestamp FROM submission
        WHERE code LIKE $1 AND submission.course_id = $2 AND submission.student_id = $3
        LIMIT 20
      `, [`%${q}%`, course_id, exercise_id])
    }
    return dbService.queryMany<ISubmission>(`
      SELECT id, student_id, course_id, exercise_id, code, timestamp FROM submission
      WHERE code LIKE $1
      LIMIT 20
    `, [`%${q}%`, course_id, exercise_id])
  },
}
